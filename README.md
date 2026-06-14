# ASL Watch

Help Deaf and hard-of-hearing users enjoy YouTube videos with an **American Sign Language (ASL)** avatar overlay.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full 5-milestone plan.

| Milestone | Status |
|-----------|--------|
| 1 — Caption extraction | Done |
| 2 — English → ASL gloss (OpenAI) | Done |
| 3 — Web player + gloss sync | Done |
| 4 — 3D rigged avatar | Done |
| 5 — Gloss → animation | **Prototype** (not real ASL) |
| Real ASL for Deaf users | **Planned** — cached overlay + coverage ([REAL_ASL_PLAN.md](docs/REAL_ASL_PLAN.md)) |

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
npm run fetch-avatar   # only if public/models/avatar.glb is missing
npm run dev
```

Open http://127.0.0.1:5173 — paste a YouTube URL (leave sample captions **unchecked** for most videos), **Load & translate**, then play.

### Single-server demo (production build)

```bash
cd web && npm install && npm run build
cd ../backend && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open http://127.0.0.1:8000

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness + gloss/avatar config |
| POST | `/api/captions` | Milestone 1 — timestamped English sentences |
| POST | `/api/gloss` | Milestone 2 — ASL gloss per sentence |
| POST | `/api/pipeline` | Captions + gloss in one call |

## Project layout

```
asl-watch/
  backend/     # FastAPI — captions, gloss, pipeline
  web/         # React player — YouTube + gloss + 3D avatar
  docs/        # Roadmap, architecture
```

- Backend: [backend/README.md](backend/README.md)
- Web player: [web/README.md](web/README.md) · [docs/WEB_PLAYER.md](docs/WEB_PLAYER.md)
- 3D avatar: [docs/AVATAR.md](docs/AVATAR.md)
- Real ASL path: [docs/REAL_ASL.md](docs/REAL_ASL.md)
