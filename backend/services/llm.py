import os
import json
import httpx
import re

OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"

MODELS = {
    "analyze": "openai/gpt-4o-mini",
    "chat": "openai/gpt-4o-mini",
    "fast": "openai/gpt-4o-mini"
}

async def call_llm(system_prompt: str, user_prompt: str, task: str, model_override: str = None) -> dict:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY is not set")
        
    # Prefer env variable (e.g., MODEL_ANALYZE), then MODELS dict, then fallback
    primary_model = model_override or os.getenv(f"MODEL_{task.upper()}", MODELS.get(task, "openai/gpt-4o-mini"))
    fallback_model = "openai/gpt-4o-mini"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cvinsights.app",
        "X-Title": "CVInsights"
    }
    
    async def fetch_from_openrouter(model_name: str) -> dict:
        payload = {
            "model": model_name,
            "temperature": 0.3,
            "max_tokens": 4000,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(OPENROUTER_ENDPOINT, headers=headers, json=payload)
            response.raise_for_status()
            return response.json(), model_name

    try:
        data, final_model = await fetch_from_openrouter(primary_model)
    except httpx.HTTPStatusError as e:
        # If the primary model fails (e.g. 404 Not Found, 400 Bad Request, 402 out of credits on that tier)
        if e.response.status_code in [404, 400, 403, 402] and primary_model != fallback_model:
            print(f"Warning: Model {primary_model} failed with {e.response.status_code}. Falling back to {fallback_model}.")
            data, final_model = await fetch_from_openrouter(fallback_model)
        else:
            raise
            
    content = data['choices'][0]['message']['content']
    tokens_used = data.get('usage', {}).get('total_tokens', 0)
    
    return {
        "content": content,
        "tokens_used": tokens_used,
        "model_used": final_model
    }

async def analyze_resume(resume_text: str, sections: dict) -> dict:
    system_prompt = """
You are an expert resume analysis engine.
Respond ONLY with valid raw JSON.
No markdown, no code blocks, no text outside JSON.
All scores are integers 0-100.
    """
    
    user_prompt = f"""
Analyze the following resume and return this EXACT JSON structure:
{{
  "overall_score": 0,
  "grade": "A" or "B" or "C" or "D" or "F",
  "detected_role": "string",
  "seniority_level": "fresher" or "junior" or "mid" or "senior" or "lead",
  "section_scores": {{
    "summary": null,
    "experience": null,
    "education": null,
    "skills": null,
    "projects": null,
    "certifications": null
  }},
  "skills_found": ["string"],
  "skills_missing": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": [
    {{
      "priority": "high" or "medium" or "low",
      "section": "string",
      "issue": "string",
      "fix": "string"
    }}
  ],
  "ats_flags": ["string"],
  "quantification_score": 0,
  "tone_score": 0,
  "keyword_density_score": 0,
  "formatting_score": 0
}}

RESUME TEXT:
{resume_text}

DETECTED SECTIONS:
{json.dumps(sections)}
    """
    
    def parse_json(content: str) -> dict:
        # Strip markdown fences if present
        content = re.sub(r'^```json\s*', '', content, flags=re.IGNORECASE)
        content = re.sub(r'^```\s*', '', content)
        content = re.sub(r'```$', '', content)
        content = content.strip()
        
        # Remove trailing commas
        content = re.sub(r',\s*}', '}', content)
        content = re.sub(r',\s*]', ']', content)
        
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            return None

    result = await call_llm(system_prompt, user_prompt, "analyze")
    parsed_json = parse_json(result["content"])
    
    if not parsed_json:
        # Retry once
        retry_prompt = f"{user_prompt}\n\nYour previous response was invalid JSON. Return ONLY valid JSON, no markdown."
        retry_result = await call_llm(system_prompt, retry_prompt, "analyze")
        parsed_json = parse_json(retry_result["content"])
        result["tokens_used"] += retry_result["tokens_used"]
        
    if not parsed_json:
        # Default fallback
        parsed_json = {
            "overall_score": 0, "grade": "F", "detected_role": "Unknown", "seniority_level": "fresher",
            "section_scores": {"summary": None, "experience": None, "education": None, "skills": None, "projects": None, "certifications": None},
            "skills_found": [], "skills_missing": [], "strengths": [], "weaknesses": ["Failed to parse AI analysis"],
            "suggestions": [], "ats_flags": [],
            "quantification_score": 0, "tone_score": 0, "keyword_density_score": 0, "formatting_score": 0
        }
        
    parsed_json["tokens_used"] = result["tokens_used"]
    parsed_json["model_used"] = result["model_used"]
    return parsed_json

async def chat_with_resume(messages: list, resume_context: str) -> dict:
    system_prompt = f"""
You are a professional resume coach inside CVInsights.
You have full access to the user's resume.
Answer questions specifically about their resume.
Give actionable, specific advice.
Never give generic advice — always reference the actual resume content.
Resume content: {resume_context}
    """
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY is not set")
        
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cvinsights.app",
        "X-Title": "CVInsights"
    }
    
    # Format messages for the API
    api_messages = [{"role": "system", "content": system_prompt}]
    for msg in messages:
        api_messages.append({"role": msg.role, "content": msg.content})
        
    payload = {
        "model": MODELS["chat"],
        "temperature": 0.5,
        "max_tokens": 1000,
        "messages": api_messages
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(OPENROUTER_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        
        return {
            "reply": data['choices'][0]['message']['content'],
            "tokens_used": data.get('usage', {}).get('total_tokens', 0)
        }
