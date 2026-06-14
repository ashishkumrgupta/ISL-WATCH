/**
 * Active gloss token from playback time (no fake sign animation).
 */

import { normalizeGlossToken } from "./signDictionary";

export function getActiveGlossToken(
  sentence: { gloss: string; start: number; end: number } | null,
  timeSec: number,
  isPlaying: boolean,
): string | null {
  if (!sentence || !isPlaying) return null;

  const tokens = sentence.gloss
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t && !t.startsWith("["));

  if (tokens.length === 0) return null;

  if (tokens.length === 1) return normalizeGlossToken(tokens[0]!);

  const duration = Math.max(sentence.end - sentence.start, 0.001);
  const progress = Math.min(Math.max((timeSec - sentence.start) / duration, 0), 1);
  const index = Math.min(tokens.length - 1, Math.floor(progress * tokens.length));
  return normalizeGlossToken(tokens[index]!);
}
