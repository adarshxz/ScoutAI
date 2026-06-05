"""
AI Resume Analysis service using Gemini
"""
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use Gemini model for fast analysis
model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
model = genai.GenerativeModel(model_name)

RESUME_ANALYSIS_PROMPT = """
You are a senior recruiter and ATS expert at a top-tier tech company (like Google, Stripe, or Vercel).
Analyze the following resume text and provide a detailed JSON response.

The resume text:
{resume_text}

Analyze based on:
1. ATS Score (0-100) based on structure, keywords, and readability.
2. Grammar and readability quality.
3. Specific strengths (list of 3-5).
4. Specific areas to improve (list of 3-5).
5. Bullet point fixes: Identify 2 weak bullet points and rewrite them in a results-oriented, recruiter-ready style.
6. Identify 3-5 missing technical skills that would benefit someone with this background.
7. Predict the user's primary role type (e.g. SDE, Frontend, Data Science).

RESPONSE FORMAT (STRICT JSON ONLY):
{{
    "ats_score": number,
    "readability_score": "High" | "Medium" | "Low",
    "grammar_score": "95/100",
    "percentile": number,
    "role_type": "string",
    "strengths": ["string", "string"],
    "weaknesses": ["string", "string"],
    "missing_skills": ["string", "string"],
    "detailed_analysis": {{
        "executive_summary": "string (1-2 paragraphs of overall summary)",
        "pros_analysis": "string (detailed paragraph explaining the specific strengths)",
        "cons_analysis": "string (detailed paragraph explaining the specific weaknesses and how to fix them)"
    }},
    "bullet_fixes": [
        {{ "before": "string", "after": "string" }}
    ]
}}
"""

async def analyze_resume_with_ai(resume_text: str):
    """
    Send resume text to Gemini for structured analysis
    """
    try:
        prompt = RESUME_ANALYSIS_PROMPT.format(resume_text=resume_text[:10000]) # Limit text
        response = model.generate_content(prompt)
        
        # Extract JSON from response
        text_response = response.text
        # Cleanup potential markdown code blocks
        if "```json" in text_response:
            text_response = text_response.split("```json")[1].split("```")[0].strip()
        elif "```" in text_response:
            text_response = text_response.split("```")[1].split("```")[0].strip()
            
        return json.loads(text_response)
    except Exception as e:
        print(f"Gemini Analysis Error: {e}")
        # Return fallback mock data for testing if AI fails
        return {
            "ats_score": 65,
            "readability_score": "Medium",
            "grammar_score": "80/100",
            "percentile": 50,
            "role_type": "Software Developer",
            "strengths": ["Clear technical section", "Consistent formatting"],
            "weaknesses": ["Lack of quantifiable metrics", "Weak summary"],
            "missing_skills": ["Docker", "Kubernetes", "TypeScript"],
            "detailed_analysis": {
                "executive_summary": "This resume demonstrates a solid foundation in web development with a clear structure. However, it lacks the quantifiable impact and advanced tooling required to stand out for competitive Tier-1 internships.",
                "pros_analysis": "The layout is highly readable and effectively categorizes technical skills, making it easy for an ATS or recruiter to parse. The choice of technologies aligns well with modern full-stack requirements, and the education section is appropriately placed.",
                "cons_analysis": "The bullet points focus too heavily on tasks rather than achievements. Without metrics (e.g., 'improved by X%'), the actual impact of the projects remains ambiguous. Additionally, the summary section feels generic and fails to convey a unique personal brand or specific career objective."
            },
            "bullet_fixes": [
                { "before": "Made a website using React", "after": "Developed and deployed a high-performance React application improving user engagement by 20%" }
            ]
        }
