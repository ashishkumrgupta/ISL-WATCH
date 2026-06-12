"""Parse YouTube URLs and video IDs."""

from __future__ import annotations

import re
from urllib.parse import parse_qs, urlparse

VIDEO_ID_RE = re.compile(r"^[a-zA-Z0-9_-]{11}$")
_YOUTUBE_HOSTS = frozenset(
    {"youtu.be", "youtube.com", "m.youtube.com", "music.youtube.com", "www.youtube.com"}
)


class YouTubeUrlError(ValueError):
    pass


class YouTubeUrlParser:
    def parse_video_id(self, value: str) -> str:
        raw = (value or "").strip()
        if not raw:
            raise YouTubeUrlError("YouTube URL or video ID is required.")

        if VIDEO_ID_RE.match(raw):
            return raw

        parsed = urlparse(raw if "://" in raw else f"https://{raw}")
        host = (parsed.netloc or "").lower().removeprefix("www.")
        path = parsed.path or ""

        if host == "youtu.be":
            candidate = path.strip("/").split("/")[0]
            if VIDEO_ID_RE.match(candidate):
                return candidate

        if host in _YOUTUBE_HOSTS or host.endswith(".youtube.com"):
            parts = [segment for segment in path.split("/") if segment]
            if parts and parts[0] in {"embed", "shorts", "live"} and len(parts) >= 2:
                if VIDEO_ID_RE.match(parts[1]):
                    return parts[1]

            query = parse_qs(parsed.query)
            for key in ("v", "vi"):
                if key in query and query[key]:
                    candidate = query[key][0]
                    if VIDEO_ID_RE.match(candidate):
                        return candidate

        raise YouTubeUrlError(
            "Could not parse YouTube video ID. Use a watch URL, youtu.be link, or 11-character ID."
        )
