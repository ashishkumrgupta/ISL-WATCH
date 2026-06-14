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

**Stack:** React, TypeScript, Vite, YouTube IFrame Player API.

**Location:** `web/` — see [WEB_PLAYER.md](WEB_PLAYER.md)

---

## Milestone 4: Rigged 3D Avatar System ✅

**Goal:** WebGL rigged humanoid signer in the player panel.

**Stack:** Three.js, React Three Fiber, glTF/GLB.

**Location:** `web/src/components/avatar/` — see [AVATAR.md](AVATAR.md)

**Run:**
```bash
cd web
npm install
npm run fetch-avatar   # if model missing
npm run dev
```

Idle animation plays; gloss sync is visual-only until Milestone 5.

---

## Milestone 5: Gloss-to-Animation Mapping Bridge (prototype)

**Goal:** Drive the 3D rig from gloss strings.

**Current:** Placeholder body clips per gloss token.

**Next:** Real ASL sign library — see [REAL_ASL.md](REAL_ASL.md).

---

## Current status

| Milestone | Status |
|-----------|--------|
| 1 — Captions | **Done** |
| 2 — Gloss LLM | **Done** |
| 3 — Web player | **Done** |
| 4 — 3D avatar | **Done** |
| 5 — Gloss → animation | **Prototype** (see [REAL_ASL.md](REAL_ASL.md)) |
| Real ASL quality | **Planned** — [REAL_ASL_PLAN.md](REAL_ASL_PLAN.md) (scalability + coverage model) |
