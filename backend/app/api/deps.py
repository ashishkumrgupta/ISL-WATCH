"""FastAPI dependency injection — wire services; auth hooks go here later."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends

from app.core.config import Settings, get_settings
from app.core.wiring import (
    build_caption_service,
    build_gloss_provider,
    build_gloss_service,
    build_pipeline_service,
)
from app.providers.gloss.protocol import GlossLlmProvider
from app.services.caption_service import CaptionService
from app.services.gloss_translation_service import GlossTranslationService
from app.services.pipeline_service import PipelineService


def get_caption_service(
    settings: Annotated[Settings, Depends(get_settings)],
) -> CaptionService:
    return build_caption_service(settings)


def get_gloss_provider(
    settings: Annotated[Settings, Depends(get_settings)],
) -> GlossLlmProvider | None:
    return build_gloss_provider(settings)


def get_gloss_service(
    settings: Annotated[Settings, Depends(get_settings)],
) -> GlossTranslationService:
    return build_gloss_service(settings)


def get_pipeline_service(
    settings: Annotated[Settings, Depends(get_settings)],
) -> PipelineService:
    return build_pipeline_service(settings)
