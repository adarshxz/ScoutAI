"""
AI Career Coach Routes
Uses Gemini with full user context to provide career advice
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import os
import google.generativeai as genai
from middleware.auth import get_current_user
from database.connection import get_db

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ChatMessage(BaseModel):
    role: str
    content: str

class CoachChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]

COACH_SYSTEM_PROMPT = """
You are "ScoutAI", a world-class AI Career Coach specialized in helping students and early-career developers land top-tier internships.
You have access to the user's profile and resume data.

USER CONTEXT:
- Skills: {skills}
- Bio: {bio}
- Recent Resume Score: {resume_score}%

ADVICE GUIDELINES:
1. Be encouraging but honest and data-driven.
2. Focus on actionable steps (e.g. "Add a project using X," "Rewrite this bullet point to show Y").
3. Use the user's current skills to suggest adjacent high-value skills.
4. If they ask about interview prep, give them 2-3 common technical or behavioral questions for their level.
5. Keep responses extremely concise (1-2 short paragraphs maximum) and optimized for the main answer. Cut out unnecessary fluff and get straight to the point.
6. Format your responses for readability (use bullet points when appropriate).

CANDIDATE DATA:
{user_context}
"""

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

        # 2. Setup Gemini Chat with system instructions
        system_instruction = COACH_SYSTEM_PROMPT.format(
            skills=", ".join(skills),
            bio=bio,
            resume_score=resume_score,
            user_context=user_context_str
        )

        # Build message history for Gemini (must start with "user" and alternate)
        gemini_history = []
        for m in req.history:
            role = "user" if m.role == "user" else "model"
            
            # History must start with user
            if not gemini_history and role != "user":
                continue
                
            # Alternating roles validation
            if gemini_history and gemini_history[-1]["role"] == role:
                gemini_history[-1]["parts"][0] += "\n" + m.content
            else:
                gemini_history.append({"role": role, "parts": [m.content]})

        # Initialize the model with dynamic system instructions
        model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
        model = genai.GenerativeModel(model_name, system_instruction=system_instruction)
        chat = model.start_chat(history=gemini_history)
        
        response = chat.send_message(req.message)

        return {"response": response.text}

    except Exception as e:
        print(f"Coach Route Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

