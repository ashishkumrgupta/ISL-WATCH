"""Request / response schemas (API layer only)."""

from __future__ import annotations

from pydantic import BaseModel, Field


class CaptionsRequest(BaseModel):
    url: str = Field(..., min_length=11, description="YouTube watch URL, youtu.be link, or video ID")
    sample_only: bool = Field(
        default=False,
        description="Use bundled sample captions (no YouTube network call)",
    )


class GlossRequest(BaseModel):
    url: str = Field(..., min_length=11, description="YouTube watch URL, youtu.be link, or video ID")
    sample_only: bool = Field(default=False, description="Use bundled sample captions")


class PipelineRequest(BaseModel):
    url: str = Field(..., min_length=11, description="YouTube watch URL, youtu.be link, or video ID")
    sample_only: bool = Field(default=False, description="Use bundled sample captions")
    include_gloss: bool = Field(default=True, description="Run Milestone 2 gloss translation")
