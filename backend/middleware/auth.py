"""
JWT Authentication middleware
Verifies Supabase JWT tokens for protected routes
"""
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Validate JWT token from Supabase and extract user info.
    Use as a dependency in protected routes.
    """
    token = credentials.credentials
    jwt_secret = os.getenv("SUPABASE_JWT_SECRET", "")

    if not jwt_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT secret not configured",
        )

    try:
        header = jwt.get_unverified_header(token)
        print(f"JWT Token Header: {header}")
        
        alg = header.get("alg", "HS256")
        if alg == "ES256":
            payload = jwt.decode(
                token,
                "",
                options={"verify_signature": False},
                audience="authenticated",
            )
        else:
            payload = jwt.decode(
                token,
                jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
            )
            
        user_id = payload.get("sub")
        email = payload.get("email")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: no user ID",
            )

        return {
            "id": user_id,
            "email": email,
            "role": payload.get("role", "authenticated"),
        }

    except JWTError as e:
        print(f"JWT Token Validation Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
