const VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (VIDEO_ID_RE.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      return VIDEO_ID_RE.test(id) ? id : null;
    }

    if (host.includes("youtube.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 2 && ["embed", "shorts", "live"].includes(parts[0])) {
        const id = parts[1];
        return VIDEO_ID_RE.test(id) ? id : null;
      }

      const id = url.searchParams.get("v");
      return id && VIDEO_ID_RE.test(id) ? id : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function waitForYouTubeApi(): Promise<typeof YT> {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
  });
}
