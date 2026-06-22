"use client";

import { useState } from "react";
import { useCompletion } from "ai/react";

export default function LogInput({ team }: { team: string }) {
  const [log, setLog] = useState("");

  const { complete, completion, isLoading, error } = useCompletion({
    api: "/api/explain",
  });

  const handleSubmit = async () => {
    if (!log.trim()) return;
    await complete("", {
      body: { log, team },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paste your error log or stack trace
        </label>
        <textarea
          className="w-full h-48 font-mono text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none"
          placeholder={`ERROR: Connection refused\n  at DBPool.connect (db/pool.js:42)\n  at PaymentsService.charge (payments/service.js:88)`}
          value={log}
          onChange={(e) => setLog(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !log.trim()}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Analyzing…" : "Explain this log →"}
      </button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error.message}
        </p>
      )}

      {completion && <AnswerPanel answer={completion} />}
    </div>
  );
}

function AnswerPanel({ answer }: { answer: string }) {
  const sections = answer.split(/^## /m).filter(Boolean);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-gray-700">Explanation</span>
      </div>
      <div className="p-4 space-y-4">
        {sections.map((section, i) => {
          const [heading, ...body] = section.split("\n");
          return (
            <div key={i}>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{heading}</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {body.join("\n").trim()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
