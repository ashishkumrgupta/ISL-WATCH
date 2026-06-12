"""Milestone 2 — ASL gloss translation routes."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_gloss_service, get_pipeline_service
from app.api.errors import raise_http
from app.api.schemas.requests import GlossRequest, PipelineRequest
from app.core.exceptions import CaptionError, GlossTranslationError
from app.services.gloss_translation_service import GlossTranslationService
from app.services.pipeline_service import PipelineService

router = APIRouter(prefix="/api", tags=["gloss"])


@router.post("/gloss")
def create_gloss_track(
    body: GlossRequest,
    gloss_service: Annotated[GlossTranslationService, Depends(get_gloss_service)],
) -> dict:
    try:
        return gloss_service.translate_youtube_url(
            body.url, sample_only=body.sample_only
        ).to_dict()
    except (CaptionError, GlossTranslationError) as exc:
        raise_http(exc)


@router.post("/pipeline")
def run_pipeline(
    body: PipelineRequest,
    pipeline_service: Annotated[PipelineService, Depends(get_pipeline_service)],
) -> dict:
    try:
        return pipeline_service.run(
            body.url,
            sample_only=body.sample_only,
            include_gloss=body.include_gloss,
        ).to_dict()
    except (CaptionError, GlossTranslationError) as exc:
        raise_http(exc)
