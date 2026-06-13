"""
LangGraph-powered matching engine.
Compares user profile, projects, resume, and GitHub data against a job description.
"""
import json
import os
from typing import Any, TypedDict

import google.generativeai as genai
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda
from langgraph.graph import END, START, StateGraph

from ai.json_utils import extract_json

load_dotenv()


class MatchGraphState(TypedDict, total=False):
    jd_text: str
    user_data: dict
    candidate_context: str
    jd_analysis: dict
    category_scores: dict
    match_result: dict


def _model(temperature: float = 0.2):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    generation_config = genai.types.GenerationConfig(temperature=temperature)
    return genai.GenerativeModel(
        os.getenv("GEMINI_MODEL", "gemini-3.5-flash"),
        generation_config=generation_config,
    )


def _gemini_runnable(temperature: float = 0.2):
    async def _call(prompt_value) -> str:
        response = await _model(temperature).generate_content_async(
            prompt_value.to_string()
        )
        return response.text

    return RunnableLambda(_call)


def _message_text(response) -> str:
    content = getattr(response, "content", response)
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "\n".join(
            part.get("text", str(part)) if isinstance(part, dict) else str(part)
            for part in content
        )
    return str(content)


def _safe_list(value: Any) -> list:
    return value if isinstance(value, list) else []


def _format_candidate_context(user_data: dict) -> str:
    profile = user_data.get("profile", {}) or {}
    skills = ", ".join(_safe_list(profile.get("skills")))
    bio = profile.get("bio", "")

    projects = []
    for project in _safe_list(user_data.get("projects")):
        tech_stack = ", ".join(_safe_list(project.get("tech_stack")))
        projects.append(
            f"- {project.get('title', 'Untitled')}: {project.get('description', '')} "
            f"(Tech: {tech_stack})"
        )
    projects_str = "\n".join(projects) or "No projects added yet."

    resume_analysis = json.dumps(
        (user_data.get("resume", {}) or {}).get("analysis", {}),
        ensure_ascii=False,
    )

    github_data = user_data.get("github", {}) or {}
    github_str = "No GitHub profile analyzed yet."
    if github_data:
        languages = ", ".join(
            f"{name} ({pct}%)"
            for name, pct in (github_data.get("languages", {}) or {}).items()
        )
        top_repos = "\n".join(
            f"  * {repo.get('name')}: {repo.get('description')} "
            f"(Stars: {repo.get('stars', 0)}, Forks: {repo.get('forks', 0)})"
            for repo in _safe_list(github_data.get("top_repos"))
        )
        analysis = github_data.get("analysis", {}) or {}
        github_str = f"""
Username: @{github_data.get("github_username", "")}
Activity Score: {github_data.get("activity_score", 0)}/100
Total Public Repositories: {github_data.get("total_repos", 0)}
Estimated Technical Level: {analysis.get("estimated_level", "Junior")}
Top Languages: {languages}
Tech Stack Summary: {analysis.get("tech_stack_summary", "")}
Top Public Repositories:
{top_repos}
"""

    return f"""
PROFILE
Skills: {skills}
Bio: {bio}

PROJECTS
{projects_str}

LATEST RESUME ANALYSIS
{resume_analysis}

GITHUB PORTFOLIO
{github_str}
"""


async def _prepare_context(state: MatchGraphState) -> MatchGraphState:
    return {"candidate_context": _format_candidate_context(state["user_data"])}


async def _analyze_job_description(state: MatchGraphState) -> MatchGraphState:
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You extract hiring requirements from job descriptions. Return strict JSON only.",
            ),
            (
                "human",
                """
Analyze this job description:

{jd_text}

Return this JSON shape:
{{
  "target_role": "string",
  "seniority": "Intern" | "Entry-Level" | "Junior" | "Mid-Level" | "Senior" | "Unknown",
  "required_skills": ["string"],
  "preferred_skills": ["string"],
  "core_responsibilities": ["string"],
  "keywords": ["string"]
}}
""",
            ),
        ]
    )
    chain = prompt | _gemini_runnable()
    response = await chain.ainvoke({"jd_text": state["jd_text"][:10000]})
    return {"jd_analysis": extract_json(_message_text(response))}


