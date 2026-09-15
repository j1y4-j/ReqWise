import json

from prompts.sdlc_prompt import SDLC_SYSTEM_PROMPT, SDLC_USER_TEMPLATE
from schemas.sdlc import SDLCAnalysis
from services.gemini_service import GeminiService


class SDLCAgent:
    """Agent 2: recommend an SDLC using Agent 1's structured requirements only."""

    def __init__(self, gemini: GeminiService) -> None:
        self.gemini = gemini

    async def run(self, requirements_result: dict) -> dict:
        user_prompt = SDLC_USER_TEMPLATE.format(
            requirements_json=json.dumps(requirements_result, indent=2)
        )
        return await self.gemini.generate_json(
            system_prompt=SDLC_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            schema=SDLCAnalysis,
        )
