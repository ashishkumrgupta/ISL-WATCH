"""Milestone 1 — caption extraction orchestration."""

from __future__ import annotations

from app.core.exceptions import CaptionError
from app.domain.models.caption import CaptionTrack
from app.infrastructure.youtube.url_parser import YouTubeUrlError, YouTubeUrlParser
from app.repositories.caption_sample_repository import CaptionSampleRepository
from app.repositories.protocols import CaptionRepository
from app.services.caption_preprocessor import CaptionPreprocessor


class CaptionService:
    def __init__(
        self,
        *,
        youtube_repo: CaptionRepository,
        sample_repo: CaptionSampleRepository,
        preprocessor: CaptionPreprocessor,
        url_parser: YouTubeUrlParser | None = None,
    ) -> None:
        self._youtube_repo = youtube_repo
        self._sample_repo = sample_repo
        self._preprocessor = preprocessor
        self._url_parser = url_parser or YouTubeUrlParser()

    def extract_from_url(self, youtube_url_or_id: str) -> CaptionTrack:
        try:
            video_id = self._url_parser.parse_video_id(youtube_url_or_id)
        except YouTubeUrlError as exc:
            raise CaptionError("invalid_url", str(exc)) from exc

        fetch_result = self._fetch_with_fallback(video_id)
        return self._build_track(video_id, fetch_result)

    def extract_from_sample_only(self, youtube_url_or_id: str) -> CaptionTrack:
        """Skip YouTube — use bundled sample (fast offline dev)."""
        try:
            video_id = self._url_parser.parse_video_id(youtube_url_or_id)
        except YouTubeUrlError as exc:
            raise CaptionError("invalid_url", str(exc)) from exc

        fetch_result = self._sample_repo.fetch_by_video_id(video_id)
        return self._build_track(video_id, fetch_result)

    def _build_track(self, video_id: str, fetch_result) -> CaptionTrack:
        sentences = self._preprocessor.group_into_sentences(list(fetch_result.fragments))
        if not sentences:
            raise CaptionError("empty_transcript", "No usable caption text after cleaning.")

        return CaptionTrack(
            video_id=fetch_result.video_id or video_id,
            language=fetch_result.language,
            source=fetch_result.source,
            sentences=tuple(sentences),
        )

    def _fetch_with_fallback(self, video_id: str):
        try:
            return self._youtube_repo.fetch_by_video_id(video_id)
        except CaptionError as exc:
            if exc.code != "timeout" and not self._sample_repo.has_sample(video_id):
                raise
            try:
                return self._sample_repo.fetch_by_video_id(video_id)
            except CaptionError:
                raise exc
