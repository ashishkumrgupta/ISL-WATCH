# Milestone 3 — Web Player

## Goal

A browser UI where a YouTube video plays alongside an ASL gloss overlay that tracks playback time.

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript |
| Bundler | Vite 6 |
| Video | [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) |
| Overlay | Gloss token panel + Three.js rigged avatar |
| Data | `POST /api/pipeline` from the FastAPI backend |

## User flow

```mermaid
sequenceDiagram
  participant User
  participant Web as web/ (React)
  participant API as backend/
  participant YT as YouTube IFrame

  User->>Web: Paste URL, click Load
  Web->>API: POST /api/pipeline
  API-->>Web: video_id + gloss sentences
  Web->>YT: Embed player(video_id)
  loop Every 100ms while playing
    Web->>YT: getCurrentTime()
    Web->>Web: findActiveSentence + highlight token
    Web->>Web: highlight gloss token + idle avatar
  end
```

## Gloss sync logic

Each gloss sentence has `start` and `end` (seconds). On each time tick:

1. Find the sentence where `start <= t < end`.
2. Split `gloss` on whitespace into tokens (e.g. `HERE ELEPHANT COOL`).
3. Map playback progress within the sentence to an active token index.
4. Highlight the active token in the gloss panel; the 3D avatar plays idle animation (signing in Milestone 5).

Word-level gloss timing is not available yet — tokens are distributed evenly across the sentence duration. Milestone 5 may add per-sign timing.

## Deployment modes

| Mode | Commands | URL |
|------|----------|-----|
| Dev | `uvicorn` + `npm run dev` | http://127.0.0.1:5173 |
| Single server | `npm run build` then `uvicorn` | http://127.0.0.1:8000 |

In dev, Vite proxies `/api` and `/health` to the backend. In production, FastAPI serves `web/dist/` at `/` after API routes are registered.

## 3D avatar (Milestone 4)

The sidebar includes a React Three Fiber viewport with a rigged GLB model. See [AVATAR.md](AVATAR.md).

## Next: Milestone 5

Map active gloss tokens to sign animation clips in `web/src/signing/`.
