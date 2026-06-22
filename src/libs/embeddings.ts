import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Embed a single string. Returns a 1536-dim vector.
 * Uses text-embedding-3-small (~$0.02 per million tokens).
 */
export async function embed(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.replace(/\n/g, " "), // newlines reduce quality
  });
  return res.data[0].embedding;
}

/**
 * Embed multiple strings in one API call (more efficient for ingestion).
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts.map((t) => t.replace(/\n/g, " ")),
  });
  return res.data.map((d) => d.embedding);
}