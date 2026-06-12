"""Health and readiness routes."""

from __future__ import annotations

from fastapi import APIRouter

from app.core.config import get_settings, is_openai_configured

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    settings = get_settings()
    return {
        "status": "ok",
        "milestone": 3,
        "web_ui": True,
        "gloss_enabled": is_openai_configured(settings.openai_api_key),
        "openai_model": settings.openai_model,
    }
