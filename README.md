# ReqWise

AI-powered Software Requirements and SDLC Advisor. A course-project MVP that demonstrates a **sequential two-agent workflow**: a Requirements Engineer extracts structured software requirements, then an SDLC Advisor recommends a development process from that structured output only.

**Tagline:** From idea to requirements to the right development process.

## 1. Project overview

A user describes a software project in natural language. ReqWise:

1. Extracts stakeholders, functional/non-functional requirements, constraints, assumptions, and open questions.
2. Hands that JSON to a second agent that evaluates SDLC models (Agile, Waterfall, Spiral, V-Model, DevOps/DevSecOps, hybrid) and recommends one with justification.

There is no model training, RAG, authentication, or extra enterprise features.

## 2. Architecture

```
User Scenario
      |
      v
Requirements Engineer Agent
      |
      v
Structured Software Requirements
      |
      v
SDLC Advisor Agent
      |
      v
SDLC Recommendation + Justification
```

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** FastAPI orchestrates two custom Python agents
- **LLM:** Google Gemini API (key stays on the server)

## 3. The two AI agents

| Agent | File | Responsibility |
| --- | --- | --- |
| **Requirements Engineer** | `backend/agents/requirements_agent.py` | Analyze the scenario. Produce structured requirements JSON. Does **not** recommend an SDLC. |
| **SDLC Advisor** | `backend/agents/sdlc_agent.py` | Consume Agent 1 JSON only. Score SDLC models and justify a recommendation. Does **not** re-extract requirements. |

Prompts live in `backend/prompts/`. Output shapes are validated with Pydantic in `backend/schemas/`.

## 4. Sequential agent workflow

```python
async def analyze_project(scenario):
    requirements_result = await requirements_agent.run(scenario)
    sdlc_result = await sdlc_agent.run(requirements_result)
    return {
        "requirements": requirements_result,
        "sdlc_analysis": sdlc_result,
    }
```

`POST /analyze` runs this pipeline. Agent 2 never sees the original scenario text except insofar as it is already captured in Agent 1's structured output.

## 5. Tech stack

- React, Vite, TypeScript, Tailwind CSS, Lucide React
- Python, FastAPI, Pydantic, Google Gemini (`google-genai`)
- Custom agent classes (no LangChain / CrewAI)

## 6. Setup instructions

You need **Node.js 18+**, **Python 3.10+**, and a [Gemini API key](https://aistudio.google.com/apikey).

```bash
cd specflow-ai
```

## 7. Environment variables

Copy the example env file and add your key. Never put the key in the frontend.

```bash
cp backend/.env.example backend/.env
```

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Required. Google Gemini API key. |
| `GEMINI_MODEL` | Optional. Defaults to `gemini-3.6-flash`. |
| `VITE_API_URL` | Optional frontend override. Defaults to `http://127.0.0.1:8000`. |

## 8. How to run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## 9. How to run the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Health check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

## 10. Example API request

```bash
curl -X POST http://127.0.0.1:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "Build a university hostel management system where students can apply for rooms, administrators can allocate rooms, and students can submit maintenance complaints."
  }'
```

Expected shape:

```json
{
  "requirements": {
    "project_summary": "...",
    "stakeholders": ["..."],
    "functional_requirements": [{ "id": "FR-001", "requirement": "..." }],
    "non_functional_requirements": [
      { "id": "NFR-001", "category": "Security", "requirement": "..." }
    ],
    "constraints": ["..."],
    "assumptions": ["..."],
    "open_questions": ["..."]
  },
  "sdlc_analysis": {
    "project_characteristics": { "...": "..." },
    "evaluated_models": [
      {
        "model": "Agile",
        "suitability_score": 88,
        "advantages": ["..."],
        "disadvantages": ["..."]
      }
    ],
    "recommended_sdlc": "Agile",
    "confidence_score": 82,
    "justification": "...",
    "suggested_workflow": [{ "phase": "...", "description": "..." }]
  }
}
```

`GET /health` returns `{ "status": "healthy" }`.
