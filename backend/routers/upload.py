import os
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from models.schemas import UploadResponse
from services.extractor import extract_text, segment_sections

router = APIRouter()

MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", 5))

@router.post("/upload", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file provided")
        
    ext = file.filename.split('.')[-1].lower()
    if ext not in ['pdf', 'docx', 'doc', 'html', 'htm']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")
        
    file_bytes = await file.read()
    file_size_mb = len(file_bytes) / (1024 * 1024)
    
    if file_size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"File exceeds maximum size of {MAX_FILE_SIZE_MB}MB")
        
    try:
        cleaned_text, format_type = extract_text(file_bytes, file.filename)
        sections = segment_sections(cleaned_text)
        
        return UploadResponse(
            filename=file.filename,
            format=format_type,
            extracted_text=cleaned_text,
            char_count=len(cleaned_text),
            sections_detected=list(sections.keys())
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
