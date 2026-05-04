from fastapi import APIRouter, HTTPException, status
from models.schemas import ChatRequest, ChatResponse
from services.llm import chat_with_resume

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Messages list cannot be empty")
        
    try:
        result = await chat_with_resume(request.messages, request.resume_context)
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Chat failed: {str(e)}")
