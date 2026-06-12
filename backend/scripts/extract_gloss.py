#!/usr/bin/env python3
"""Smoke-test Milestone 2: captions → ASL gloss via OpenAI."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

_BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(_BACKEND_ROOT))


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract captions and translate to ASL gloss.")
    parser.add_argument(
        "url",
        nargs="?",
        default="https://www.youtube.com/watch?v=jNQXAC9IVRw",
    )
    parser.add_argument("--sample-only", action="store_true")
    parser.add_argument("--captions-only", action="store_true", help="Skip gloss (Milestone 1 only)")
    args = parser.parse_args()

    from app.core.config import OPENAI_KEY_SETUP_MESSAGE, is_openai_configured
    from app.core.exceptions import CaptionError, GlossTranslationError
    from app.core.wiring import build_pipeline_service

    if not args.captions_only and not is_openai_configured():
        print(OPENAI_KEY_SETUP_MESSAGE, file=sys.stderr)
        return 1

    try:
        result = build_pipeline_service().run(
            args.url,
            sample_only=args.sample_only,
            include_gloss=not args.captions_only,
        )
    except (CaptionError, GlossTranslationError) as exc:
        print(f"ERROR [{exc.code}]: {exc.message}", file=sys.stderr)
        return 1

    print(json.dumps(result.to_dict(), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
