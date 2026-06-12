"""Milestone 2 — English sentence → ASL gloss orchestration."""

from __future__ import annotations

from app.core.config import OPENAI_KEY_SETUP_MESSAGE
from app.core.exceptions import GlossTranslationError
from app.domain.models.caption import CaptionTrack
from app.domain.models.gloss import GlossTrack
from app.providers.gloss.protocol import GlossLlmProvider
from app.services.caption_service import CaptionService


class GlossTranslationService:
    def __init__(
        self,
        *,
        caption_service: CaptionService,
        gloss_provider: GlossLlmProvider | None,
    ) -> None:
        self._caption_service = caption_service
        self._gloss_provider = gloss_provider

    def _require_provider(self) -> GlossLlmProvider:
        if self._gloss_provider is None:
            raise GlossTranslationError("provider_unconfigured", OPENAI_KEY_SETUP_MESSAGE)
        return self._gloss_provider

    def translate_youtube_url(
        self, youtube_url_or_id: str, *, sample_only: bool = False
    ) -> GlossTrack:
        provider = self._require_provider()
        if sample_only:
            captions = self._caption_service.extract_from_sample_only(youtube_url_or_id)
        else:
            captions = self._caption_service.extract_from_url(youtube_url_or_id)
        return self._translate_track(captions, provider)

    def translate_caption_track(self, caption_track: CaptionTrack) -> GlossTrack:
        return self._translate_track(caption_track, self._require_provider())

    @staticmethod
    def _translate_track(caption_track: CaptionTrack, provider: GlossLlmProvider) -> GlossTrack:
        gloss_sentences = provider.translate_sentences(list(caption_track.sentences))
        return GlossTrack(
            video_id=caption_track.video_id,
            provider=provider.name,
            sentences=tuple(gloss_sentences),
        )
