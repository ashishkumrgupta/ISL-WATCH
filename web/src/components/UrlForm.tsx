import { type FormEvent, useState } from "react";

interface UrlFormProps {
  loading: boolean;
  onSubmit: (url: string, sampleOnly: boolean) => void;
}

const DEMO_URL = "https://www.youtube.com/watch?v=jNQXAC9IVRw";

export function UrlForm({ loading, onSubmit }: UrlFormProps) {
  const [url, setUrl] = useState(DEMO_URL);
  const [sampleOnly, setSampleOnly] = useState(true);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(url, sampleOnly);
  };

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <label className="url-form__label" htmlFor="youtube-url">
        YouTube URL or video ID
      </label>
      <div className="url-form__row">
        <input
          id="youtube-url"
          className="url-form__input"
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          disabled={loading}
          required
        />
        <button className="url-form__button" type="submit" disabled={loading}>
          {loading ? "Loading…" : "Load & translate"}
        </button>
      </div>
      <label className="url-form__checkbox">
        <input
          type="checkbox"
          checked={sampleOnly}
          onChange={(event) => setSampleOnly(event.target.checked)}
          disabled={loading}
        />
        Use bundled sample captions (skip YouTube fetch — good for demos)
      </label>
    </form>
  );
}
