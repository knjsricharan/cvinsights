from pydantic import BaseModel
from typing import List, Optional

class UploadResponse(BaseModel):
    filename: str
    format: str
    extracted_text: str
    char_count: int
    sections_detected: List[str]

class SectionScore(BaseModel):
    summary: Optional[int] = None
    experience: Optional[int] = None
    education: Optional[int] = None
    skills: Optional[int] = None
    projects: Optional[int] = None
    certifications: Optional[int] = None

class Suggestion(BaseModel):
    priority: str
    section: str
    issue: str
    fix: str

class AnalysisResponse(BaseModel):
    overall_score: int
    grade: str
    detected_role: str
    seniority_level: str
    section_scores: SectionScore
    skills_found: List[str]
    skills_missing: List[str]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[Suggestion]
    ats_flags: List[str]
    quantification_score: int
    tone_score: int
    keyword_density_score: int
    formatting_score: int
    tokens_used: int
    model_used: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    resume_context: str

class ChatResponse(BaseModel):
    reply: str
    tokens_used: int
