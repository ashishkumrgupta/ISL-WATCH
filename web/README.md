# ASL Watch — Web Player

React + TypeScript UI: YouTube embed, ASL gloss panel, and rigged 3D avatar (Milestone 4).

## Prerequisites

- Node.js 20+
- Backend on port 8000 with `OPENAI_API_KEY` (for gloss)

## Development

```bash
# Terminal 1 — API
cd backend && source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 — UI
cd web
npm install
npm run fetch-avatar   # if avatar.glb missing
npm run dev
```

Open http://127.0.0.1:5173 → **Load & translate** → play video. Gloss tokens highlight; 3D avatar plays idle animation.

## Production (single server)

```bash
cd web && npm run build
cd ../backend && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open http://127.0.0.1:8000

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (proxies `/api` → :8000) |
| `npm run build` | Production bundle → `dist/` |
| `npm run fetch-avatar` | Download default rigged GLB to `public/models/` |

## Architecture

```
src/
  api/client.ts
  hooks/useYouTubePlayer.ts
  components/
    avatar/AvatarViewport.tsx   # Three.js canvas
    avatar/AvatarModel.tsx      # GLTF + idle animation
    PlayerStage.tsx
    GlossTokenPanel.tsx
  config/avatar.ts
  utils/gloss.ts
public/models/avatar.glb
```

See [docs/WEB_PLAYER.md](../docs/WEB_PLAYER.md) and [docs/AVATAR.md](../docs/AVATAR.md).
