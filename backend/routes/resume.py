"""
Resume Analysis Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import httpx
import os
import tempfile
from middleware.auth import get_current_user
from database.connection import get_db
from parsers.resume_parser import extract_text_from_pdf, extract_text_from_docx
from ai.resume_analyzer import analyze_resume_with_ai

router = APIRouter()

class ResumeAnalysisRequest(BaseModel):
    file_url: str
    file_name: str
    file_type: str

@router.post("/analyze")
async def analyze_resume(
    req: ResumeAnalysisRequest,
    user: dict = Depends(get_current_user)
):
    """
    1. Download file from Supabase URL
    2. Parse text based on type
    3. Analyze with Gemini AI
    4. Store results in Database
    5. Return analysis
    """
    try:
        # 1. Download file
        async with httpx.AsyncClient() as client:
            response = await client.get(req.file_url)
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Could not download file from storage")
            
        # 2. Extract Text
        with tempfile.NamedTemporaryFile(delete=True, suffix=f".{req.file_type}") as tmp:
            tmp.write(response.content)
            tmp.flush()
            
            if req.file_type.lower() == "pdf":
                raw_text = extract_text_from_pdf(tmp.name)
            elif req.file_type.lower() in ["docx", "doc"]:
                raw_text = extract_text_from_docx(tmp.name)
            else:
                raise HTTPException(status_code=400, detail="Unsupported file format")

        if not raw_text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume")

        # 3. AI Analysis
        analysis = await analyze_resume_with_ai(raw_text)

        # 4. Store in Supabase
        db = get_db()
        resume_data = {
            "user_id": user["id"],
            "file_name": req.file_name,
            "file_url": req.file_url,
            "file_type": req.file_type,
            "raw_text": raw_text,
            "ats_score": analysis.get("ats_score", 0),
            "analysis": analysis
        }
        
        result = db.table("resumes").insert(resume_data).execute()

        # 5. Track in History
        history_data = {
            "user_id": user["id"],
            "action_type": "resume_analysis",
            "title": f"Analyzed Resume: {req.file_name}",
            "description": f"ATS Score: {analysis.get('ats_score', 0)}%",
            "metadata": {"ats_score": analysis.get("ats_score", 0)}
        }
        db.table("history").insert(history_data).execute()

        return analysis

    except Exception as e:
        print(f"Resume Analysis Route Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/history")
async def get_resume_history(user: dict = Depends(get_current_user)):
    """Get all resume analysis history for current user"""
    try:
        db = get_db()
        result = db.table("resumes") \
            .select("*") \
            .eq("user_id", user["id"]) \
            .order("created_at", desc=True) \
            .execute()
        return {"history": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
