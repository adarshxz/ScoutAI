"""
AI Career Coach Routes
Uses LangChain with full user context to provide career advice
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from ai.coach_chain import generate_coach_response
from middleware.auth import get_current_user
from database.connection import get_db

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class CoachChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]

@router.post("/chat")
async def coach_chat(
    req: CoachChatRequest,
    user: dict = Depends(get_current_user)
):
    """
    1. Fetch user data for context
    2. Build Gemini prompt with history
    3. Return AI response
    """
    try:
        db = get_db()
        user_id = user["id"]

        # 1. Fetch Context Safely
        profile_res = db.table("profiles").select("*").eq("user_id", user_id).execute()
        profile_data = profile_res.data[0] if profile_res.data else {}

        resume_res = db.table("resumes").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
        resume_data = resume_res.data[0] if resume_res.data else {}
        
        name = profile_data.get('name') or "User"
        skills = profile_data.get('skills') or []
        bio = profile_data.get('bio') or ""
        resume_score = resume_data.get('ats_score') or 0

        user_context_str = f"Name: {name}\nSkills: {', '.join(skills)}\nBio: {bio}"
        if resume_data:
            user_context_str += f"\nLatest Resume ATS Score: {resume_score}%"

        # 2. Generate response through the LangChain coach chain
        response = await generate_coach_response(
            message=req.message,
            history=req.history,
            skills=skills,
            bio=bio,
            resume_score=resume_score,
            user_context=user_context_str
        )

        return {"response": response}

    except Exception as e:
        print(f"Coach Route Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
