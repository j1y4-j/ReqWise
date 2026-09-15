from pydantic import BaseModel, Field


class FunctionalRequirement(BaseModel):
    id: str = Field(..., description="Identifier such as FR-001")
    requirement: str


class NonFunctionalRequirement(BaseModel):
    id: str = Field(..., description="Identifier such as NFR-001")
    category: str
    requirement: str


class RequirementsResult(BaseModel):
    project_summary: str
    stakeholders: list[str] = Field(default_factory=list)
    functional_requirements: list[FunctionalRequirement] = Field(default_factory=list)
    non_functional_requirements: list[NonFunctionalRequirement] = Field(
        default_factory=list
    )
    constraints: list[str] = Field(default_factory=list)
    assumptions: list[str] = Field(default_factory=list)
    open_questions: list[str] = Field(default_factory=list)
