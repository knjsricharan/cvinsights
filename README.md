# CVInsights

An AI-powered resume analyzer built for job seekers who need specific, role-aware feedback — not a generic score. CVInsights extracts structured intelligence from a resume, evaluates it against a deterministic scoring rubric, and surfaces actionable improvements through a context-aware chat interface.

---

## What it does

CVInsights accepts a resume in PDF, DOCX, or HTML format and produces:

- A weighted overall quality score with per-section breakdowns
- ATS compatibility flags based on document structure and formatting
- Detected skills versus role-expected skills gap analysis
- Prioritized suggestions with issue identification and specific fixes
- An AI chat assistant grounded in the uploaded resume content

---

## Architecture

The system is split into a Python backend (FastAPI) and a React frontend. They communicate over a REST API. All user state is persisted client-side via `localStorage` — the backend is fully stateless.

```
Browser (React/Vite)
    |
    | HTTP (Axios)
    v
FastAPI Backend
    |
    |-- /api/upload    -> Extractor -> Segmenter
    |-- /api/analyze   -> LLM -> Scorer -> Pydantic Schema
    |-- /api/chat      -> Context Builder -> LLM
    v
OpenRouter API (multi-model routing)
```

---

## Processing Pipeline

The backend processes every resume through a sequential, validated pipeline:

**1. Ingestion**
File type detection via extension routing. File size is gated at 5MB by default (configurable via `MAX_FILE_SIZE_MB`). Unsupported formats are rejected with a descriptive HTTP 400.

**2. Text Extraction**
Each format uses a dedicated parser:
- PDF: `pdfplumber` with coordinate-based word sorting (Y-axis then X-axis) to handle multi-column layouts correctly
- DOCX: `python-docx` traversing both paragraphs and table cells
- HTML: `BeautifulSoup` with script, style, and metadata tags stripped

After extraction, text is cleaned — null bytes, control characters, excess whitespace, and hyphenation artifacts from PDF line breaks are all normalized.

**3. Section Segmentation**
A regex engine classifies the cleaned text into canonical sections: Summary, Experience, Education, Skills, Projects, Certifications. Short lines matching known header patterns act as section boundaries. Unrecognized headers fall through to an `unclassified` bucket.

**4. LLM Analysis**
The segmented text is sent to OpenRouter with a strict system prompt requiring raw JSON output conforming to a predefined schema. The prompt embeds the schema definition, behavioral constraints, and the resume content in the user role.

**5. Fallback and Retry**
If the LLM returns malformed JSON, the system strips markdown fences, applies trailing-comma cleanup, and retries with an explicit correction prompt. If the primary model returns an HTTP error (404, 400, 402, 403), the system automatically falls back to `openai/gpt-4o-mini` and logs a warning. A hardcoded fallback result is returned only if both attempts fail.

**6. Deterministic Scoring**
The LLM is not asked to produce a final score. It extracts signals. The backend scoring engine applies a fixed weighted rubric to those signals:

| Dimension | Weight |
|-----------|--------|
| Experience quality | 30% |
| Skills coverage | 20% |
| Keyword density | 20% |
| Quantification | 15% |
| Formatting | 15% |

This makes scores reproducible, auditable, and independent of LLM temperature variance.

**7. Output Delivery**
The canonical JSON object is returned to the frontend. The chat assistant receives the raw resume text as persistent system context for all subsequent turns.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 (Vite) |
| Styling | TailwindCSS with DM Sans / DM Serif Display |
| Charts | Recharts |
| HTTP client (frontend) | Axios |
| Backend framework | FastAPI |
| PDF extraction | pdfplumber |
| DOCX extraction | python-docx |
| HTML extraction | BeautifulSoup4 / lxml |
| Data validation | Pydantic v2 |
| HTTP client (backend) | httpx (async) |
| AI routing | OpenRouter API |
| Primary model | openai/gpt-4o-mini |
| State persistence | Browser localStorage |
| Frontend deployment | Vercel |
| Backend deployment | Render |

---

## Project Structure

