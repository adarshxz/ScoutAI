"""
ScoutAI — FastAPI Backend
Main application entry point
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.auth import router as auth_router
from routes.profile import router as profile_router
from routes.resume import router as resume_router
from routes.match import router as match_router
from routes.coach import router as coach_router
from routes.health import router as health_router

load_dotenv()

app = FastAPI(
    title="ScoutAI API",
    description="AI-powered career intelligence and resume analysis platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
        "http://localhost:5177",
        "http://127.0.0.1:5177",
        os.getenv("FRONTEND_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router, tags=["Health"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profile_router, prefix="/api/profile", tags=["Profile"])
app.include_router(resume_router, prefix="/api/resume", tags=["Resume"])
app.include_router(match_router, prefix="/api/match", tags=["Matching"])
app.include_router(coach_router, prefix="/api/coach", tags=["Career Coach"])


@app.get("/")
async def root():
    return {
        "app": "ScoutAI API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }
