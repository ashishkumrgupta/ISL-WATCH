import type { GlossSentence } from "../types/pipeline";

export function parseGlossTokens(gloss: string): string[] {
  return gloss
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function findActiveSentence(
  sentences: GlossSentence[],
  timeSec: number,
): GlossSentence | null {
  if (sentences.length === 0) return null;

  const match = sentences.find((sentence) => timeSec >= sentence.start && timeSec < sentence.end);
  if (match) return match;

  if (timeSec < sentences[0].start) return null;
  return sentences[sentences.length - 1] ?? null;
}

export function activeTokenIndex(
  sentence: GlossSentence,
  timeSec: number,
  tokenCount: number,
): number {
  if (tokenCount <= 1) return 0;

  const duration = Math.max(sentence.end - sentence.start, 0.001);
  const progress = Math.min(Math.max((timeSec - sentence.start) / duration, 0), 1);
  return Math.min(tokenCount - 1, Math.floor(progress * tokenCount));
}
