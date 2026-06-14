# Milestone 4 — Rigged 3D Avatar

## Goal

Replace the 2D placeholder with a **WebGL rigged humanoid** that will perform ASL signs in Milestone 5.

## Stack

| Piece | Choice |
|-------|--------|
| Renderer | Three.js via `@react-three/fiber` |
| Helpers | `@react-three/drei` (`useGLTF`, `useAnimations`, `OrbitControls`, `Loader`) |
| Asset format | glTF binary (`.glb`) with skeleton + animation clips |
| Default model | [Three.js Xbot sample](https://threejs.org/examples/models/gltf/Xbot.glb) (Mixamo-style rig) |

## Layout

```
web/src/components/avatar/
  AvatarViewport.tsx   # Canvas, lights, camera, controls
  AvatarModel.tsx      # Loads GLB, plays idle clip
web/src/config/avatar.ts   # Model URL, camera, scale constants
web/public/models/avatar.glb
web/scripts/fetch-avatar.mjs
```

The avatar panel sits above the gloss token list in the player sidebar. Users can orbit/zoom the signer (pan disabled) to inspect the rig.

## Model setup

The repo ships with the default Xbot model. To re-download:

```bash
cd web
npm run fetch-avatar
```

To swap in a custom signer (e.g. Mixamo export):

1. Export **glTF Binary (.glb)** with skin + at least one idle clip.
2. Replace `web/public/models/avatar.glb`.
3. Tune `AVATAR_GROUP` scale/position and `IDLE_ANIMATION_NAMES` in `web/src/config/avatar.ts`.

**Scale note:** The bundled Xbot model is already ~1.8 m tall at `scale: 1`. Some Mixamo exports use centimeters and need `scale: 0.01` instead — if the avatar looks invisible, check the model bounding box first.

## Current behaviour (M4)

- Loads rigged GLB on player mount
- Plays idle / T-pose animation loop
- Subtle body turn when video is paused vs playing
- **Does not yet sign** — gloss tokens highlight in the panel only

## Next: Milestone 5

Wire `GlossTokenPanel` active token → animation clips or procedural keyframes in `AvatarModel.tsx` via a gloss-to-clip registry under `web/src/signing/`.