```
cvinsights/
  backend/
    main.py                  # FastAPI app, CORS, router registration
    requirements.txt
    render.yaml              # Render deployment blueprint
    routers/
      upload.py              # /api/upload endpoint
      analyze.py             # /api/analyze endpoint
      chat.py                # /api/chat endpoint
    services/
      extractor.py           # PDF, DOCX, HTML extraction and segmentation
      llm.py                 # OpenRouter API calls, fallback logic, retry
      analyzer.py            # Pipeline orchestration
      scorer.py              # Deterministic weighted scoring engine
    models/
      schemas.py             # Pydantic request/response models
  frontend/
    index.html
    vite.config.js
    tailwind.config.js
    vercel.json              # SPA routing rewrites
    src/
      App.jsx                # Router: Landing -> Dashboard
      main.jsx
      pages/
        Landing.jsx          # Upload page
        Dashboard.jsx        # Analysis results page
      components/
        layout/              # Navbar, Footer
        upload/              # UploadZone (drag-and-drop)
        dashboard/           # ScoreCard, SectionScores, SkillsChart,
                             # StrengthsWeaknesses, Suggestions, ATSFlags
        chat/                # ChatAssistant
      hooks/
        useResume.js         # Upload, analysis, and chat state management
      services/
        api.js               # Axios API client
        storage.js           # localStorage read/write
```

---

## Local Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate          # Windows
# source venv/bin/activate       # macOS/Linux
pip install -r requirements.txt
```

Create `backend/.env` from `backend/.env.example`:

```env
OPENROUTER_API_KEY=your_key_here
APP_ENV=development
MAX_FILE_SIZE_MB=5
```

To override the default model, add optional variables:

```env
MODEL_ANALYZE=anthropic/claude-3.5-sonnet
MODEL_CHAT=anthropic/claude-3.5-sonnet
```

Start the server:

```bash
uvicorn main:app --reload
```

API runs at `http://localhost:8000`. Interactive docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Deployment

### Backend (Render)

The `backend/render.yaml` blueprint is pre-configured. In the Render dashboard:

1. Connect the GitHub repository
2. Set Root Directory to `backend`
3. Add the `OPENROUTER_API_KEY` environment variable
4. Deploy

The start command is `uvicorn main:app --host 0.0.0.0 --port $PORT`.

### Frontend (Vercel)

1. Import the repository in Vercel
2. Set Root Directory to `frontend`
3. Set Framework Preset to `Vite`
4. Add environment variable: `VITE_API_BASE_URL` pointing to the Render backend URL
5. Deploy

The `frontend/vercel.json` file configures SPA routing rewrites automatically. The FastAPI CORS configuration allows all `*.vercel.app` origins without additional setup.

---

## Security

- API keys are never exposed to the browser. All LLM calls originate from the backend.
- User data is not stored server-side. The backend processes each request statelessly and returns results directly.
- The `.gitignore` excludes all `.env` files, `venv/`, `node_modules/`, and `__pycache__/`.

---

## Known Limitations and Planned Work

The following features are documented in `features.md` and `advanced-features.md` but are not yet implemented:

- Job Description input and role-specific match scoring (highest priority)
- Role-based analysis profiles with per-role rubric weights and skill taxonomies
- Bullet-level AI rewrite suggestions using XYZ/STAR format
- ATS simulation by platform (Workday, Greenhouse, Taleo behavior models)
- Resume version history with diff view and score progression tracking
- LinkedIn PDF and GitHub profile import for gap analysis

---

## Design Decisions

**Why deterministic scoring over LLM-generated scores:** Asking the LLM to produce an overall score leads to scoring drift — the same resume produces different scores across runs due to temperature and context variation. The scoring engine in `scorer.py` takes LLM-extracted signals as input and applies fixed weights deterministically. Scores are reproducible and the rubric is inspectable.

**Why OpenRouter over a direct provider:** OpenRouter provides a single API surface for multiple models. The fallback mechanism in `llm.py` allows seamless model switching when a specific model is unavailable, deprecated, or over quota — without changing application code.

**Why localStorage over a database:** For a v1 product with no authentication, browser-side persistence avoids the operational overhead of a database while providing a functional session experience. The session object stores upload data, analysis results, and chat history.
