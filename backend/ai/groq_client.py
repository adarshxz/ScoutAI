"""
Shared Groq client helpers for ScoutAI AI features.
"""
import os

from groq import AsyncGroq, Groq


DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"


def groq_model_name() -> str:
    return os.getenv("GROQ_MODEL", DEFAULT_GROQ_MODEL)


def _require_api_key() -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured")
    return api_key


def generate_text(prompt: str, *, temperature: float = 0.2) -> str:
    client = Groq(api_key=_require_api_key())
    response = client.chat.completions.create(
        model=groq_model_name(),
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
    )
    return response.choices[0].message.content or ""


async def generate_text_async(prompt: str, *, temperature: float = 0.2) -> str:
    client = AsyncGroq(api_key=_require_api_key())
    response = await client.chat.completions.create(
        model=groq_model_name(),
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
    )
    return response.choices[0].message.content or ""
