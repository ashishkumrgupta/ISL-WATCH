"""File-backed caption samples when YouTube is unavailable or slow."""

from __future__ import annotations

import json
from pathlib import Path

from app.core.exceptions import CaptionError
from app.domain.models.caption import RawCaptionFragment, TranscriptFetchResult


class CaptionSampleRepository:
    def __init__(self, sample_dir: Path) -> None:
        self._sample_dir = sample_dir

    def fetch_by_video_id(self, video_id: str) -> TranscriptFetchResult:
        path = self._sample_dir / f"{video_id}.json"
        if not path.is_file():
            raise CaptionError(
                "sample_not_found",
                f"No bundled caption sample for video {video_id}.",
            )

        data = json.loads(path.read_text(encoding="utf-8"))
        fragments = tuple(
            RawCaptionFragment(
                start=float(item["start"]),
                duration=float(item["duration"]),
                text=str(item["text"]),
            )
            for item in data.get("segments", [])
            if str(item.get("text", "")).strip()
        )
        if not fragments:
            raise CaptionError("empty_transcript", "Sample caption file has no text.")

        return TranscriptFetchResult(
            video_id=video_id,
            language=str(data.get("language", "en")),
            source=str(data.get("source", "sample_cache")),
            fragments=fragments,
        )

    def has_sample(self, video_id: str) -> bool:
        return (self._sample_dir / f"{video_id}.json").is_file()
