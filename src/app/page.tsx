import LogInput from "./components/LogInput";
import DocUploader from "./components/DocUploader";
import Link from "next/link";
import {Terminal} from "lucide-react";


const TEAM = "default";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f13] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 bg-[#0f0f13]/90 z-10">

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/30"
              style={{ background: "linear-gradient(135deg, #1942e6e8,purple )", border: "1px solid white" }}>
              <Terminal size={14} className="text-[white]" />
            </div>
          <span className="font-semibold tracking-tight">LogExplainer</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
            Beta
          </span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-white/40 hover:text-white/80 transition-colors"
        >
          Query history →
        </Link>
      </header>

      {/* Hero */}
      <div className="text-center pt-14 pb-10 px-6">
        <div className="inline-flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          AI-powered • Grounded in your team's docs
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Explain any error log instantly
        </h1>
        <p className="text-white/50 text-base max-w-lg mx-auto">
          Paste a stack trace, get a root cause analysis grounded in your team's runbooks and past incidents.
        </p>
      </div>

      {/* Main panels */}
      <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left: explain */}
        <section className="lg:col-span-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <h2 className="text-sm font-semibold text-white/80 uppercase tracking-widest">Explain a log</h2>
            </div>
            <p className="text-xs text-white/30 mb-5">
              Paste any error log or stack trace below
            </p>
            <LogInput team={TEAM} />
          </div>
        </section>

        {/* Right: knowledge base */}
        <section className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <h2 className="text-sm font-semibold text-white/80 uppercase tracking-widest">Knowledge base</h2>
            </div>
            <p className="text-xs text-white/30 mb-5">
              Upload runbooks, postmortems, .txt .md .pdf
            </p>
            <DocUploader team={TEAM} />
          </div>
        </section>

      </div>
    </main>
  );
}