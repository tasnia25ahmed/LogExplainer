import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,       // tokens (approximate)
  chunkOverlap: 50,     // overlap keeps context across chunk boundaries
  separators: ["\n\n", "\n", ". ", " ", ""],
});

/**
 * Split a document string into overlapping chunks.
 */
export async function chunkText(text: string): Promise<string[]> {
  const docs = await splitter.createDocuments([text]);
  return docs.map((d) => d.pageContent.trim()).filter((c) => c.length > 30);
}

/**
 * Extract plain text from a PDF buffer using pdf-parse.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  // Dynamic import keeps pdf-parse server-side only
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}