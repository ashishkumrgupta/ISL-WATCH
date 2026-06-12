"""ASL gloss domain models (Milestone 2)."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class GlossSentence:
    """One timed English sentence mapped to ASL gloss notation."""

    start: float
    end: float
    english: str
    gloss: str
    non_manual_markers: tuple[str, ...] = ()

    def to_dict(self) -> dict:
        return {
            "start": self.start,
            "end": self.end,
            "english": self.english,
            "gloss": self.gloss,
            "non_manual_markers": list(self.non_manual_markers),
        }


@dataclass(frozen=True)
class GlossTrack:
    video_id: str
    provider: str
    sentences: tuple[GlossSentence, ...]

    def to_dict(self) -> dict:
        return {
            "video_id": self.video_id,
            "provider": self.provider,
            "sentence_count": len(self.sentences),
            "sentences": [sentence.to_dict() for sentence in self.sentences],
        }
