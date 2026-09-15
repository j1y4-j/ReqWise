import json
import os
import re
from typing import Any

from google import genai
from google.genai import types
from pydantic import BaseModel, ValidationError


class MissingApiKeyError(RuntimeError):
    pass


class LLMResponseError(RuntimeError):
    pass


def parse_llm_json(text: str) -> dict[str, Any]:
    """Parse JSON from an LLM response, including markdown fences."""
    cleaned = text.strip()
    if not cleaned:
        raise LLMResponseError("The model returned an empty response.")

    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        data = json.loads(cleaned)
        if isinstance(data, dict):
            return data
        raise LLMResponseError("The model returned JSON that is not an object.")
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if not match:
            raise LLMResponseError("Could not parse JSON from the model response.")
        try:
            data = json.loads(match.group(0))
        except json.JSONDecodeError as exc:
            raise LLMResponseError("Could not parse JSON from the model response.") from exc
        if not isinstance(data, dict):
            raise LLMResponseError("The model returned JSON that is not an object.")
        return data


class GeminiService:
    def __init__(self) -> None:
        self._client: genai.Client | None = None

    def _client_or_raise(self) -> genai.Client:
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        if not api_key:
            raise MissingApiKeyError(
                "GEMINI_API_KEY is not set. Copy backend/.env.example to backend/.env and add your key."
            )
        if self._client is None:
            self._client = genai.Client(api_key=api_key)
        return self._client

    async def generate_json(
        self,
        system_prompt: str,
        user_prompt: str,
        schema: type[BaseModel],
    ) -> dict[str, Any]:
        client = self._client_or_raise()
        model = os.getenv("GEMINI_MODEL", "gemini-3.6-flash").strip() or "gemini-3.6-flash"

        try:
            response = await client.aio.models.generate_content(
                model=model,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.2,
                    response_mime_type="application/json",
                ),
            )
        except MissingApiKeyError:
            raise
        except Exception as exc:
            raise LLMResponseError(f"Gemini API request failed: {exc}") from exc

        text = getattr(response, "text", None) or ""
        raw = parse_llm_json(text)

        try:
            validated = schema.model_validate(raw)
        except ValidationError as exc:
            raise LLMResponseError(
                "The model returned JSON that did not match the expected schema."
            ) from exc

        return validated.model_dump()
