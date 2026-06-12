"""Map domain errors to HTTP responses."""

from __future__ import annotations

from fastapi import HTTPException

from app.core.exceptions import AppError, CaptionError, GlossTranslationError


def http_status_for(error: AppError) -> int:
    if isinstance(error, CaptionError):
        return 504 if error.code == "timeout" else 422
    if isinstance(error, GlossTranslationError):
        if error.code == "provider_unconfigured":
            return 503
        return 422
    return 400


def raise_http(error: AppError) -> None:
    raise HTTPException(
        status_code=http_status_for(error),
        detail={"code": error.code, "message": error.message},
    ) from error
