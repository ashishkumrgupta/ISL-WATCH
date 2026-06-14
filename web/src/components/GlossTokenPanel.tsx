import { useMemo } from "react";

import type { GlossSentence } from "../types/pipeline";
import { tokenSignStatus } from "../signing/signDictionary";
import { activeTokenIndex, parseGlossTokens } from "../utils/gloss";

interface GlossTokenPanelProps {
  sentence: GlossSentence | null;
  currentTime: number;
  isPlaying: boolean;
}

export function GlossTokenPanel({ sentence, currentTime, isPlaying }: GlossTokenPanelProps) {
  const tokens = useMemo(
    () => (sentence ? parseGlossTokens(sentence.gloss) : []),
    [sentence],
  );

  const activeIndex = useMemo(() => {
    if (!sentence || tokens.length === 0) return -1;
    return activeTokenIndex(sentence, currentTime, tokens.length);
  }, [sentence, currentTime, tokens.length]);

  if (!sentence) {
    return (
      <div className="gloss-panel gloss-panel--empty">
        <p>Press play — gloss appears here</p>
      </div>
    );
  }

  return (
    <div className="gloss-panel">
      <div className="gloss-panel__tokens" aria-live="polite">
        {tokens.map((token, index) => {
          const isActive = isPlaying && index === activeIndex;
          const status = tokenSignStatus(token);
          const className = [
            "gloss-token",
            isActive ? "gloss-token--active" : "",
            status === "missing" ? "gloss-token--missing" : "gloss-token--signed",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <span
              key={`${token}-${index}`}
              className={className}
              title={
                status === "missing"
                  ? "Sign not in library — gloss reference only"
                  : "Sign available in library"
              }
            >
              {token}
            </span>
          );
        })}
      </div>

      {sentence.non_manual_markers.length > 0 && (
        <p className="gloss-panel__nmm">
          NMM: {sentence.non_manual_markers.map((marker) => `[${marker}]`).join(" ")}
        </p>
      )}

      <p className="gloss-panel__english">{sentence.english}</p>
      <p className="gloss-panel__legend">
        <span className="gloss-panel__swatch gloss-panel__swatch--missing" /> Not in sign library
      </p>
    </div>
  );
}
