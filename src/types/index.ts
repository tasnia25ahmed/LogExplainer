export interface DocumentChunk {
  content: string;
  source: string;
  team: string;
  metadata?: {
    page?: number;
    section?: string;
    [key: string]: unknown;
  };
}

export interface MatchedChunk extends DocumentChunk {
  id: number;
  similarity: number;
}

export interface ExplainRequest {
  log: string;
  team?: string;
}

export interface ExplainResponse {
  answer: string;
  sources: Array<{
    source: string;
    snippet: string;
    similarity: number;
  }>;
}

export interface IngestRequest {
  team?: string;
}