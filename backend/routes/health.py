"""
Health check routes
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "Internship Match Analyzer API",
        "version": "1.0.0",
    }
