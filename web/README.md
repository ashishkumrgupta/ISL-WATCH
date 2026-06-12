# ASL Watch — Web Player (Milestone 3)

React + TypeScript UI: YouTube IFrame Player with a canvas gloss overlay synced to playback time.

## Prerequisites

- Node.js 20+
- Backend running on port 8000 with `OPENAI_API_KEY` set (for gloss translation)

## Development (recommended)

Two terminals:

```bash
# Terminal 1 — API
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 — Vite dev server (proxies /api → :8000)
cd web
npm install
npm run dev
```

Open http://127.0.0.1:5173

1. Leave **“Use bundled sample captions”** checked for the demo video (`jNQXAC9IVRw`).
2. Click **Load & translate**.
3. Press play on the YouTube player — gloss tokens highlight in sync.

## Production (single server)

Build the UI and serve it from FastAPI:

```bash
cd web
npm install
npm run build

cd ../backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open http://127.0.0.1:8000 — API routes (`/api/*`, `/health`) and the SPA share one origin.

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_BASE_URL` | `""` (same origin) | API base when frontend is hosted separately |

Copy `.env.example` to `.env` only if you need a custom API URL.

## Architecture

```
src/
  api/client.ts          # POST /api/pipeline, GET /health
  hooks/useYouTubePlayer.ts
  components/
    UrlForm.tsx          # URL input + sample-only toggle
    PlayerStage.tsx      # Video + gloss panel layout
    GlossCanvas.tsx      # Canvas renderer (M4 replaces silhouette)
  utils/gloss.ts         # Active sentence + token index from playback time
```

The canvas draws a **placeholder signer silhouette** until Milestone 4 adds a rigged 3D avatar. Gloss tokens are highlighted proportionally within each sentence’s `[start, end]` window.
