import type { HealthResponse, PipelineResponse } from "../types/pipeline";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { detail?: { code?: string; message?: string } };
  if (!response.ok) {
    const detail = payload.detail;
    throw new ApiError(detail?.message ?? response.statusText, detail?.code);
  }
  return payload;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/health`);
  return parseJson<HealthResponse>(response);
}

export async function runPipeline(
  url: string,
  options: { sampleOnly?: boolean; includeGloss?: boolean } = {},
): Promise<PipelineResponse> {
  const response = await fetch(`${API_BASE}/api/pipeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      sample_only: options.sampleOnly ?? false,
      include_gloss: options.includeGloss ?? true,
    }),
  });
  return parseJson<PipelineResponse>(response);
}
