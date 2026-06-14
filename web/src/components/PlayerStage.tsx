import { useMemo } from "react";

import type { GlossTrack, SignCoverageFromApi } from "../types/pipeline";
import { findActiveSentence } from "../utils/gloss";
import { getActiveGlossToken } from "../signing/glossClipRegistry";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { CoverageBadge } from "./CoverageBadge";
import { GlossTokenPanel } from "./GlossTokenPanel";
import { SignLibraryPanel } from "./SignLibraryPanel";

interface PlayerStageProps {
  videoId: string;
  gloss: GlossTrack | null;
  signCoverage: SignCoverageFromApi;
}

export function PlayerStage({ videoId, gloss, signCoverage }: PlayerStageProps) {
  const { containerRef, currentTime, isReady, isPlaying } = useYouTubePlayer(videoId);

  const activeSentence = useMemo(() => {
    if (!gloss) return null;
    return findActiveSentence(gloss.sentences, currentTime);
  }, [gloss, currentTime]);

  const activeGlossToken = useMemo(
    () => getActiveGlossToken(activeSentence, currentTime, isPlaying),
    [activeSentence, currentTime, isPlaying],
  );

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
        <CoverageBadge coverage={signCoverage} />
        <SignLibraryPanel activeGlossToken={activeGlossToken} isPlaying={isPlaying} />
        <GlossTokenPanel
          sentence={activeSentence}
          currentTime={currentTime}
          isPlaying={isPlaying}
        />
        <p className="player-stage__hint">
          Phase 0: honest gloss-only mode. Next step is a real sign video library (Phase 1).
        </p>
      </aside>
    </section>
  );
}
