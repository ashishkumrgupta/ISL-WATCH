import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  defaultOverlayLayout,
  OverlayLayout,
  SignOverlay,
} from "../components/SignOverlay";
import { useIncomingVideoUrl } from "../hooks/useIncomingVideoUrl";
import { parseYouTubeVideoId } from "../utils/youtube";

const SAMPLE_URL = "https://www.youtube.com/watch?v=jNQXAC9IVRw";

export function WatchScreen() {
  const [urlInput, setUrlInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playerBounds, setPlayerBounds] = useState({ width: 0, height: 0 });
  const [overlayLayout, setOverlayLayout] = useState<OverlayLayout | null>(null);
  const [shareHint, setShareHint] = useState<string | null>(null);

  const playVideo = useCallback((id: string, rawUrl?: string) => {
    setError(null);
    setVideoId(id);
    setPlaying(true);
    if (rawUrl) setUrlInput(rawUrl);
    setShareHint(null);
  }, []);

  useIncomingVideoUrl(
    useCallback(
      ({ videoId: id, rawUrl }) => {
        playVideo(id, rawUrl);
        setShareHint("Opened from Share — playing now.");
      },
      [playVideo]
    ),
    useCallback(() => {
      setError("Shared content is not a YouTube link.");
    }, [])
  );

  const loadVideo = useCallback(() => {
    const id = parseYouTubeVideoId(urlInput);
    if (!id) {
      setError("Paste a valid YouTube link or 11-character video ID.");
      setVideoId(null);
      return;
    }
    playVideo(id, urlInput.trim());
  }, [urlInput, playVideo]);

  const loadSample = useCallback(() => {
    setUrlInput(SAMPLE_URL);
    const id = parseYouTubeVideoId(SAMPLE_URL);
    if (id) playVideo(id, SAMPLE_URL);
  }, [playVideo]);

  const onPlayerLayout = useCallback(
    (width: number, height: number) => {
      setPlayerBounds({ width, height });
      setOverlayLayout((prev) => prev ?? defaultOverlayLayout({ width, height }));
    },
    []
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "android" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>ISL Watch</Text>
          <Text style={styles.subtitle}>Android · ISL overlay on YouTube</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Paste YouTube URL…"
            placeholderTextColor="#64748b"
            value={urlInput}
            onChangeText={setUrlInput}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={loadVideo}
          />
          <Pressable style={styles.button} onPress={loadVideo}>
            <Text style={styles.buttonText}>Play</Text>
          </Pressable>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {shareHint ? <Text style={styles.shareHint}>{shareHint}</Text> : null}

        <Pressable onPress={loadSample}>
          <Text style={styles.sampleLink}>Try sample video</Text>
        </Pressable>

        <View
          style={styles.playerWrap}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            onPlayerLayout(width, height);
          }}
        >
          {videoId ? (
            <>
              <YoutubePlayer
                height={220}
                play={playing}
                videoId={videoId}
                onChangeState={(state) => {
                  if (state === "ended") setPlaying(false);
                  if (state === "playing") setPlaying(true);
                  if (state === "paused") setPlaying(false);
                }}
              />
              {overlayLayout ? (
                <SignOverlay
                  visible
                  bounds={playerBounds}
                  layout={overlayLayout}
                  onLayoutChange={setOverlayLayout}
                />
              ) : null}
            </>
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Paste a link, or in YouTube tap Share → ISL Watch (dev build). Drag
                the signer panel to move it; pull ↘ to resize.
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.disclaimer}>
          Automated ISL — improving. Not a substitute for a human interpreter.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  flex: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  appName: {
    color: "#f8fafc",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#0284c7",
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  error: {
    color: "#f87171",
    fontSize: 13,
    marginBottom: 8,
  },
  shareHint: {
    color: "#4ade80",
    fontSize: 13,
    marginBottom: 8,
  },
  sampleLink: {
    color: "#38bdf8",
    fontSize: 13,
    marginBottom: 16,
  },
  playerWrap: {
    flex: 1,
    minHeight: 240,
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  placeholderText: {
    color: "#94a3b8",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  disclaimer: {
    color: "#64748b",
    fontSize: 11,
    textAlign: "center",
    marginVertical: 16,
    paddingHorizontal: 8,
  },
});
