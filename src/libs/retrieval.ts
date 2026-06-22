import { supabaseAdmin } from "./supabase";
import { embed } from "./embeddings";
import type { MatchedChunk } from "@/types";

/**
 * Given a raw log string, pre-process it and retrieve the top-k
 * most relevant chunks from the vector store.
 */
export async function retrieveRelevantChunks(
  log: string,
  team: string = "default",
  k: number = 5
): Promise<MatchedChunk[]> {
  // Pre-process: keep first 800 chars, extract key signal
  const query = preprocessLog(log);
  const embedding = await embed(query);

  const { data, error } = await supabaseAdmin.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.4,   // lower = broader recall; raise to 0.6 for precision
    match_count: k,
    filter_team: team,
  });

  if (error) throw new Error(`Retrieval failed: ${error.message}`);
  return (data ?? []) as MatchedChunk[];
}

/**
 * Strip noise from logs before embedding.
 * Keeps error type, message, and first few stack lines.
 */
function preprocessLog(raw: string): string {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  // Pull out lines that look like error messages or exception types
  const errorLines = lines.filter((l) =>
    /error|exception|fatal|failed|refused|timeout|null|undefined/i.test(l)
  );

  const topLines = lines.slice(0, 8);
  const combined = [...new Set([...errorLines, ...topLines])].slice(0, 12);
  return combined.join("\n").slice(0, 800);
}