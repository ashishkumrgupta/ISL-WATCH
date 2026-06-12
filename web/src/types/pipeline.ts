export interface GlossSentence {
  start: number;
  end: number;
  english: string;
  gloss: string;
  non_manual_markers: string[];
}

export interface GlossTrack {
  video_id: string;
  provider: string;
  sentence_count: number;
  sentences: GlossSentence[];
}

export interface PipelineResponse {
  video_id: string;
  captions: {
    video_id: string;
    language: string;
    source: string;
    sentence_count: number;
    sentences: { start: number; end: number; text: string }[];
  };
  gloss?: GlossTrack;
}

export interface HealthResponse {
  status: string;
  milestone: number;
  gloss_enabled: boolean;
  openai_model: string;
}
