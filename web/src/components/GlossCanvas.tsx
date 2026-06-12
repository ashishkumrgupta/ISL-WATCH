import { useEffect, useRef } from "react";

import type { GlossSentence } from "../types/pipeline";
import { activeTokenIndex, parseGlossTokens } from "../utils/gloss";

interface GlossCanvasProps {
  sentence: GlossSentence | null;
  currentTime: number;
  isPlaying: boolean;
}

export function GlossCanvas({ sentence, currentTime, isPlaying }: GlossCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    context.fillStyle = "#0f1419";
    context.fillRect(0, 0, width, height);

    // Placeholder signer silhouette (replaced by 3D avatar in Milestone 4)
    const centerX = width / 2;
    const headY = height * 0.22;
    context.fillStyle = "#2a3544";
    context.beginPath();
    context.arc(centerX, headY, 36, 0, Math.PI * 2);
    context.fill();
    context.fillRect(centerX - 28, headY + 30, 56, 70);
    context.fillStyle = "#1a2330";
    context.fillRect(centerX - 48, headY + 42, 22, 58);
    context.fillRect(centerX + 26, headY + 42, 22, 58);

    if (!sentence) {
      context.fillStyle = "#8b98a8";
      context.font = "600 16px system-ui, sans-serif";
      context.textAlign = "center";
      context.fillText("Press play — gloss appears here", centerX, height * 0.72);
      return;
    }

    const tokens = parseGlossTokens(sentence.gloss);
    const activeIndex = activeTokenIndex(sentence, currentTime, tokens.length);
    const tokenY = height * 0.68;
    const gap = 10;
    const tokenWidths = tokens.map((token) => context.measureText(token).width + 24);
    const totalWidth = tokenWidths.reduce((sum, w) => sum + w, 0) + gap * Math.max(tokens.length - 1, 0);
    let x = Math.max(16, (width - totalWidth) / 2);

    tokens.forEach((token, index) => {
      const isActive = isPlaying && index === activeIndex;
      const boxWidth = tokenWidths[index] ?? 40;

      context.fillStyle = isActive ? "#3b82f6" : "#243044";
      context.beginPath();
      context.roundRect(x, tokenY - 28, boxWidth, 36, 8);
      context.fill();

      context.fillStyle = isActive ? "#ffffff" : "#c8d2dc";
      context.font = isActive ? "700 15px ui-monospace, monospace" : "600 14px ui-monospace, monospace";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(token, x + boxWidth / 2, tokenY - 10);

      x += boxWidth + gap;
    });

    if (sentence.non_manual_markers.length > 0) {
      context.fillStyle = "#f59e0b";
      context.font = "500 12px system-ui, sans-serif";
      context.textAlign = "center";
      context.fillText(
        `NMM: ${sentence.non_manual_markers.map((m) => `[${m}]`).join(" ")}`,
        centerX,
        height * 0.86,
      );
    }

    context.fillStyle = "#94a3b8";
    context.font = "400 13px system-ui, sans-serif";
    context.textAlign = "center";
    const english = sentence.english.length > 90 ? `${sentence.english.slice(0, 87)}…` : sentence.english;
    context.fillText(english, centerX, height * 0.92);
  }, [sentence, currentTime, isPlaying]);

  return <canvas ref={canvasRef} className="gloss-canvas" aria-label="ASL gloss overlay" />;
}
