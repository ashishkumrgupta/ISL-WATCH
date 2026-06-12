"""Compose services/repositories (no FastAPI — safe for CLI scripts)."""

from __future__ import annotations

from functools import lru_cache

from app.core.config import Settings, get_settings, is_openai_configured
from app.infrastructure.youtube.url_parser import YouTubeUrlParser
from app.providers.gloss.openai_provider import OpenAiGlossProvider
from app.providers.gloss.protocol import GlossLlmProvider
from app.repositories.caption_sample_repository import CaptionSampleRepository
from app.repositories.youtube_caption_repository import YouTubeCaptionRepository
from app.services.caption_preprocessor import CaptionPreprocessor
from app.services.caption_service import CaptionService
from app.services.gloss_translation_service import GlossTranslationService
from app.services.pipeline_service import PipelineService


@lru_cache(maxsize=1)
def build_caption_service(settings: Settings | None = None) -> CaptionService:
    cfg = settings or get_settings()
    return CaptionService(
        youtube_repo=YouTubeCaptionRepository(timeout_sec=cfg.youtube_fetch_timeout_sec),
        sample_repo=CaptionSampleRepository(cfg.caption_sample_dir),
        preprocessor=CaptionPreprocessor(),
        url_parser=YouTubeUrlParser(),
    )


def build_gloss_provider(settings: Settings | None = None) -> GlossLlmProvider | None:
    cfg = settings or get_settings()
    if not is_openai_configured(cfg.openai_api_key):
        return None
    return OpenAiGlossProvider(api_key=cfg.openai_api_key, model=cfg.openai_model)


def build_gloss_service(settings: Settings | None = None) -> GlossTranslationService:
    cfg = settings or get_settings()
    return GlossTranslationService(
        caption_service=build_caption_service(cfg),
        gloss_provider=build_gloss_provider(cfg),
    )


def build_pipeline_service(settings: Settings | None = None) -> PipelineService:
    cfg = settings or get_settings()
    return PipelineService(
        caption_service=build_caption_service(cfg),
        gloss_service=build_gloss_service(cfg),
    )
