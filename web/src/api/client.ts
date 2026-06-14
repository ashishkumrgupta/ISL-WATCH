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

function formatApiDetail(detail: unknown): { message: string; code?: string } {
  if (!detail) {
    return { message: "Request failed" };
  }
  if (typeof detail === "string") {
    return { message: detail };
  }
  if (Array.isArray(detail)) {
    const message = detail
      .map((item) => {
        if (typeof item === "object" && item && "msg" in item) {
          return String((item as { msg: unknown }).msg);
        }
        return String(item);
      })
      .join("; ");
    return { message: message || "Validation error" };
  }
  if (typeof detail === "object" && detail) {
    const record = detail as { code?: string; message?: string };
    return {
      message: record.message ?? "Request failed",
      code: record.code,
    };
  }
  return { message: "Request failed" };
}

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { detail?: unknown };
  if (!response.ok) {
    const { message, code } = formatApiDetail(payload.detail);
    throw new ApiError(message || response.statusText, code);
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
