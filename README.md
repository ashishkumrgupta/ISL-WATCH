# ASL Watch

Help Deaf and hard-of-hearing users enjoy YouTube videos with an **American Sign Language (ASL)** avatar overlay.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full 5-milestone plan.

| Milestone | Status |
|-----------|--------|
| 1 — Caption extraction | Done |
| 2 — English → ASL gloss (OpenAI) | Done |
| 3 — Web player + canvas overlay | Done |
| 4 — 3D avatar | Next |
| 5 — Gloss → animation | Planned |

## Quick start

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add OPENAI_API_KEY
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Web player (development)

```bash
cd web
npm install
npm run dev
```

Open http://127.0.0.1:5173 — load the demo URL with **sample captions** checked, then press play.

### Single-server demo (production build)

```bash
cd web && npm install && npm run build
cd ../backend && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open http://127.0.0.1:8000

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness + gloss config |
| POST | `/api/captions` | Milestone 1 — timestamped English sentences |
| POST | `/api/gloss` | Milestone 2 — ASL gloss per sentence |
| POST | `/api/pipeline` | Captions + gloss in one call |

### Examples

```bash
curl -s -X POST http://127.0.0.1:8000/api/pipeline \
  -H "Content-Type: application/json" \
  -d '{"url":"jNQXAC9IVRw","sample_only":true}'
```

CLI:

```bash
python scripts/extract_captions.py jNQXAC9IVRw --sample-only
python scripts/extract_gloss.py jNQXAC9IVRw --sample-only
```

## Project layout

```
asl-watch/
  backend/     # FastAPI — captions, gloss, pipeline, serves web/dist in prod
  web/         # React player — YouTube embed + gloss canvas (Milestone 3)
  docs/        # Roadmap, web player architecture
```

- Backend architecture: [backend/README.md](backend/README.md)
- Web player: [web/README.md](web/README.md) · [docs/WEB_PLAYER.md](docs/WEB_PLAYER.md)
