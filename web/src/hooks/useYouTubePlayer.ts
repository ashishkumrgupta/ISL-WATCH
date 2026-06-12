import { type RefObject, useEffect, useRef, useState } from "react";

import { waitForYouTubeApi } from "../utils/youtube";

interface UseYouTubePlayerResult {
  containerRef: RefObject<HTMLDivElement | null>;
  currentTime: number;
  isReady: boolean;
  isPlaying: boolean;
}

export function useYouTubePlayer(videoId: string | null): UseYouTubePlayerResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    let cancelled = false;
    let intervalId: number | undefined;

    const mountPlayer = async () => {
      const YT = await waitForYouTubeApi();
      if (cancelled || !containerRef.current) return;

      playerRef.current?.destroy();
      containerRef.current.innerHTML = "";

      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            if (!cancelled) setIsReady(true);
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === YT.PlayerState.PLAYING);
          },
        },
      });

      intervalId = window.setInterval(() => {
        const player = playerRef.current;
        if (!player?.getCurrentTime) return;
        const time = player.getCurrentTime();
        if (typeof time === "number") setCurrentTime(time);
      }, 100);
    };

    setIsReady(false);
    setCurrentTime(0);
    void mountPlayer();

    return () => {
      cancelled = true;
      if (intervalId !== undefined) window.clearInterval(intervalId);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  return { containerRef, currentTime, isReady, isPlaying };
}
