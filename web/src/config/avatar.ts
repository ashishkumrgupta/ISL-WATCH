/** Rigged avatar GLTF served from /public/models. */

export const AVATAR_MODEL_URL = "/models/avatar.glb";

/** Full-body framing that worked reliably with the Xbot model. */
export const AVATAR_CAMERA = {
  position: [0, 1.05, 2.4] as [number, number, number],
  fov: 40,
};

/** Xbot from three.js examples is already in meters — do NOT use 0.01 scale. */
export const AVATAR_GROUP = {
  position: [0, 0, 0] as [number, number, number],
  scale: 1,
};

export const AVATAR_ORBIT_TARGET = [0, 0.95, 0] as [number, number, number];

/** Preferred idle clip names (Mixamo / Xbot). */
export const IDLE_ANIMATION_NAMES = ["idle", "Idle", "TPose", "tpose", "stand"];
