"""
LangGraph-powered career roadmap generator.
"""
import json
from typing import TypedDict

from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import END, START, StateGraph

from ai.json_utils import extract_json
from ai.matcher import _format_candidate_context, _groq_runnable, _message_text


class RoadmapGraphState(TypedDict, total=False):
    target_role: str
    jd_text: str
    user_data: dict
    candidate_context: str
    gap_analysis: dict
    roadmap: dict


async def _prepare_context(state: RoadmapGraphState) -> RoadmapGraphState:
    return {"candidate_context": _format_candidate_context(state["user_data"])}


async def _analyze_gaps(state: RoadmapGraphState) -> RoadmapGraphState:
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You identify practical career gaps for students and early-career developers. Return strict JSON only.",
            ),
            (
                "human",
                """
TARGET ROLE:
{target_role}

OPTIONAL JOB DESCRIPTION:
{jd_text}

CANDIDATE DATA:
{candidate_context}

Identify the most important gaps to close for this target role.

Return this JSON shape:
{{
  "target_role": "string",
  "priority_skills": ["string"],
  "portfolio_gaps": ["string"],
  "resume_gaps": ["string"],
  "github_gaps": ["string"],
  "interview_prep_gaps": ["string"]
}}
""",
            ),
        ]
    )
    chain = prompt | _groq_runnable()
    response = await chain.ainvoke(
        {
            "target_role": state["target_role"],
            "jd_text": state.get("jd_text", "")[:10000],
            "candidate_context": state["candidate_context"],
        }
    )
    return {"gap_analysis": extract_json(_message_text(response))}


async def _build_roadmap(state: RoadmapGraphState) -> RoadmapGraphState:
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You create concise, realistic career roadmaps for early-career developers. Return strict JSON only.",
            ),
            (
                "human",
                """
TARGET ROLE:
{target_role}

GAP ANALYSIS:
{gap_analysis}

CANDIDATE DATA:
{candidate_context}

Create a 4-week step-by-step plan.

Return this JSON shape:
{{
  "target_role": "string",
  "summary": "string",
  "focus_areas": ["string"],
  "milestones": [
    {{
      "week": 1,
      "title": "string",
      "actions": ["string", "string"],
      "deliverable": "string"
    }}
  ],
  "project_recommendations": ["string"],
  "resume_updates": ["string"],
  "github_updates": ["string"],
  "interview_prep": ["string"]
}}
""",
            ),
        ]
    )
    chain = prompt | _groq_runnable(temperature=0.3)
    response = await chain.ainvoke(
        {
            "target_role": state["target_role"],
            "gap_analysis": json.dumps(state["gap_analysis"], ensure_ascii=False),
            "candidate_context": state["candidate_context"],
        }
    )
    roadmap = extract_json(_message_text(response))
    roadmap["workflow"] = "langgraph_career_roadmap"
    roadmap["gap_analysis"] = state["gap_analysis"]
    return {"roadmap": roadmap}


def _build_roadmap_graph():
    graph = StateGraph(RoadmapGraphState)
    graph.add_node("prepare_context", _prepare_context)
    graph.add_node("analyze_gaps", _analyze_gaps)
    graph.add_node("build_roadmap", _build_roadmap)

    graph.add_edge(START, "prepare_context")
    graph.add_edge("prepare_context", "analyze_gaps")
    graph.add_edge("analyze_gaps", "build_roadmap")
    graph.add_edge("build_roadmap", END)
    return graph.compile()


roadmap_graph = _build_roadmap_graph()


async def generate_career_roadmap(target_role: str, user_data: dict, jd_text: str = ""):
    try:
        final_state = await roadmap_graph.ainvoke(
            {
                "target_role": target_role,
                "jd_text": jd_text,
                "user_data": user_data,
            }
        )
        return final_state["roadmap"]
    except Exception as e:
        print(f"Career Roadmap Error: {e}")
        return {
            "target_role": target_role,
            "summary": "We couldn't generate a roadmap at this time.",
            "focus_areas": [],
            "milestones": [],
            "project_recommendations": [],
            "resume_updates": [],
            "github_updates": [],
            "interview_prep": ["Try again later."],
        }
