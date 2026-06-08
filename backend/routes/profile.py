"""
Profile management routes
Full CRUD for user profiles, projects, and skills
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from middleware.auth import get_current_user
from database.connection import get_db
from services.github_service import analyze_github_profile

router = APIRouter()


class ProfileUpdate(BaseModel):
    """Schema for profile update"""
    name: Optional[str] = None
    bio: Optional[str] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None
    skills: Optional[List[str]] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    certifications: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    hackathons: Optional[List[str]] = None


class ProjectCreate(BaseModel):
    """Schema for creating a project"""
    title: str
    description: str
    tech_stack: List[str]
    github_link: Optional[str] = None
    live_demo_link: Optional[str] = None
    role: Optional[str] = None
    team_size: Optional[int] = None
    category: Optional[str] = None


class GithubAnalysisRequest(BaseModel):
    """Schema for requesting GitHub profile analysis"""
    github_username: str


@router.get("/")
async def get_profile(user: dict = Depends(get_current_user)):
    """Get full user profile"""
    try:
        db = get_db()
        result = (
            db.table("profiles")
            .select("*")
            .eq("user_id", user["id"])
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found",
            )

        return {"profile": result.data[0]}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.put("/")
async def update_profile(
    profile: ProfileUpdate,
    user: dict = Depends(get_current_user),
):
    """Update user profile"""
    try:
        db = get_db()
        update_data = profile.model_dump(exclude_none=True)

        result = (
            db.table("profiles")
            .update(update_data)
            .eq("user_id", user["id"])
            .execute()
        )

        return {"message": "Profile updated", "profile": result.data[0] if result.data else None}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.get("/projects")
async def get_projects(user: dict = Depends(get_current_user)):
    """Get all user projects"""
    try:
        db = get_db()
        result = (
            db.table("projects")
            .select("*")
            .eq("user_id", user["id"])
            .order("created_at", desc=True)
            .execute()
        )

        return {"projects": result.data}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("/projects")
async def create_project(
    project: ProjectCreate,
    user: dict = Depends(get_current_user),
):
    """Create a new project"""
    try:
        db = get_db()
        project_data = project.model_dump()
        project_data["user_id"] = user["id"]

        result = db.table("projects").insert(project_data).execute()

        return {"message": "Project created", "project": result.data[0]}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("/github/analyze")
async def analyze_user_github(
    req: GithubAnalysisRequest,
    user: dict = Depends(get_current_user)
):
    """
    1. Fetch developer profile and repos from GitHub API
    2. Run Gemini AI analyzer to evaluate code and level
    3. Save the results in `github_analysis` table
    4. Auto-update the profile's github_url and append parsed languages as skills
    5. Track in History and return analysis
    """
    try:
        db = get_db()
        user_id = user["id"]
        username = req.github_username.strip()

        if not username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="GitHub username cannot be empty"
            )

        # 1 & 2. Run GitHub analyzer (fetches from API & analyzes with Gemini)
        analysis_res = await analyze_github_profile(username)

        # 3. Store in Supabase `github_analysis` table
        github_data = {
            "user_id": user_id,
            "github_username": username,
            "total_repos": analysis_res["total_repos"],
            "total_commits": analysis_res["total_commits"],
            "languages": analysis_res["languages"],
            "top_repos": analysis_res["top_repos"],
            "activity_score": analysis_res["activity_score"],
            "analysis": analysis_res["analysis"]
        }
        db.table("github_analysis").insert(github_data).execute()

        # 4. Update the user profile (save github url and merge top languages into skills)
        profile_res = db.table("profiles").select("skills").eq("user_id", user_id).execute()
        current_skills = []
        if profile_res.data and profile_res.data[0].get("skills"):
            current_skills = profile_res.data[0]["skills"]

        # Merge new languages
        new_languages = list(analysis_res["languages"].keys())
        merged_skills = list(set(current_skills + new_languages))

        profile_update = {
            "github_url": f"https://github.com/{username}",
            "skills": merged_skills
        }
        db.table("profiles").update(profile_update).eq("user_id", user_id).execute()

        # 5. Track in History
        history_data = {
            "user_id": user_id,
            "action_type": "github_analysis",
            "title": f"Analyzed GitHub: {username}",
            "description": f"Activity Score: {analysis_res['activity_score']}/100",
            "metadata": {"activity_score": analysis_res["activity_score"]}
        }
        db.table("history").insert(history_data).execute()

        return analysis_res

    except ValueError as e:
        # GitHub user not found
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except RuntimeError as e:
        # Rate limit exceeded or GitHub API error
        error_msg = str(e)
        if "rate limit" in error_msg.lower():
            raise HTTPException(
                status_code=429,
                detail=error_msg,
            )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=error_msg,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.get("/history")
async def get_user_history(user: dict = Depends(get_current_user)):
    """Get all user activity history"""
    try:
        db = get_db()
        result = (
            db.table("history")
            .select("*")
            .eq("user_id", user["id"])
            .order("created_at", desc=True)
            .execute()
        )

        return {"history": result.data}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
