"""Clean caption fragments and merge into full sentences."""

from __future__ import annotations

import re

from app.domain.models.caption import CaptionSentence, RawCaptionFragment

_BRACKET_NOISE = re.compile(
    r"^\s*[\[(](?:music|applause|laughter|laughs|silence|"
    r"inaudible|crosstalk|background noise|cheering|crowd)[\])]\s*$",
    re.IGNORECASE,
)
_INLINE_BRACKETS = re.compile(
    r"\[\s*(?:music|applause|laughter|laughs|silence|"
    r"inaudible|crosstalk|cheering)\s*\]"
    r"|\(\s*(?:music|applause|laughter|laughs|silence|"
    r"inaudible|crosstalk|cheering)\s*\)",
    re.IGNORECASE,
)
_MUSIC_SYMBOLS = re.compile(r"[♪♫🎵🎶]+")
_WHITESPACE = re.compile(r"\s+")
_SENTENCE_END = re.compile(r"[.!?…\"')\]]\s*$")


class CaptionPreprocessor:
    def clean_fragment_text(self, text: str) -> str:
        cleaned = _MUSIC_SYMBOLS.sub(" ", text)
        cleaned = _INLINE_BRACKETS.sub(" ", cleaned)
        cleaned = _WHITESPACE.sub(" ", cleaned).strip()
        if not cleaned or _BRACKET_NOISE.match(cleaned):
            return ""
        return cleaned

    def group_into_sentences(
        self, fragments: list[RawCaptionFragment]
    ) -> list[CaptionSentence]:
        sentences: list[CaptionSentence] = []
        buffer: list[str] = []
        chunk_start: float | None = None
        chunk_end: float | None = None

        def flush() -> None:
            nonlocal buffer, chunk_start, chunk_end
            if not buffer or chunk_start is None:
                buffer = []
                chunk_start = chunk_end = None
                return
            text = _WHITESPACE.sub(" ", " ".join(buffer)).strip()
            if text:
                sentences.append(
                    CaptionSentence(
                        start=chunk_start,
                        end=chunk_end if chunk_end is not None else chunk_start,
                        text=text if self._ends_sentence(text) else f"{text}.",
                    )
                )
            buffer = []
            chunk_start = chunk_end = None

        for frag in fragments:
            cleaned = self.clean_fragment_text(frag.text)
            if not cleaned:
                continue

            if chunk_start is None:
                chunk_start = frag.start
                buffer = [cleaned]
                chunk_end = frag.end
                continue

            provisional = CaptionSentence(
                start=chunk_start,
                end=chunk_end if chunk_end is not None else frag.start,
                text=_WHITESPACE.sub(" ", " ".join(buffer)).strip(),
            )
            if self._should_break_before_next(provisional, frag, cleaned):
                flush()
                chunk_start = frag.start
                buffer = [cleaned]
                chunk_end = frag.end
            else:
                buffer.append(cleaned)
                chunk_end = frag.end

        flush()
        return sentences

    @staticmethod
    def _ends_sentence(text: str) -> bool:
        return bool(_SENTENCE_END.search(text.rstrip()))

    def _should_break_before_next(
        self,
        current: CaptionSentence,
        nxt: RawCaptionFragment,
        cleaned_next: str,
    ) -> bool:
        gap = nxt.start - current.end
        if gap > 2.5:
            return True
        if self._ends_sentence(current.text):
            return True
        if cleaned_next and cleaned_next[0].isupper() and self._ends_sentence(current.text):
            return True
        return False
