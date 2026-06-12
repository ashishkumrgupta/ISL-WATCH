#!/usr/bin/env python3
"""Smoke-test Milestone 1 caption extraction from the CLI."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

_BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(_BACKEND_ROOT))


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract timestamped English captions from YouTube.")
    parser.add_argument(
        "url",
        nargs="?",
        default="https://www.youtube.com/watch?v=jNQXAC9IVRw",
    )
    parser.add_argument("--sample-only", action="store_true")
    args = parser.parse_args()

    from app.core.exceptions import CaptionError
    from app.core.wiring import build_caption_service

    service = build_caption_service()
    try:
        if args.sample_only:
            result = service.extract_from_sample_only(args.url)
        else:
            result = service.extract_from_url(args.url)
    except CaptionError as exc:
        print(f"ERROR [{exc.code}]: {exc.message}", file=sys.stderr)
        if exc.code == "timeout":
            print("Tip: retry with --sample-only", file=sys.stderr)
        return 1

    print(json.dumps(result.to_dict(), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
