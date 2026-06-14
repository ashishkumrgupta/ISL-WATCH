# Path to Real ASL Signing

This document outlines how to evolve ASL Watch from **gloss text + placeholder gestures** to **recognizable ASL signing**.

## Where we are today

```
YouTube → captions → OpenAI gloss → timed tokens → generic body clips (Xbot)
```

Gloss is linguistically useful but the avatar does **not** perform real ASL signs yet.

## Target pipeline

```
YouTube → captions → ASL gloss → sign sequence → pose/clip playback → avatar
```

---

## Three viable approaches (in order of practicality)

### 1. Sign clip library (recommended next step)

**Idea:** One animation clip per gloss lemma (or per ASL-LEX sign ID).

| Piece | Source |
|-------|--------|
| Avatar | Mixamo / Ready Player Me / custom rigged human with **hand bones** |
| Sign clips | MoCap, [ASL-LEX](https://asl-lex.org/), SignBank, or commissioned signer |
| Mapping | `web/src/signing/glossClipRegistry.ts` → `{ "ELEPHANT": "sign_elephant.glb" }` |

**Pros:** Predictable, best quality, works offline  
**Cons:** Limited vocabulary until library grows; need consistent rig

**Implementation steps:**
1. Switch to a **human signer rig** with detailed hand joints (minimum: wrist + 5 fingers × 3 bones)
2. Define gloss normalization (uppercase lemmas, no punctuation, map synonyms)
3. Store clips as glTF animation tracks or separate `.glb` per sign
4. Extend registry: gloss token → clip name + duration
5. Queue signs with cross-fade; respect sentence timing from captions
6. Fall back to fingerspelling clip for unknown tokens

### 2. Fingerspelling fallback + core vocabulary

For unknown gloss tokens, spell letter-by-letter using 26 letter clips (ASL manual alphabet).

```
UNKNOWN_TOKEN → ["C","A","T"] → play cat_fingerspell or C-A-T clips
```

Build ~26 letter clips + ~500 core sign clips for ~80% coverage of common speech.

### 3. ML pose generation (research / later)

**Idea:** Model maps gloss string → 3D joint rotations (SMPL-X hands, or custom skeleton).

| Examples | Notes |
|----------|-------|
| SignLLM / sign language diffusion | Needs training data, GPU, evaluation |
| HamNoSys / SignWriting → pose rules | Linguistically grounded, complex authoring |

**Pros:** Open vocabulary  
**Cons:** Hard to ship reliably; quality varies; needs expert review

---

## Recommended roadmap (project-specific)

| Phase | Goal | Effort |
|-------|------|--------|
| **A** | Fix stable avatar + idle (done in this milestone) | Small |
| **B** | Human rig with visible hands; chest-up camera | Medium |
| **C** | 26 fingerspelling clips + registry lookup | Medium |
| **D** | 100–500 core sign clips from ASL-LEX or mocap | Large |
| **E** | Gloss lemmatizer (ELEPHANTS → ELEPHANT) before lookup | Small |
| **F** | Non-manual markers (NMM) → eyebrow/head overlays | Medium |
| **G** | ML assist for out-of-vocabulary gloss | Research |

---

## Data sources for real signs

- **[ASL-LEX](https://asl-lex.org/)** — sign videos + frequency; good for prioritizing vocabulary
- **[SignBank](https://signbank.org/)** — ID-linked sign recordings (mostly BSL/others; check license)
- **[HamNoSys](https://www.hamburg.de/hamburgsign/)** — phonetic notation → can drive rule-based avatars
- **Custom moCap** — one signer, one rig, consistent quality (best for product)

---

## Technical changes in this repo

```
web/src/signing/
  glossClipRegistry.ts     # token → clip (expand this)
  signQueue.ts             # (new) queue + timing for clip playback
  fingerspell.ts           # (new) word → letter sequence
public/signs/              # (new) glTF clips or combined library
public/models/avatar.glb   # replace Xbot with human signer rig
```

Backend (optional later):
- `POST /api/gloss` could return **ASL-LEX IDs** alongside gloss strings
- Lemmatization / synonym table in `backend/app/services/`

---

## Quality bar for "real ASL"

Before calling it production-ready:

1. **Deaf reviewer** validates signs for sample videos
2. **Lemmatization** — plural/tense mapped to citation form
3. **NMM support** — questions, negation, topicalization affect face/body
4. **Timing** — sign duration matches natural production, not equal-split tokens
5. **Fingerspelling policy** — names, untranslatable terms, acronyms

---

## Immediate next action (Phase B)

Replace Xbot with a **human Mixamo character** (Y-Bot/Riley) exported with:
- T-pose + idle
- Upper-body signing space visible
- Hand bones intact

Then record or source **10 test signs** (HELLO, THANK-YOU, YES, NO, I, YOU, WANT, GO, GOOD, HELP) to prove the clip pipeline end-to-end.
