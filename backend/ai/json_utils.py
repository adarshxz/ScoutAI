"""
Helpers for parsing structured AI responses.
"""
import json
from typing import Any


def extract_json(text: str) -> Any:
    """Parse JSON from a model response that may include markdown fences."""
    cleaned = text.strip()

    if "```json" in cleaned:
        cleaned = cleaned.split("```json", 1)[1].split("```", 1)[0].strip()
    elif "```" in cleaned:
        cleaned = cleaned.split("```", 1)[1].split("```", 1)[0].strip()

    return json.loads(cleaned)
