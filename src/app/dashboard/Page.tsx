import { supabase } from "@/libs/supabase";
import Link from "next/link";

export const revalidate = 0; // always fresh

async function getHistory() {
  const { data } = await supabase
    .from("query_history")
    .select("id, log_input, answer, sources, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

export default async function Dashboard() {
  const history = await getHistory();

  return (
    <main className="min-h-screen">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">L</div>
          <span className="font-semibold text-gray-900">LogExplainer</span>
        </div>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Back to explainer
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-xl font-semibold mb-6">Query history</h1>

        {history.length === 0 && (
          <p className="text-sm text-gray-500">No queries yet. Go explain a log!</p>
        )}

        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <pre className="text-xs text-gray-500 font-mono bg-gray-50 rounded p-2 flex-1 overflow-x-auto whitespace-pre-wrap line-clamp-3">
                  {item.log_input}
                </pre>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">{item.answer}</p>
              {item.sources?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {item.sources.map((s: { source: string }, i: number) => (
                    <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                      {s.source}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}