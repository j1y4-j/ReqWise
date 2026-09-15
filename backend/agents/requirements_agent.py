from prompts.requirements_prompt import (
    REQUIREMENTS_SYSTEM_PROMPT,
    REQUIREMENTS_USER_TEMPLATE,
)
from schemas.requirements import RequirementsResult
from services.gemini_service import GeminiService


class RequirementsAgent:
    """Agent 1: extract structured software requirements from a scenario."""

    def __init__(self, gemini: GeminiService) -> None:
        self.gemini = gemini

    async def run(self, scenario: str) -> dict:
        user_prompt = REQUIREMENTS_USER_TEMPLATE.format(scenario=scenario.strip())
        return await self.gemini.generate_json(
            system_prompt=REQUIREMENTS_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            schema=RequirementsResult,
        )
