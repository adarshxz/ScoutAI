from pydantic import BaseModel
from typing import Optional, List

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None

try:
    p = ProfileUpdate(**{"name": "Adarsh", "bio": "Hello", "extra_field": "ignore me"})
    print(p.model_dump(exclude_none=True))
except Exception as e:
    print(f"Error: {e}")
