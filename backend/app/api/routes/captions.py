"""Milestone 1 — caption extraction routes."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_caption_service
from app.api.errors import raise_http
from app.api.schemas.requests import CaptionsRequest
from app.core.exceptions import CaptionError
from app.services.caption_service import CaptionService

router = APIRouter(prefix="/api", tags=["captions"])


@router.post("/captions")
def create_captions(
    body: CaptionsRequest,
    caption_service: Annotated[CaptionService, Depends(get_caption_service)],
) -> dict:
    try:
        if body.sample_only:
            track = caption_service.extract_from_sample_only(body.url)
        else:
            track = caption_service.extract_from_url(body.url)
        return track.to_dict()
    except CaptionError as exc:
        raise_http(exc)
