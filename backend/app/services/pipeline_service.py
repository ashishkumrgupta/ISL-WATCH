"""Full Milestone 1 + 2 pipeline: captions then ASL gloss."""

from __future__ import annotations

from dataclasses import dataclass

from app.domain.models.caption import CaptionTrack
from app.domain.models.gloss import GlossTrack
from app.services.caption_service import CaptionService
from app.services.gloss_translation_service import GlossTranslationService


@dataclass(frozen=True)
class PipelineResult:
    captions: CaptionTrack
    gloss: GlossTrack | None

    def to_dict(self) -> dict:
        payload = {
            "video_id": self.captions.video_id,
            "captions": self.captions.to_dict(),
        }
        if self.gloss is not None:
            payload["gloss"] = self.gloss.to_dict()
        return payload


class PipelineService:
    def __init__(
        self,
        *,
        caption_service: CaptionService,
        gloss_service: GlossTranslationService,
    ) -> None:
        self._caption_service = caption_service
        self._gloss_service = gloss_service

    def run(
        self,
        youtube_url_or_id: str,
        *,
        sample_only: bool = False,
        include_gloss: bool = True,
    ) -> PipelineResult:
        if sample_only:
            captions = self._caption_service.extract_from_sample_only(youtube_url_or_id)
        else:
            captions = self._caption_service.extract_from_url(youtube_url_or_id)

        gloss: GlossTrack | None = None
        if include_gloss:
            gloss = self._gloss_service.translate_caption_track(captions)

        return PipelineResult(captions=captions, gloss=gloss)
