import asyncio
import os
from dotenv import load_dotenv
load_dotenv()
from database.connection import get_db
from ai.matcher import calculate_match_score

async def test():
    db = get_db()
    # Find any user ID
    user_res = db.table("profiles").select("user_id").limit(1).execute()
    if not user_res.data:
        print("No users found")
        return
    user_id = user_res.data[0]["user_id"]
    
    print(f"Testing for user_id: {user_id}")
    
    profile_res = db.table("profiles").select("*").eq("user_id", user_id).single().execute()
    projects_res = db.table("projects").select("*").eq("user_id", user_id).execute()
    resume_res = db.table("resumes").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
    
    user_data = {
        "profile": profile_res.data if profile_res.data else {},
        "projects": projects_res.data if projects_res.data else [],
        "resume": resume_res.data[0] if resume_res.data else {}
    }
    
    jd_text = "React Node.js Frontend Developer"
    try:
        # Just run the formatting part to see if it crashes before AI
        skills_raw = user_data.get("profile", {}).get("skills", [])
        skills = ", ".join(skills_raw if skills_raw else [])
        bio = user_data.get("profile", {}).get("bio", "")
        projects_list = user_data.get("projects", [])
        projects_str = "\n".join([f"- {p['title']}: {p['description']} (Tech: {', '.join(p['tech_stack'])})" for p in projects_list])
        print("Data formatting successful!")
    except Exception as e:
        print(f"Data formatting Error: {e}")
        return
        
    print("Running AI...")
    res = await calculate_match_score(jd_text, user_data)
    print("Result:", res)

asyncio.run(test())