async def _score_candidate(state: MatchGraphState) -> MatchGraphState:
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a technical hiring manager scoring candidate-job fit. Return strict JSON only.",
            ),
            (
                "human",
                """
CANDIDATE DATA:
{candidate_context}

JOB REQUIREMENTS:
{jd_analysis}

Score the candidate against the job.

SCORING RULES:
- skills_score: skills alignment with required and preferred skills.
- projects_score: relevance and proof from projects.
- github_score: public repository quality, languages, and activity.
- resume_score: resume quality and role fit from latest analysis.
- Each score must be 0-100.

Return this JSON shape:
{{
  "skills_score": number,
  "projects_score": number,
  "github_score": number,
  "resume_score": number,
  "strengths": ["string"],
  "missing_skills": ["string"],
  "score_reasoning": {{
    "skills": "string",
    "projects": "string",
    "github": "string",
    "resume": "string"
  }}
}}
""",
            ),
        ]
    )
    chain = prompt | _gemini_runnable()
    response = await chain.ainvoke(
        {
            "candidate_context": state["candidate_context"],
            "jd_analysis": json.dumps(state["jd_analysis"], ensure_ascii=False),
        }
    )
    return {"category_scores": extract_json(_message_text(response))}


async def _generate_final_result(state: MatchGraphState) -> MatchGraphState:
    scores = state["category_scores"]
    skills_score = float(scores.get("skills_score", 0) or 0)
    projects_score = float(scores.get("projects_score", 0) or 0)
    github_score = float(scores.get("github_score", 0) or 0)
    resume_score = float(scores.get("resume_score", 0) or 0)
    overall_score = round(
        (skills_score * 0.30)
        + (projects_score * 0.25)
        + (github_score * 0.20)
        + (resume_score * 0.25),
        1,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You create concise job-match summaries for early-career developers. Return strict JSON only.",
            ),
            (
                "human",
                """
JOB ANALYSIS:
{jd_analysis}

CANDIDATE SCORES:
{category_scores}

OVERALL SCORE:
{overall_score}

Create the final user-facing match result.

Return this JSON shape:
{{
  "summary": "string (2-3 sentences)",
  "recommendations": ["string", "string", "string"]
}}
""",
            ),
        ]
    )
    chain = prompt | _gemini_runnable(temperature=0.3)
    response = await chain.ainvoke(
        {
            "jd_analysis": json.dumps(state["jd_analysis"], ensure_ascii=False),
            "category_scores": json.dumps(scores, ensure_ascii=False),
            "overall_score": overall_score,
        }
    )
    final_text = extract_json(_message_text(response))

    result = {
        "overall_score": overall_score,
        "skills_score": skills_score,
        "projects_score": projects_score,
        "github_score": github_score,
        "resume_score": resume_score,
        "summary": final_text.get("summary", ""),
        "strengths": scores.get("strengths", []),
        "missing_skills": scores.get("missing_skills", []),
        "recommendations": final_text.get("recommendations", []),
        "detailed_analysis": {
            "job_analysis": state["jd_analysis"],
            "score_reasoning": scores.get("score_reasoning", {}),
            "workflow": "langgraph_match_engine",
        },
    }
    return {"match_result": result}


def _build_match_graph():
    graph = StateGraph(MatchGraphState)
    graph.add_node("prepare_context", _prepare_context)
    graph.add_node("analyze_job_description", _analyze_job_description)
    graph.add_node("score_candidate", _score_candidate)
    graph.add_node("generate_final_result", _generate_final_result)

    graph.add_edge(START, "prepare_context")
    graph.add_edge("prepare_context", "analyze_job_description")
    graph.add_edge("analyze_job_description", "score_candidate")
    graph.add_edge("score_candidate", "generate_final_result")
    graph.add_edge("generate_final_result", END)
    return graph.compile()


match_graph = _build_match_graph()


async def calculate_match_score(jd_text: str, user_data: dict):
    """
    Run the LangGraph matching workflow and return the existing frontend response shape.
    """
    try:
        final_state = await match_graph.ainvoke(
            {
                "jd_text": jd_text,
                "user_data": user_data,
            }
        )
        return final_state["match_result"]
    except Exception as e:
        print(f"Match Engine Error: {e}")
        return {
            "overall_score": 0,
            "skills_score": 0,
            "projects_score": 0,
            "github_score": 0,
            "resume_score": 0,
            "summary": "We couldn't analyze the match at this time.",
            "strengths": [],
            "missing_skills": [],
            "recommendations": ["Try again later."],
        }
