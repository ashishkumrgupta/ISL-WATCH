"""Sign clip manifest lookup (Phase 0 — empty library, honest coverage)."""

from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from app.domain.models.gloss import GlossTrack

_MANIFEST_PATH = Path(__file__).resolve().parents[2] / "data" / "signs" / "manifest.json"


@dataclass(frozen=True)
class SignCoverage:
    library_size: int
    total_tokens: int
    signed: int
    missing: int
    coverage_pct: float

    def to_dict(self) -> dict:
        return {
            "library_size": self.library_size,
            "total_tokens": self.total_tokens,
            "signed": self.signed,
            "missing": self.missing,
            "coverage_pct": self.coverage_pct,
        }


def _normalize_token(token: str) -> str:
    return token.strip().upper().strip("[]")


def _tokens_from_gloss(gloss: str) -> list[str]:
    return [
        _normalize_token(part)
        for part in gloss.split()
        if part.strip() and not part.strip().startswith("[")
    ]


@lru_cache(maxsize=1)
def _load_lemma_set() -> frozenset[str]:
    if not _MANIFEST_PATH.is_file():
        return frozenset()

    data = json.loads(_MANIFEST_PATH.read_text(encoding="utf-8"))
    lemmas: set[str] = set()
    for entry in data.get("signs", []):
        for lemma in entry.get("lemmas", []):
            normalized = _normalize_token(str(lemma))
            if normalized:
                lemmas.add(normalized)
    return frozenset(lemmas)


def compute_sign_coverage(gloss: GlossTrack | None) -> SignCoverage:
    lemmas = _load_lemma_set()
    library_size = len(lemmas)

    if gloss is None:
        return SignCoverage(
            library_size=library_size,
            total_tokens=0,
            signed=0,
            missing=0,
            coverage_pct=0.0,
        )

    seen: set[str] = set()
    for sentence in gloss.sentences:
        for token in _tokens_from_gloss(sentence.gloss):
            seen.add(token)

    total = len(seen)
    signed = sum(1 for token in seen if token in lemmas)
    missing = total - signed
    coverage_pct = round((signed / total) * 100, 1) if total else 0.0

    return SignCoverage(
        library_size=library_size,
        total_tokens=total,
        signed=signed,
        missing=missing,
        coverage_pct=coverage_pct,
    )
