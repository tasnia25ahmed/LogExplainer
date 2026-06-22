"use client";

import { useState, useRef } from "react";

interface UploadResult {
  source: string;
  chunksIngested: number;
}

export default function DocUploader({ team }: { team: string }) {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);

    const newResults: UploadResult[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("team", team);

      try {
        const res = await fetch("/api/ingest", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        newResults.push({ source: file.name, chunksIngested: data.chunksIngested });
      } catch (err) {
        setError(`Failed to ingest ${file.name}: ${err instanceof Error ? err.message : "unknown error"}`);
      }
    }

    setResults((prev) => [...newResults, ...prev]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <div className="text-3xl mb-2">📄</div>
        <p className="text-sm font-medium text-gray-700">
          {uploading ? "Uploading & embedding…" : "Drop files here or click to upload"}
        </p>
        <p className="text-xs text-gray-400 mt-1">Supports .txt, .md, .pdf</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".txt,.md,.pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className="flex items-center justify-between text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <span className="font-mono text-gray-700 truncate max-w-[70%]">{r.source}</span>
              <span className="text-green-700 font-medium">{r.chunksIngested} chunks ✓</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
