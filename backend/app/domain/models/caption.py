"""Caption domain models (framework-agnostic)."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class RawCaptionFragment:
    start: float
    duration: float
    text: str

    @property
    def end(self) -> float:
        return self.start + self.duration


@dataclass(frozen=True)
class CaptionSentence:
    start: float
    end: float
    text: str

    def to_dict(self) -> dict:
        return {"start": self.start, "end": self.end, "text": self.text}


@dataclass(frozen=True)
class CaptionTrack:
    video_id: str
    language: str
    source: str
    sentences: tuple[CaptionSentence, ...]

    def to_dict(self) -> dict:
        return {
            "video_id": self.video_id,
            "language": self.language,
            "source": self.source,
            "sentence_count": len(self.sentences),
            "sentences": [sentence.to_dict() for sentence in self.sentences],
        }


@dataclass(frozen=True)
class TranscriptFetchResult:
    """Raw fragments returned by a caption repository."""

    video_id: str
    language: str
    source: str
    fragments: tuple[RawCaptionFragment, ...]
