import type { AnalyzeResponse } from "../types";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(
  /\/$/,
  "",
) ?? "";

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function detailFromBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const detail = (body as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg);
  return null;
}

export async function analyzeProject(scenario: string): Promise<AnalyzeResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario }),
    });
  } catch {
    throw new ApiError(
      "Cannot reach the ReqWise backend. Start FastAPI on port 8000 and try again.",
    );
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new ApiError(
      detailFromBody(body) ||
        "The analysis request failed. Check your scenario and backend logs.",
      response.status,
    );
  }

  const data = body as AnalyzeResponse;
  if (!data?.requirements || !data?.sdlc_analysis) {
    throw new ApiError("The backend returned an incomplete analysis payload.");
  }

  return data;
}
