from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agents.requirements_agent import RequirementsAgent
from agents.sdlc_agent import SDLCAgent
from services.gemini_service import GeminiService, LLMResponseError, MissingApiKeyError

app = FastAPI(
    title="ReqWise",
    description="Sequential multi-agent requirements engineer and SDLC advisor",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_private_network=True,
)

gemini_service = GeminiService()
requirements_agent = RequirementsAgent(gemini_service)
sdlc_agent = SDLCAgent(gemini_service)


class AnalyzeRequest(BaseModel):
    scenario: str = Field(..., min_length=1)


async def analyze_project(scenario: str) -> dict:
    requirements_result = await requirements_agent.run(scenario)
    sdlc_result = await sdlc_agent.run(requirements_result)
    return {
        "requirements": requirements_result,
        "sdlc_analysis": sdlc_result,
    }


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "healthy"}


@app.post("/analyze")
async def analyze(request: AnalyzeRequest) -> dict:
    scenario = request.scenario.strip()
    if not scenario:
        raise HTTPException(
            status_code=400,
            detail="Please enter a software project scenario before analyzing.",
        )

    try:
        return await analyze_project(scenario)
    except MissingApiKeyError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except LLMResponseError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="The analysis pipeline failed unexpectedly. Please try again.",
        ) from exc
