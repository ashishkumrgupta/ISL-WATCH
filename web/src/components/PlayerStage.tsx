import { useMemo } from "react";

import type { GlossTrack } from "../types/pipeline";
import { findActiveSentence } from "../utils/gloss";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { GlossCanvas } from "./GlossCanvas";

interface PlayerStageProps {
  videoId: string;
  gloss: GlossTrack | null;
}

export function PlayerStage({ videoId, gloss }: PlayerStageProps) {
  const { containerRef, currentTime, isReady, isPlaying } = useYouTubePlayer(videoId);

  const activeSentence = useMemo(() => {
    if (!gloss) return null;
    return findActiveSentence(gloss.sentences, currentTime);
  }, [gloss, currentTime]);

  return (
    <section className="player-stage">
      <div className="player-stage__video">
        <div ref={containerRef} className="player-stage__embed" />
        {!isReady && <div className="player-stage__loading">Loading player…</div>}
      </div>
      <aside className="player-stage__overlay">
        <header className="player-stage__header">
          <h2>ASL gloss overlay</h2>
          <p className="player-stage__meta">
            {gloss ? (
              <>
                Provider: <code>{gloss.provider}</code> · {gloss.sentence_count} sentence
                {gloss.sentence_count === 1 ? "" : "s"}
              </>
            ) : (
              "Captions only — gloss unavailable"
            )}
          </p>
        </header>
        <GlossCanvas sentence={activeSentence} currentTime={currentTime} isPlaying={isPlaying} />
        <p className="player-stage__hint">
          Milestone 3: timed gloss on canvas. Milestone 4 replaces the silhouette with a 3D signer.
        </p>
      </aside>
    </section>
  );
}
