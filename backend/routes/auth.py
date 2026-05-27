"""
Authentication routes
Handles user registration, login verification, and profile bootstrap
Note: Primary auth is handled by Supabase client-side.
These endpoints handle backend-specific auth operations.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from middleware.auth import get_current_user
from database.connection import get_db

router = APIRouter()


class UserProfile(BaseModel):
    """Schema for user profile creation after signup"""
    name: str
    email: str
    avatar_url: str = ""


@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    """Get current authenticated user info"""
    try:
        db = get_db()
        result = (
            db.table("profiles")
            .select("*")
            .eq("user_id", user["id"])
            .execute()
        )

        if result.data:
            return {"user": user, "profile": result.data[0]}

        return {"user": user, "profile": None}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("/register")
async def register_profile(
    profile: UserProfile,
    user: dict = Depends(get_current_user),
):
    """
    Create initial profile after Supabase signup.
    Called from frontend after successful registration.
    """
    try:
        db = get_db()

        # Check if profile already exists
        existing = (
            db.table("profiles")
            .select("id")
            .eq("user_id", user["id"])
            .execute()
        )

        if existing.data:
            return {"message": "Profile already exists", "profile": existing.data[0]}

        # Create new profile
        new_profile = {
            "user_id": user["id"],
            "name": profile.name,
            "email": profile.email,
            "avatar_url": profile.avatar_url,
        }

        result = db.table("profiles").insert(new_profile).execute()

        return {"message": "Profile created", "profile": result.data[0]}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
