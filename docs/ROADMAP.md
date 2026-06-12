# ASL Video Overlay — Project Roadmap

Software to help Deaf and hard-of-hearing users enjoy existing video content by converting YouTube captions into an **American Sign Language (ASL)** automated visual avatar overlay.

---

## Milestone 1: Caption Extraction & Preprocessing ✅

**Goal:** Extract raw, timestamped English subtitles from any YouTube URL.

**Endpoint:** `POST /api/captions`

---

## Milestone 2: Text-to-Gloss Machine Translation ✅

**Goal:** Reorder linear English into ASL syntactic gloss.

**Stack:** OpenAI API (`gpt-4o-mini`) — swappable via `providers/gloss/`

**Endpoints:**
- `POST /api/gloss` — gloss only
- `POST /api/pipeline` — captions + gloss

Requires `OPENAI_API_KEY` in `backend/.env`.

---

## Milestone 3: Web-Based Video Player & Canvas Overlay ✅

**Goal:** UI where video plays and gloss is shown in sync with playback.

**Stack:** React, TypeScript, Vite, YouTube IFrame Player API, HTML5 canvas.

**Location:** `web/` — see [WEB_PLAYER.md](WEB_PLAYER.md)

**Run:**
```bash
# Dev: backend on :8000 + web on :5173
cd web && npm run dev

# Or single server after build
cd web && npm run build
cd ../backend && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The canvas shows a **placeholder signer silhouette**; Milestone 4 replaces it with a 3D avatar.

---

## Milestone 4: Rigged 3D Avatar System (next)

**Goal:** High-fidelity digital human capable of signing.

**Stack:** Three.js or Babylon.js, WebGL, rigged GLTF/FBX.

---

## Milestone 5: Gloss-to-Animation Mapping Bridge

**Goal:** Drive the 3D rig from gloss strings.

**Stack:** JavaScript animation interpolation / keyframing.

---

## Current status

| Milestone | Status |
|-----------|--------|
| 1 — Captions | **Done** |
| 2 — Gloss LLM | **Done** |
| 3 — Web player | **Done** |
| 4 — 3D avatar | **Next** |
| 5 — Gloss → animation | Planned |
