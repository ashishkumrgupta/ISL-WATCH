"""LLM provider interface — swap OpenAI for Anthropic, local models, etc."""

from __future__ import annotations

from typing import Protocol

from app.domain.models.caption import CaptionSentence
from app.domain.models.gloss import GlossSentence


class GlossLlmProvider(Protocol):
    @property
    def name(self) -> str: ...

    def translate_sentences(self, sentences: list[CaptionSentence]) -> list[GlossSentence]:
        """Convert English sentences to ASL gloss with non-manual markers."""
