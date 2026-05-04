from .llm import analyze_resume
from .scorer import apply_weighted_score

async def orchestrate_analysis(resume_text: str, sections: dict) -> dict:
    analysis = await analyze_resume(resume_text, sections)
    scored_analysis = apply_weighted_score(analysis)
    return scored_analysis
