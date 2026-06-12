"""Repository interfaces — swap implementations without touching services or routes."""

from __future__ import annotations

from typing import Protocol

from app.domain.models.caption import TranscriptFetchResult


class CaptionRepository(Protocol):
    """Fetch raw timestamped caption fragments for a YouTube video."""

    def fetch_by_video_id(self, video_id: str) -> TranscriptFetchResult:
        """Raise CaptionError on failure."""
