"""YouTube caption repository (youtube-transcript-api)."""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
)

from app.core.exceptions import CaptionError
from app.domain.models.caption import RawCaptionFragment, TranscriptFetchResult

ENGLISH_LANGUAGES = ("en", "en-US", "en-GB", "en-IN", "en-AU", "en-CA")


class YouTubeCaptionRepository:
    def __init__(self, *, timeout_sec: float = 30.0) -> None:
        self._timeout_sec = timeout_sec
        self._api = YouTubeTranscriptApi()

    def fetch_by_video_id(self, video_id: str) -> TranscriptFetchResult:
        pool = ThreadPoolExecutor(max_workers=1)
        future = pool.submit(self._fetch_live, video_id)
        try:
            fragments, language, source = future.result(timeout=self._timeout_sec)
        except FuturesTimeoutError as exc:
            raise CaptionError(
                "timeout",
                "YouTube caption fetch timed out. Try again in a moment.",
            ) from exc
        finally:
            pool.shutdown(wait=False, cancel_futures=True)

        return TranscriptFetchResult(
            video_id=video_id,
            language=language,
            source=source,
            fragments=tuple(fragments),
        )

    def _fetch_live(self, video_id: str) -> tuple[list[RawCaptionFragment], str, str]:
        try:
            fetched = self._api.fetch(video_id, languages=list(ENGLISH_LANGUAGES))
            fragments = self._snippets_to_fragments(fetched)
            if not fragments:
                raise CaptionError("empty_transcript", "No caption text found.")
            source = "youtube_generated" if fetched.is_generated else "youtube_captions"
            return fragments, fetched.language_code, source
        except CaptionError:
            raise
        except (NoTranscriptFound, TranscriptsDisabled):
            pass
        except VideoUnavailable as exc:
            raise CaptionError("video_unavailable", str(exc)) from exc

        try:
            listing = self._api.list(video_id)
            transcript = listing.find_transcript(list(ENGLISH_LANGUAGES))
            fetched = transcript.fetch()
            fragments = self._snippets_to_fragments(fetched)
            if not fragments:
                raise CaptionError("empty_transcript", "No caption text found.")
            return fragments, transcript.language_code, "youtube_generated"
        except NoTranscriptFound as exc:
            raise CaptionError(
                "no_captions",
                "No English captions found for this video.",
            ) from exc
        except TranscriptsDisabled as exc:
            raise CaptionError(
                "captions_disabled",
                "Captions are disabled for this video.",
            ) from exc
        except VideoUnavailable as exc:
            raise CaptionError("video_unavailable", str(exc)) from exc

    @staticmethod
    def _snippets_to_fragments(fetched) -> list[RawCaptionFragment]:
        return [
            RawCaptionFragment(
                start=float(snippet.start),
                duration=float(snippet.duration),
                text=str(snippet.text),
            )
            for snippet in fetched.snippets
            if str(snippet.text).strip()
        ]
