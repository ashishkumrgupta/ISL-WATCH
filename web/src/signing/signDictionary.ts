/**
 * Sign clip library — Phase 0 starts empty; Phase 1 adds real signer videos.
 * Keep in sync with backend/data/signs/manifest.json
 */

export interface SignEntry {
  sign_id: string;
  lemmas: string[];
  video_url: string;
  duration_ms: number;
}

/** Pilot signs will be added in Phase 1. */
const SIGN_LIBRARY: SignEntry[] = [];

const LEMMA_INDEX = new Map<string, SignEntry>(
  SIGN_LIBRARY.flatMap((entry) =>
    entry.lemmas.map((lemma) => [normalizeGlossToken(lemma), entry] as const),
  ),
);

export function normalizeGlossToken(token: string): string {
  return token.replace(/^\[|\]$/g, "").trim().toUpperCase();
}

export function librarySize(): number {
  return SIGN_LIBRARY.length;
}

export function hasSignForToken(token: string): boolean {
  return LEMMA_INDEX.has(normalizeGlossToken(token));
}

export function lookupSign(token: string): SignEntry | null {
  return LEMMA_INDEX.get(normalizeGlossToken(token)) ?? null;
}

export type TokenSignStatus = "signed" | "missing";

export function tokenSignStatus(token: string): TokenSignStatus {
  return hasSignForToken(token) ? "signed" : "missing";
}
