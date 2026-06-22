<div align="center">

```
██╗      ██████╗  ██████╗     ███████╗██╗  ██╗██████╗ ██╗      █████╗ ██╗███╗   ██╗███████╗██████╗
██║     ██╔═══██╗██╔════╝     ██╔════╝╚██╗██╔╝██╔══██╗██║     ██╔══██╗██║████╗  ██║██╔════╝██╔══██╗
██║     ██║   ██║██║  ███╗    █████╗   ╚███╔╝ ██████╔╝██║     ███████║██║██╔██╗ ██║█████╗  ██████╔╝
██║     ██║   ██║██║   ██║    ██╔══╝   ██╔██╗ ██╔═══╝ ██║     ██╔══██║██║██║╚██╗██║██╔══╝  ██╔══██╗
███████╗╚██████╔╝╚██████╔╝    ███████╗██╔╝ ██╗██║     ███████╗██║  ██║██║██║ ╚████║███████╗██║  ██║
╚══════╝ ╚═════╝  ╚═════╝     ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
```

**AI-powered error log analysis, grounded in your team's own docs.**

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=black)](https://supabase.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/your-username/logexplainer/pulls)
![Status](https://img.shields.io/badge/Status-Beta-orange?style=flat-square)

</div>

---

## 🧠 What is this?

Most teams debug by Googling errors. LogExplainer is different — it explains your errors using **your team's own runbooks, postmortems, and internal docs**.

```
You paste this:                         You get this:
──────────────────────────────────      ──────────────────────────────────────────
ERROR: Connection refused               ## What happened
  at DBPool.connect (db/pool.js:42)     The DB connection pool was exhausted.
  at PaymentsService.charge (...)
                                        ## Why it happened
                                        Based on your postmortem (March 2024),
                                        a missing client.release() in processRefund()
                                        drains the pool under load.

                                        ## How to fix it
                                        1. kubectl rollout restart deployment/payments
                                        2. Check pool size: DB_POOL_SIZE env var
                                        3. See PR #482 for the permanent fix

                                        📄 Source: postmortem-2024-03.md
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **RAG-powered answers** | Retrieves your team's relevant docs before generating any response |
| 📄 **Multi-format ingestion** | Upload `.txt`, `.md`, or `.pdf` runbooks and postmortems |
| ⚡ **Streaming responses** | Answers stream token-by-token, no waiting for full response |
| 🗂️ **Query history** | Every explanation saved and browsable at `/dashboard` |
| 🏷️ **Source citations** | Every answer links back to which internal doc it came from |
| 🧩 **Team workspaces** | Isolated knowledge bases per team via `team_id` |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    INGESTION PIPELINE                    │
│                                                         │
│  Upload doc → Chunk → Embed → Store in pgvector         │
│  (.md/.txt/.pdf)  (500tok)  (OpenAI)  (Supabase)        │
└─────────────────────────────────────────────────────────┘
                            ↓ knowledge base ready
┌─────────────────────────────────────────────────────────┐
│                     QUERY PIPELINE                      │
│                                                         │
│  Paste log → Pre-process → Embed → Similarity search    │
│               (extract err)  (OpenAI)  (pgvector top-5) │
│                                    ↓                    │
│               Build prompt (log + retrieved chunks)     │
│                                    ↓                    │
│               LLM call → Stream answer → Save history   │
│               (GPT-4o-mini)                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick start

### Prerequisites
- Node.js 18+
- [Supabase](https://supabase.com) account (free)
- [OpenAI](https://platform.openai.com) API key

### 1. Clone & install

```bash
git clone https://github.com/your-username/logexplainer.git
cd logexplainer
npm install --legacy-peer-deps
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste and run `supabase/schema.sql`
3. Go to **Settings → API** → copy your keys

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → upload a doc from `docs-sample/` → paste a log → get an answer.

---

## 📁 Project structure

```
logexplainer/
├── src/
│   ├── app/
│   │   ├── _components/
│   │   │   ├── LogInput.tsx        # Log textarea + streaming answer UI
│   │   │   └── DocUploader.tsx     # Drag-and-drop file ingestion
│   │   ├── api/
│   │   │   ├── ingest/route.ts     # Chunk → embed → store pipeline
│   │   │   └── explain/route.ts    # Retrieve → prompt → stream answer
│   │   ├── dashboard/page.tsx      # Query history
│   │   └── page.tsx                # Main UI
│   ├── lib/
│   │   ├── supabase.ts             # DB client (anon + admin)
│   │   ├── embeddings.ts           # OpenAI embedding wrapper
│   │   ├── chunker.ts              # Text splitting + PDF extraction
│   │   └── retrieval.ts            # Similarity search + log pre-processing
│   └── types/index.ts
├── supabase/
│   └── schema.sql                  # pgvector setup + match function
└── docs-sample/                    # Sample runbook + postmortem for testing
```

---

## 🗺️ Roadmap

- [x] Core RAG pipeline (ingest + explain)
- [x] Streaming responses
- [x] Query history dashboard
- [x] Source citations
- [ ] Slack bot — `/explain-log` slash command
- [ ] Claude (Anthropic) LLM integration
- [ ] Team authentication with Clerk
- [ ] CI/CD hook — auto-explain failed builds via `POST /api/explain`
- [ ] Confidence scoring — warn when no strong internal match found
- [ ] Multi-team workspace UI

---

## 🛠️ Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack in one repo, easy Vercel deploy |
| Vector DB | Supabase pgvector | Free tier, no extra service to manage |
| Embeddings | OpenAI text-embedding-3-small | Cheap and high quality |
| LLM | GPT-4o-mini | Fast and cost-efficient for structured output |
| RAG | LangChain.js | Handles chunking, retrieval, prompt templating |
| Auth (planned) | Clerk | Drop-in multi-tenant auth |
| Styling | Tailwind CSS | Utility-first, fast to iterate |

---

## 🤝 Contributing

PRs are welcome. For major changes open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT © [Tasnia Ahmed](https://github.com/tasnia25ahmed)

---

<div align="center">
  <sub>Built as a student project · Part of an AI SaaS learning series</sub>
</div>