"""
AI Matching Engine using Gemini
Compares User Profile + Projects + Resume against a Job Description
"""
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Use Gemini 3.5 Flash for fast analysis
model = genai.GenerativeModel('gemini-3.5-flash')

MATCH_PROMPT = """
You are a technical hiring manager at a top-tier tech firm.
Your task is to analyze how well a candidate matches a specific Job Description (JD).

CANDIDATE DATA:
- Skills: {skills}
- Bio: {bio}
- Projects: {projects}
- Latest Resume Analysis Summary: {resume_analysis}
- GitHub Developer Profile Stats & Insights: {github_portfolio}

JOB DESCRIPTION:
{jd_text}

Analyze and provide a detailed JSON response.

SCORING RULES:
- overall_score: Weighted average (Skills 30%, Projects 25%, GitHub 20%, Resume 25%)
- individual_scores: Breakdown of how they match in specific categories (0-100). Make sure github_score accurately reflects their public repositories, active languages, and calculated activity score.

RESPONSE FORMAT (STRICT JSON ONLY):
{{
    "overall_score": number,
    "skills_score": number,
    "projects_score": number,
    "github_score": number,
    "resume_score": number,
    "summary": "string (2-3 sentences)",
    "strengths": ["string", "string"],
    "missing_skills": ["string", "string"],
    "recommendations": ["string (actionable advice)", "string"]
}}
"""

async def calculate_match_score(jd_text: str, user_data: dict):
    """
    Send JD and User Data to Gemini for semantic matching
    """
    try:
        # Format candidate data for prompt
        skills_raw = user_data.get("profile", {}).get("skills", [])
        skills = ", ".join(skills_raw if skills_raw else [])
        bio = user_data.get("profile", {}).get("bio", "")
        
        projects_list = user_data.get("projects", [])
        projects_str = "\n".join([f"- {p['title']}: {p['description']} (Tech: {', '.join(p['tech_stack'])})" for p in projects_list])
        
        resume_analysis = user_data.get("resume", {}).get("analysis", {})
        resume_str = json.dumps(resume_analysis)

        # Parse GitHub data if available
        github_data = user_data.get("github", {})
        github_str = "No GitHub profile analyzed yet."
        if github_data:
            github_username = github_data.get("github_username", "")
            activity_score = github_data.get("activity_score", 0)
            total_repos = github_data.get("total_repos", 0)
            languages = ", ".join([f"{k} ({v}%)" for k, v in github_data.get("languages", {}).items()])
            top_repos = "\n".join([f"  * {r.get('name')}: {r.get('description')} (Stars: {r.get('stars', 0)}, Forks: {r.get('forks', 0)})" for r in github_data.get("top_repos", [])])
            analysis = github_data.get("analysis", {})
            estimated_level = analysis.get("estimated_level", "Junior")
            tech_summary = analysis.get("tech_stack_summary", "")
            
            github_str = f"""
Username: @{github_username}
Activity Score: {activity_score}/100
Total Public Repositories: {total_repos}
Estimated Technical Level: {estimated_level}
Top Languages: {languages}
Tech Stack Summary: {tech_summary}
Top Public Repositories:
{top_repos}
"""

        prompt = MATCH_PROMPT.format(
            skills=skills,
            bio=bio,
            projects=projects_str,
            resume_analysis=resume_str,
            github_portfolio=github_str,
            jd_text=jd_text[:10000]
        )

        response = model.generate_content(prompt)
        text_response = response.text
        
        # Cleanup potential markdown code blocks
        if "```json" in text_response:
            text_response = text_response.split("```json")[1].split("```")[0].strip()
        elif "```" in text_response:
            text_response = text_response.split("```")[1].split("```")[0].strip()
            
        return json.loads(text_response)
        
    except Exception as e:
        print(f"Match Engine Error: {e}")
        # Return fallback
        return {
            "overall_score": 0,
            "skills_score": 0,
            "projects_score": 0,
            "github_score": 0,
            "resume_score": 0,
            "summary": "We couldn't analyze the match at this time.",
            "strengths": [],
            "missing_skills": [],
            "recommendations": ["Try again later."]
        }
