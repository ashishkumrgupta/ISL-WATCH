import { useMemo, useRef } from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";

export type OverlayLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Bounds = { width: number; height: number };

type Props = {
  visible: boolean;
  bounds: Bounds;
  layout: OverlayLayout;
  onLayoutChange: (layout: OverlayLayout) => void;
};

const MIN_WIDTH = 100;
const MIN_HEIGHT = 120;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampLayout(layout: OverlayLayout, bounds: Bounds): OverlayLayout {
  const maxWidth = bounds.width * 0.55;
  const maxHeight = bounds.height * 0.75;
  const width = clamp(layout.width, MIN_WIDTH, maxWidth);
  const height = clamp(layout.height, MIN_HEIGHT, maxHeight);
  const x = clamp(layout.x, 0, Math.max(0, bounds.width - width));
  const y = clamp(layout.y, 0, Math.max(0, bounds.height - height));
  return { x, y, width, height };
}

/**
 * Placeholder for the ISL signer (AI avatar or video clips).
 * Phase 1: draggable + resizable panel. Later: sync to main playback.
 */
export function SignOverlay({ visible, bounds, layout, onLayoutChange }: Props) {
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;

  const dragResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          const base = layoutRef.current;
          onLayoutChange(
            clampLayout(
              {
                ...base,
                x: base.x + gesture.dx,
                y: base.y + gesture.dy,
              },
              boundsRef.current
            )
          );
        },
      }),
    [onLayoutChange]
  );

  const resizeResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          const base = layoutRef.current;
          onLayoutChange(
            clampLayout(
              {
                ...base,
                width: base.width + gesture.dx,
                height: base.height + gesture.dy,
              },
              boundsRef.current
            )
          );
        },
      }),
    [onLayoutChange]
  );

  if (!visible || bounds.width === 0) return null;

  return (
    <View
      style={[
        styles.container,
        {
          left: layout.x,
          top: layout.y,
          width: layout.width,
          height: layout.height,
        },
      ]}
    >
      <View style={styles.panel}>
        <View style={styles.dragHandle} {...dragResponder.panHandlers}>
          <Text style={styles.dragHint}>⋮⋮ drag</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.badge}>ISL</Text>
          <Text style={styles.title}>Signer</Text>
          <Text style={styles.hint}>AI signing will appear here</Text>
        </View>
        <View style={styles.resizeHandle} {...resizeResponder.panHandlers}>
          <Text style={styles.resizeGlyph}>↘</Text>
        </View>
      </View>
    </View>
  );
}

/** Default bottom-right overlay size for a player region. */
export function defaultOverlayLayout(bounds: Bounds): OverlayLayout {
  const width = Math.min(168, Math.max(MIN_WIDTH, bounds.width * 0.38));
  const height = Math.min(bounds.height * 0.55, width * (4 / 3));
  return clampLayout(
    {
      x: bounds.width - width - 12,
      y: bounds.height - height - 12,
      width,
      height,
    },
    bounds
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
  },
  panel: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#38bdf8",
    overflow: "hidden",
  },
  dragHandle: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "rgba(2, 132, 199, 0.35)",
    alignItems: "center",
  },
  dragHint: {
    color: "#bae6fd",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  badge: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600",
  },
  hint: {
    color: "#94a3b8",
    fontSize: 10,
    textAlign: "center",
    marginTop: 6,
  },
  resizeHandle: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingRight: 6,
    paddingBottom: 4,
  },
  resizeGlyph: {
    color: "#38bdf8",
    fontSize: 14,
    fontWeight: "700",
  },
});
