# ASL Watch API

FastAPI backend for the [ASL video overlay roadmap](../docs/ROADMAP.md).

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set OPENAI_API_KEY
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

When `../web/dist/` exists (after `npm run build` in `web/`), the API also serves the React UI at `/`.

## API

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/health` | — | Liveness + gloss config |
| POST | `/api/captions` | `{ "url", "sample_only"? }` | Milestone 1 |
| POST | `/api/gloss` | `{ "url", "sample_only"? }` | Milestone 2 |
| POST | `/api/pipeline` | `{ "url", "sample_only"?, "include_gloss"? }` | M1 + M2 |

### Gloss response shape

```json
{
  "video_id": "jNQXAC9IVRw",
  "provider": "openai:gpt-4o-mini",
  "sentence_count": 1,
  "sentences": [
    {
      "start": 1.03,
      "end": 12.89,
      "english": "All right, so here we are...",
      "gloss": "HERE ELEPHANT COOL TRUNK LONG",
      "non_manual_markers": []
    }
  ]
}
```

## Architecture

```
app/
  main.py                          # App factory + optional web/dist static mount
  core/                            # config, exceptions, wiring (DI)
  domain/models/                   # CaptionTrack, GlossTrack
  repositories/                    # YouTube + sample caption sources
  providers/gloss/                 # LLM providers (OpenAI; swappable)
  services/                        # caption, gloss, pipeline orchestration
  infrastructure/youtube/          # URL parsing
  api/routes/                      # Thin HTTP handlers
  api/deps.py                      # FastAPI Depends (+ auth hook later)
```

| Layer | Swap for… |
|-------|-----------|
| `providers/gloss/openai_provider.py` | Anthropic, local LLM |
| `repositories/youtube_caption_repository.py` | Whisper transcript repo |
| `api/deps.py` | User authentication middleware |

## CLI scripts

```bash
python scripts/extract_captions.py "https://youtube.com/watch?v=jNQXAC9IVRw" --sample-only
python scripts/extract_gloss.py jNQXAC9IVRw --sample-only
```
