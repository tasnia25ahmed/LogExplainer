import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { chunkText, extractPdfText } from "@/lib/chunker";
import { embedBatch } from "@/lib/embeddings";

export const runtime = "nodejs"; // pdf-parse needs Node runtime

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const team = (formData.get("team") as string) || "default";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const source = file.name;

    // Extract text based on file type
    let text: string;
    if (file.type === "application/pdf" || source.endsWith(".pdf")) {
      text = await extractPdfText(buffer);
    } else {
      text = buffer.toString("utf-8");
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from file" }, { status: 400 });
    }

    // Chunk the text
    const chunks = await chunkText(text);

    // Embed all chunks in one batch call
    const embeddings = await embedBatch(chunks);

    // Upsert into Supabase
    const rows = chunks.map((content, i) => ({
      content,
      embedding: embeddings[i],
      source,
      team,
      metadata: { chunkIndex: i, totalChunks: chunks.length },
    }));

    const { error } = await supabaseAdmin.from("documents").insert(rows);
    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      chunksIngested: chunks.length,
      source,
    });
  } catch (err) {
    console.error("[ingest]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ingestion failed" },
      { status: 500 }
    );
  }
}