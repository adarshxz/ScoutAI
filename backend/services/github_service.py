"""
GitHub Intelligence Service
Fetches and analyzes a candidate's GitHub repositories, calculates an activity score,
and uses Gemini AI to evaluate their code quality and technical stack.
"""
import os
import asyncio
import json
import httpx
import google.generativeai as genai
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

# Setup Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
model = genai.GenerativeModel(model_name)

GITHUB_ANALYSIS_PROMPT = """
You are a senior technical recruiter and principal engineer. 
Analyze this GitHub developer profile data and return a JSON evaluation.

Username: {username}
Total Repositories: {total_repos}
Top Languages: {languages}
Top Repositories: {top_repos}

Evaluate the following:
1. Tech Stack Overview: Summarize their primary competencies.
2. Strengths: List 2-3 specific technical strengths indicated by their repositories.
3. Areas to Improve: List 2-3 specific recommendations for their portfolio or repository structure.
4. Estimated Level: Junior, Mid-Level, or Senior.
5. Project Highlight: Short positive feedback on their best repository.

RESPONSE FORMAT (STRICT JSON ONLY):
{{
    "tech_stack_summary": "string",
    "strengths": ["string", "string"],
    "areas_to_improve": ["string", "string"],
    "estimated_level": "Junior" | "Mid-Level" | "Senior",
    "project_highlight": "string"
}}
"""

async def fetch_github_profile(username: str) -> Dict[str, Any]:
    """
    Fetch public repositories and profile stats for a GitHub user
    """
    headers = {}
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
    
    # We will use httpx for async HTTP requests
    async with httpx.AsyncClient() as client:
        # Fetch user general details
        user_url = f"https://api.github.com/users/{username}"
        user_res = await client.get(user_url, headers=headers)
        
        if user_res.status_code != 200:
            raise ValueError(f"GitHub user not found: {username}")
            
        user_data = user_res.json()
        
        # Fetch public repositories
        repos_url = f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated"
        repos_res = await client.get(repos_url, headers=headers)
        repos_data = repos_res.json() if repos_res.status_code == 200 else []
        
        return {
            "profile": user_data,
            "repos": repos_data
        }

async def analyze_github_profile(username: str) -> Dict[str, Any]:
    """
    Analyze GitHub repositories and profile metrics, and generate AI insights
    """
    try:
        data = await fetch_github_profile(username)
        repos = data["repos"]
        profile = data["profile"]
        
        total_repos = len(repos)
        
        # 1. Analyze Languages & Stars
        lang_counts = {}
        top_repos = []
        total_stars = 0
        total_forks = 0
        
        for repo in repos:
            if repo.get("fork"):
                continue  # Skip forked repos
                
            total_stars += repo.get("stargazers_count", 0)
            total_forks += repo.get("forks_count", 0)
            
            # Languages
            lang = repo.get("language")
            if lang:
                lang_counts[lang] = lang_counts.get(lang, 0) + 1
                
            # Collect top repos
            top_repos.append({
                "name": repo.get("name"),
                "description": repo.get("description") or "No description",
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "url": repo.get("html_url")
            })
            
        # Sort top repos by stars desc
        top_repos = sorted(top_repos, key=lambda x: x["stars"], reverse=True)[:5]
        
        # Calculate Language Percentages
        total_valid_langs = sum(lang_counts.values())
        languages_pct = {}
        if total_valid_langs > 0:
            languages_pct = {k: round((v / total_valid_langs) * 100, 1) for k, v in lang_counts.items()}
            
        # 2. Activity Score Calculation (0 - 100)
        # Base: Number of original repositories (up to 40 pts)
        repo_points = min(total_repos * 4, 40)
        # Stars: Recognition (up to 30 pts)
        star_points = min(total_stars * 5, 30)
        # Forks & Social: Collaboration (up to 30 pts)
        fork_points = min((total_forks * 10) + (profile.get("followers", 0) * 2), 30)
        
        activity_score = round(repo_points + star_points + fork_points, 1)
        
        # 3. AI Analysis with Gemini (with retry for rate limits)
        prompt = GITHUB_ANALYSIS_PROMPT.format(
            username=username,
            total_repos=total_repos,
            languages=str(languages_pct),
            top_repos=str([{ "name": r["name"], "desc": r["description"] } for r in top_repos])
        )
        
        ai_insights = None
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = model.generate_content(prompt)
                text_response = response.text
                
                # Clean potential markdown JSON fencing
                if "```json" in text_response:
                    text_response = text_response.split("```json")[1].split("```")[0].strip()
                elif "```" in text_response:
                    text_response = text_response.split("```")[1].split("```")[0].strip()
                    
                ai_insights = json.loads(text_response)
                break  # Success, exit retry loop
            except Exception as gemini_err:
                err_str = str(gemini_err)
                if "429" in err_str and attempt < max_retries - 1:
                    wait_time = 20 * (attempt + 1)  # 20s, 40s
                    print(f"Gemini rate limited (attempt {attempt + 1}/{max_retries}). Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
                else:
                    raise gemini_err
        
        return {
            "github_username": username,
            "total_repos": total_repos,
            "total_commits": profile.get("public_gists", 0) + (total_repos * 15), # Mock commit estimate for speed
            "languages": languages_pct,
            "top_repos": top_repos,
            "activity_score": activity_score,
            "analysis": ai_insights
        }
        
    except ValueError as e:
        # GitHub user not found
        print(f"GitHub Analysis Error (User Not Found): {e}")
        raise ValueError(str(e))
    except Exception as e:
        print(f"GitHub Analysis Error: {e}")
        import traceback
        traceback.print_exc()
        raise RuntimeError(f"GitHub analysis failed: {str(e)}")
