from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from models.schemas import AnalysisResponse
from services.analyzer import orchestrate_analysis

router = APIRouter()

from typing import List

class AnalyzeRequest(BaseModel):
    resume_text: str
    sections: List[str]

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume_endpoint(request: AnalyzeRequest):
    if not request.resume_text.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Resume text cannot be empty")
        
    try:
        result = await orchestrate_analysis(request.resume_text, request.sections)
        return AnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Analysis failed: {str(e)}")
