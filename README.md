# CVInsights - AI-Powered Resume Analyzer

CVInsights is a production-grade, AI-powered resume analysis application designed to provide job seekers with actionable feedback, ATS compatibility checks, and a context-aware chat assistant. 

The application architecture heavily emphasizes decoupled client-server interaction, deterministic scoring mechanisms over raw LLM outputs, and robust fallback strategies for high availability.

## Technical Stack

### Frontend
- Framework: React (initialized via Vite)
- Styling: TailwindCSS (custom design system, utility-first)
- Data Visualization: Recharts (animated SVG-based charting)
- State Management: Custom React Hooks (`useResume`) and Browser `localStorage`
- HTTP Client: Axios

### Backend
- Framework: Python FastAPI
- Text Extraction: `pdfplumber` (coordinate-based PDF parsing), `python-docx`, `beautifulsoup4`
- Validation: Pydantic (strict schema enforcement)
- HTTP Client: `httpx` (asynchronous LLM API requests)

### AI & Infrastructure
- AI Router: OpenRouter API (Multi-model routing)
- Primary Model: `openai/gpt-4o-mini`
- Deployment Configured For: Render (Backend) and Vercel (Frontend)

## System Architecture & Workflow

The application operates on an 8-layer processing pipeline:

1. Ingestion Layer: The frontend accepts PDF, DOCX, or HTML files (max 5MB) via drag-and-drop and sends them to the backend as multipart form data.
2. Extraction Layer: The backend uses format-specific parsers to extract raw text. For PDFs, it utilizes coordinate-based sorting (Y-axis then X-axis) to correctly parse multi-column resume layouts.
3. Segmentation Layer: A Regex-driven engine identifies and segments the unstructured text into standardized categories (e.g., Summary, Experience, Education, Skills).
4. AI Analysis Layer: The cleaned text and segmented metadata are passed to the OpenRouter API with a strict system prompt demanding a predefined JSON structure.
5. Fallback & Retry Layer: If the primary LLM fails (HTTP 4xx/5xx) or returns malformed JSON, the system automatically falls back to a secondary, highly-available model. Malformed JSON triggers an automatic retry prompt.
6. Deterministic Scoring Layer: Raw sub-scores from the LLM are passed through a deterministic Python algorithm that applies strict weightings (e.g., Experience 30%, Skills 20%) to calculate the final aggregate score and grade.
7. Visualization Layer: The frontend consumes the structured JSON payload and renders interactive radial charts, bar graphs, and actionable feedback lists.
8. Interactive Chat Layer: The extracted resume text is retained in context, allowing the user to query a persistent chat assistant for specific rewrites and tailored advice.

## Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   Create a `.env` file in the `backend` directory based on `.env.example`:
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   APP_ENV=development
   MAX_FILE_SIZE_MB=5
   ```
5. Start the development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## Deployment

The repository is pre-configured for modern PaaS deployment.

- Backend (Render): A `render.yaml` blueprint is included in the `backend` directory. When connected to Render, it automatically provisions a Web Service running Uvicorn.
- Frontend (Vercel): A `vercel.json` file is included in the `frontend` directory to handle SPA routing rewrites. CORS settings in the FastAPI application dynamically allow requests from `*.vercel.app` domains.

## Security & Reliability

- State Persistence: User data and session history are stored entirely client-side using `localStorage`. The backend operates statelessly.
- Dynamic LLM Routing: The AI service engine dynamically reads environment variables (`MODEL_ANALYZE`, `MODEL_CHAT`) to dictate inference routing without requiring code changes.
- Safe Error Handling: Strict type enforcement on API boundaries ensures that Pydantic validation errors are safely stringified and communicated to the client, preventing UI crashes.
