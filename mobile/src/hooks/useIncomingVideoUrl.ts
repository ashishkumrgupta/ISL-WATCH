import { useEffect, useRef } from "react";
import * as Linking from "expo-linking";
import { useShareIntent } from "expo-share-intent";
import { parseYouTubeVideoId } from "../utils/youtube";

export type IncomingVideo = {
  videoId: string;
  rawUrl: string;
};

/** Pull a YouTube video ID from share intent text / extracted web URL. */
export function videoIdFromSharePayload(
  text?: string | null,
  webUrl?: string | null
): string | null {
  if (webUrl) {
    const fromUrl = parseYouTubeVideoId(webUrl);
    if (fromUrl) return fromUrl;
  }

  if (!text) return null;

  const fromText = parseYouTubeVideoId(text);
  if (fromText) return fromText;

  const urlInText = text.match(/https?:\/\/[^\s]+/i)?.[0];
  if (urlInText) return parseYouTubeVideoId(urlInText);

  return null;
}

/**
 * Loads a video when the app opens via Android share sheet or a YouTube deep link.
 */
export function useIncomingVideoUrl(
  onVideo: (payload: IncomingVideo) => void,
  onUnrecognizedShare?: () => void
) {
  const onVideoRef = useRef(onVideo);
  onVideoRef.current = onVideo;
  const onUnrecognizedRef = useRef(onUnrecognizedShare);
  onUnrecognizedRef.current = onUnrecognizedShare;

  const { shareIntent, resetShareIntent, hasShareIntent } = useShareIntent();

  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (!url) return;
      const videoId = parseYouTubeVideoId(url);
      if (videoId) onVideoRef.current({ videoId, rawUrl: url });
    };

    Linking.getInitialURL().then(handleUrl);
    const sub = Linking.addEventListener("url", ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!hasShareIntent) return;

    const text = shareIntent?.text ?? null;
    const webUrl = shareIntent?.webUrl ?? null;
    const videoId = videoIdFromSharePayload(text, webUrl);

    if (videoId) {
      onVideoRef.current({
        videoId,
        rawUrl: webUrl ?? text ?? "",
      });
    } else if (text || webUrl) {
      onUnrecognizedRef.current?.();
    }

    resetShareIntent();
  }, [hasShareIntent, shareIntent, resetShareIntent]);
}
