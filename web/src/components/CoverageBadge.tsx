import type { SignCoverageFromApi } from "../signing/coverage";

interface CoverageBadgeProps {
  coverage: SignCoverageFromApi;
}

export function CoverageBadge({ coverage }: CoverageBadgeProps) {
  const { coverage_pct, signed, missing, total_tokens, library_size } = coverage;

  const variant =
    coverage_pct >= 80 ? "ok" : coverage_pct > 0 ? "partial" : "none";

  return (
    <div className={`coverage-badge coverage-badge--${variant}`} role="status">
      <div className="coverage-badge__headline">
        <strong>{coverage_pct}%</strong> sign coverage
        <span className="coverage-badge__detail">
          {signed} signed · {missing} not in library · {total_tokens} unique gloss tokens
        </span>
      </div>
      <p className="coverage-badge__note">
        {library_size === 0 ? (
          <>
            Sign library is empty (Phase 1). Gloss text is shown for reference only — no signing
            video is played. False gestures have been removed.
          </>
        ) : (
          <>
            {missing > 0
              ? "Missing tokens will use fingerspelling once Phase 1 clips are added."
              : "All gloss tokens matched the sign library."}
          </>
        )}
      </p>
    </div>
  );
}
