"""
LangChain-powered career coach.
"""
import os
from typing import Iterable

import google.generativeai as genai
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableLambda


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


def _model():
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    return genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-3.5-flash"))


async def _call_gemini(prompt_value) -> str:
    response = await _model().generate_content_async(prompt_value.to_string())
    return response.text


def _to_langchain_history(history: Iterable) -> list:
    messages = []
    for item in history:
        role = getattr(item, "role", "")
        content = getattr(item, "content", "")
        if not content:
            continue
        if role == "user":
            messages.append(HumanMessage(content=content))
        elif role in {"assistant", "model"}:
            messages.append(AIMessage(content=content))
    return messages


async def generate_coach_response(
    *,
    message: str,
    history: Iterable,
    skills: list[str],
    bio: str,
    resume_score: int | float,
    user_context: str,
) -> str:
    """
    Generate a context-aware coach reply with LangChain.
    """
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", COACH_SYSTEM_PROMPT),
            MessagesPlaceholder("history"),
            ("human", "{message}"),
        ]
    )
    chain = prompt | RunnableLambda(_call_gemini)

    return await chain.ainvoke(
        {
            "message": message,
            "history": _to_langchain_history(history),
            "skills": ", ".join(skills),
            "bio": bio,
            "resume_score": resume_score,
            "user_context": user_context,
        }
    )
