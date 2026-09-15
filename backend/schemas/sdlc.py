from pydantic import BaseModel, Field


class ProjectCharacteristics(BaseModel):
    requirement_stability: str
    expected_change: str
    project_complexity: str
    technical_risk: str
    security_criticality: str
    stakeholder_involvement: str


class EvaluatedModel(BaseModel):
    model: str
    suitability_score: int = Field(..., ge=0, le=100)
    advantages: list[str] = Field(default_factory=list)
    disadvantages: list[str] = Field(default_factory=list)


class WorkflowPhase(BaseModel):
    phase: str
    description: str


class SDLCAnalysis(BaseModel):
    project_characteristics: ProjectCharacteristics
    evaluated_models: list[EvaluatedModel] = Field(min_length=3)
    recommended_sdlc: str
    confidence_score: int = Field(..., ge=0, le=100)
    justification: str
    suggested_workflow: list[WorkflowPhase] = Field(default_factory=list)
