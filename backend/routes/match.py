"""
Matching Engine Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from middleware.auth import get_current_user
from database.connection import get_db
from ai.matcher import calculate_match_score
from ai.roadmap_graph import generate_career_roadmap

router = APIRouter()

class MatchRequest(BaseModel):
    jd_text: str

class RoadmapRequest(BaseModel):
    target_role: str
    jd_text: str = ""


def _load_user_data(db, user_id: str):
    # Profile
    profile_res = db.table("profiles").select("*").eq("user_id", user_id).single().execute()
    
    # Projects
    projects_res = db.table("projects").select("*").eq("user_id", user_id).execute()
    
    # Latest Resume Analysis
    resume_res = db.table("resumes") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()
        
    # Latest GitHub Analysis
    github_res = db.table("github_analysis") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()
    
    return {
        "profile": profile_res.data if profile_res.data else {},
        "projects": projects_res.data if projects_res.data else [],
        "resume": resume_res.data[0] if resume_res.data else {},
        "github": github_res.data[0] if github_res.data else {}
    }

@router.post("/analyze")
async def analyze_match(
    req: MatchRequest,
    user: dict = Depends(get_current_user)
):
    """
    1. Fetch all user data (Profile, Projects, latest Resume)
    2. Run AI Match Engine
    3. Store result in history
    4. Return analysis
    """
    try:
        db = get_db()
        user_id = user["id"]

        # 1. Gather Data
        user_data = _load_user_data(db, user_id)

        # 2. AI Match
        match_result = await calculate_match_score(req.jd_text, user_data)

        # 3. Store in DB
        db_data = {
            "user_id": user_id,
            "overall_score": match_result.get("overall_score", 0),
            "skills_score": match_result.get("skills_score", 0),
            "projects_score": match_result.get("projects_score", 0),
            "github_score": match_result.get("github_score", 0),
            "resume_score": match_result.get("resume_score", 0),
            "strengths": match_result.get("strengths", []),
            "missing_skills": match_result.get("missing_skills", []),
            "recommendations": match_result.get("recommendations", []),
            "detailed_analysis": match_result.get("detailed_analysis", {})
        }
        db.table("match_results").insert(db_data).execute()

        # 4. History
        history_data = {
            "user_id": user_id,
            "action_type": "job_match",
            "title": f"Job Match Analysis",
            "description": f"Overall Match: {match_result.get('overall_score', 0)}%",
            "metadata": {"match_score": match_result.get("overall_score", 0)}
        }
        db.table("history").insert(history_data).execute()

        return match_result

    except Exception as e:
        print(f"Match Route Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/roadmap")
async def create_career_roadmap(
    req: RoadmapRequest,
    user: dict = Depends(get_current_user)
):
    """
    1. Fetch profile, projects, latest resume, and latest GitHub analysis
    2. Run LangGraph roadmap workflow
    3. Store in history
    4. Return roadmap
    """
    try:
        db = get_db()
        user_id = user["id"]

        user_data = _load_user_data(db, user_id)
        roadmap = await generate_career_roadmap(
            target_role=req.target_role,
            user_data=user_data,
            jd_text=req.jd_text
        )

        history_data = {
            "user_id": user_id,
            "action_type": "career_roadmap",
            "title": f"Career Roadmap: {req.target_role}",
            "description": roadmap.get("summary", "Generated a personalized career roadmap."),
            "metadata": {
                "target_role": req.target_role,
                "workflow": roadmap.get("workflow", "langgraph_career_roadmap")
            }
        }
        db.table("history").insert(history_data).execute()

        return roadmap

    except Exception as e:
        print(f"Roadmap Route Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
