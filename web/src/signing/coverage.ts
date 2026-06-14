import type { GlossTrack } from "../types/pipeline";
import { normalizeGlossToken } from "./signDictionary";

export interface SignCoverage {
  library_size: number;
  total_tokens: number;
  signed: number;
  missing: number;
  coverage_pct: number;
}

export interface SignCoverageFromApi extends SignCoverage {}

function uniqueTokensFromGloss(gloss: string): string[] {
  const seen = new Set<string>();
  for (const part of gloss.split(/\s+/)) {
    const token = normalizeGlossToken(part);
    if (!token || part.trim().startsWith("[")) continue;
    seen.add(token);
  }
  return [...seen];
}

export function computeCoverageFromGloss(
  gloss: GlossTrack | null | undefined,
  hasSign: (token: string) => boolean,
  librarySize: number,
): SignCoverage {
  if (!gloss) {
    return {
      library_size: librarySize,
      total_tokens: 0,
      signed: 0,
      missing: 0,
      coverage_pct: 0,
    };
  }

  const tokens = new Set<string>();
  for (const sentence of gloss.sentences) {
    for (const token of uniqueTokensFromGloss(sentence.gloss)) {
      tokens.add(token);
    }
  }

  const total = tokens.size;
  const signed = [...tokens].filter(hasSign).length;
  const missing = total - signed;

  return {
    library_size: librarySize,
    total_tokens: total,
    signed,
    missing,
    coverage_pct: total ? Math.round((signed / total) * 1000) / 10 : 0,
  };
}
