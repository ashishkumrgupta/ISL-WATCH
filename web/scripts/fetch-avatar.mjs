#!/usr/bin/env node
/**
 * Download the default rigged avatar (Three.js Xbot sample) into public/models/.
 * Run: npm run fetch-avatar
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/models");
const OUT_FILE = path.join(OUT_DIR, "avatar.glb");
const URL = "https://threejs.org/examples/models/gltf/Xbot.glb";

const response = await fetch(URL);
if (!response.ok) {
  console.error(`Failed to download avatar: ${response.status} ${response.statusText}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
const buffer = Buffer.from(await response.arrayBuffer());
await writeFile(OUT_FILE, buffer);
console.log(`Saved ${OUT_FILE} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
