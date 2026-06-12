"""Application settings (env-backed, swappable per environment)."""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

_BACKEND_ROOT = Path(__file__).resolve().parents[2]

try:
    from dotenv import load_dotenv

    load_dotenv(_BACKEND_ROOT / ".env")
except ImportError:
    pass


OPENAI_KEY_SETUP_MESSAGE = (
    "Set a real OpenAI API key in backend/.env (not the placeholder from .env.example):\n"
    "  OPENAI_API_KEY=sk-...\n"
    "Create a key at https://platform.openai.com/account/api-keys"
)

_PLACEHOLDER_KEY_FRAGMENTS = ("your-key-here", "your_key_here", "changeme", "replace-me")


@dataclass(frozen=True)
class Settings:
    openai_api_key: str | None
    openai_model: str
    youtube_fetch_timeout_sec: float
    caption_sample_dir: Path


def is_openai_configured(api_key: str | None = None) -> bool:
    key = (api_key if api_key is not None else get_settings().openai_api_key) or ""
    key = key.strip()
    if not key.startswith("sk-"):
        return False
    lower = key.lower()
    return not any(fragment in lower for fragment in _PLACEHOLDER_KEY_FRAGMENTS)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings(
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        openai_model=os.getenv("OPENAI_GLOSS_MODEL", "gpt-4o-mini"),
        youtube_fetch_timeout_sec=float(os.getenv("YOUTUBE_FETCH_TIMEOUT_SEC", "30")),
        caption_sample_dir=Path(
            os.getenv("CAPTION_SAMPLE_DIR", str(_BACKEND_ROOT / "data" / "mvp_transcripts"))
        ),
    )
