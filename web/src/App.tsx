import { useCallback, useEffect, useState } from "react";

import { ApiError, fetchHealth, runPipeline } from "./api/client";
import { PlayerStage } from "./components/PlayerStage";
import { UrlForm } from "./components/UrlForm";
import type { HealthResponse, PipelineResponse } from "./types/pipeline";
import { extractVideoId } from "./utils/youtube";

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [pipeline, setPipeline] = useState<PipelineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const handleLoad = useCallback(async (url: string, sampleOnly: boolean) => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError("Enter a valid YouTube URL or 11-character video ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await runPipeline(url, { sampleOnly, includeGloss: true });
      setPipeline(result);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load pipeline";
      setError(message);
      setPipeline(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>ASL Watch</h1>
          <p className="app__tagline">
            YouTube captions → ASL gloss, synced to playback (Milestone 3)
          </p>
        </div>
        {health && (
          <div className="app__status">
            <span className={health.gloss_enabled ? "pill pill--ok" : "pill pill--warn"}>
              {health.gloss_enabled ? "Gloss enabled" : "Gloss disabled — set OPENAI_API_KEY"}
            </span>
            <span className="pill">{health.openai_model}</span>
          </div>
        )}
      </header>

      <UrlForm loading={loading} onSubmit={handleLoad} />

      {error && (
        <div className="app__error" role="alert">
          {error}
        </div>
      )}

      {pipeline && <PlayerStage videoId={pipeline.video_id} gloss={pipeline.gloss ?? null} />}
    </div>
  );
}
