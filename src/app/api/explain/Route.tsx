import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { retrieveRelevantChunks } from "@/lib/retrieval";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { log, team = "default" } = await req.json();

  if (!log?.trim()) {
    return new Response(JSON.stringify({ error: "No log provided" }), { status: 400 });
  }

  // Retrieve relevant chunks from the knowledge base
  const chunks = await retrieveRelevantChunks(log, team);

  const hasContext = chunks.length > 0;

  const contextBlock = hasContext
    ? chunks
        .map((c, i) => `[Source ${i + 1}: ${c.source} | similarity: ${(c.similarity * 100).toFixed(0)}%]\n${c.content}`)
        .join("\n\n---\n\n")
    : "No internal documentation matched this error.";

  const systemPrompt = `You are an expert on-call engineer assistant. Your job is to explain error logs and stack traces to developers on the team.

Rules:
- Be concise and direct. Lead with what went wrong, then why, then how to fix it.
- If internal documentation is provided, use it to ground your answer. Reference it explicitly.
- If no internal docs matched, say so and give a general best-practice answer.
- Format your response as:
  ## What happened
  ## Why it happened  
  ## How to fix it
  ## Sources (list doc names if used)
- Keep the total response under 400 words.`;

  const userMessage = `Error log / stack trace:
\`\`\`
${log.slice(0, 2000)}
\`\`\`

Internal knowledge base context:
${contextBlock}`;

  // Save to query history (fire-and-forget — don't await)
  const saveHistory = async (answer: string) => {
    await supabaseAdmin.from("query_history").insert({
      log_input: log.slice(0, 2000),
      answer,
      sources: chunks.map((c) => ({ source: c.source, snippet: c.content.slice(0, 150) })),
      team,
    });
  };

  // Stream the response
  const result = await streamText({
    model: openai("gpt-4o-mini"), // swap to gpt-4o or claude for better quality
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    onFinish: ({ text }) => { saveHistory(text); },
  });

  return result.toDataStreamResponse();
}