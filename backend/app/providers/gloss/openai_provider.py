"""OpenAI gloss translation (Milestone 2)."""

from __future__ import annotations

import json
import re

from app.core.exceptions import GlossTranslationError
from app.domain.models.caption import CaptionSentence
from app.domain.models.gloss import GlossSentence

BATCH_SIZE = 12

SYSTEM_PROMPT = """You are an expert American Sign Language (ASL) linguist.
Convert each English sentence into ASL gloss notation for a signing avatar.

Grammar rules:
- Use ASL word order (Topic-Comment, Time-Subject-Object-Verb), NOT English order.
- Gloss tokens are UPPERCASE English words representing signs (e.g. YESTERDAY STORE ME GO).
- Drop articles (a, an, the) unless emphatic.
- Use role shift and spatial references when the English implies them.

Non-manual markers (append in brackets after gloss, space-separated):
- [q] yes/no or wh-questions
- [neg] negation
- [y/n] rhetorical question
- [cond] conditional
- [top] topicalization (raised brows)

Output strict JSON only:
{"items":[{"gloss":"YESTERDAY STORE ME GO","non_manual_markers":[]}]}

One item per input sentence, same order. Never skip or merge sentences.
"""


class OpenAiGlossProvider:
    def __init__(self, *, api_key: str, model: str = "gpt-4o-mini") -> None:
        self._api_key = api_key
        self._model = model

    @property
    def name(self) -> str:
        return f"openai:{self._model}"

    def translate_sentences(self, sentences: list[CaptionSentence]) -> list[GlossSentence]:
        if not sentences:
            return []

        try:
            from openai import OpenAI
        except ImportError as exc:
            raise GlossTranslationError(
                "openai_missing",
                "Install the openai package: pip install openai",
            ) from exc

        client = OpenAI(api_key=self._api_key)
        gloss_sentences: list[GlossSentence] = []
        for offset in range(0, len(sentences), BATCH_SIZE):
            batch = sentences[offset : offset + BATCH_SIZE]
            gloss_sentences.extend(self._translate_batch(client, batch))
        return gloss_sentences

    def _translate_batch(
        self, client, sentences: list[CaptionSentence]
    ) -> list[GlossSentence]:
        user_payload = {
            "sentences": [{"index": i, "english": s.text} for i, s in enumerate(sentences)],
        }

        try:
            response = client.chat.completions.create(
                model=self._model,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": json.dumps(user_payload)},
                ],
                temperature=0.2,
            )
        except Exception as exc:
            raise GlossTranslationError("openai_error", str(exc)) from exc

        raw = response.choices[0].message.content or "{}"
        try:
            parsed = json.loads(raw)
            items = parsed.get("items", [])
        except json.JSONDecodeError as exc:
            raise GlossTranslationError("openai_parse_error", "Invalid JSON from LLM.") from exc

        if len(items) != len(sentences):
            raise GlossTranslationError(
                "openai_count_mismatch",
                f"Expected {len(sentences)} gloss lines, got {len(items)}.",
            )

        result: list[GlossSentence] = []
        for source, item in zip(sentences, items, strict=True):
            gloss = self._normalize_gloss(str(item.get("gloss", "")))
            markers = tuple(
                str(m).strip("[]")
                for m in item.get("non_manual_markers") or []
                if str(m).strip()
            )
            result.append(
                GlossSentence(
                    start=source.start,
                    end=source.end,
                    english=source.text,
                    gloss=gloss,
                    non_manual_markers=markers,
                )
            )
        return result

    @staticmethod
    def _normalize_gloss(gloss: str) -> str:
        cleaned = re.sub(r"\s+", " ", gloss.strip().upper())
        return cleaned
