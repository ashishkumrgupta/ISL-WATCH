"""Health and readiness routes."""

from __future__ import annotations

from fastapi import APIRouter

from app.core.config import get_settings, is_openai_configured
from app.services.sign_coverage_service import compute_sign_coverage

router = APIRouter(tags=["health"])


def _sign_library_size() -> int:
    return compute_sign_coverage(None).library_size


@router.get("/health")
def health() -> dict:
    settings = get_settings()
    return {
        "status": "ok",
        "milestone": 0,
        "phase": "research_preview",
        "sign_library_size": _sign_library_size(),
        "gloss_enabled": is_openai_configured(settings.openai_api_key),
        "openai_model": settings.openai_model,
    }
