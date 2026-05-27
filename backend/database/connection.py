"""
Database connection and session management using Supabase
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()


def get_supabase_client() -> Client:
    """Create and return a Supabase client instance"""
    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_SERVICE_KEY", "")

    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")

    return create_client(url, key)


# Singleton client for reuse
supabase: Client = None


def get_db() -> Client:
    """Get or create the Supabase client singleton"""
    global supabase
    if supabase is None:
        supabase = get_supabase_client()
    return supabase
