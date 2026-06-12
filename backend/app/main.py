"""FastAPI application factory."""

from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import captions, gloss, health

_REPO_ROOT = Path(__file__).resolve().parents[2]
_WEB_DIST = _REPO_ROOT / "web" / "dist"


def create_app() -> FastAPI:
    app = FastAPI(title="ASL Watch API", version="0.7.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(captions.router)
    app.include_router(gloss.router)

    if _WEB_DIST.is_dir():
        app.mount("/", StaticFiles(directory=_WEB_DIST, html=True), name="web")

    return app


app = create_app()
