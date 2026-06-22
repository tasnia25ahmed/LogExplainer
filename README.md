# LogExplainer

AI-powered error log analysis for dev teams. Paste a stack trace, get a root cause explanation grounded in your team's own runbooks, postmortems, and internal docs — not generic Stack Overflow answers.

Built with Next.js, Supabase pgvector, LangChain, and OpenAI.

---

## What it does

- **Explain logs** — paste any error or stack trace and get a structured breakdown: what happened, why, and how to fix it
- **Grounded answers** — responses are sourced from your team's uploaded docs, not hallucinated
- **Knowledge base** — upload runbooks, postmortems, and internal docs as `.txt`, `.md`, or `.pdf`
- **Query history** — every explanation is saved and searchable at `/dashboard`
- **Source citations** — answers link back to which doc the answer came from

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend + API | Next.js 15 (App Router) |
| Vector database | Supabase pgvector |
| Embeddings | OpenAI `text-embedding-3-small` |
| LLM | OpenAI GPT-4o-mini (swappable) |
| RAG framework | LangChain.js |
| Styling | Tailwind CSS |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/your-username/logexplainer.git
cd logexplainer
npm install --legacy-peer-deps
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Settings → API** and copy your project URL and keys

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```bash
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

### Upload your docs
On the right panel, upload your team's runbooks, postmortems, or any internal troubleshooting doc. Supported formats: `.txt`, `.md`, `.pdf`.

Sample docs are included in `docs-sample/` to test with immediately.

### Explain a log
Paste any error log or stack trace into the left panel and hit **Explain this log**. The AI retrieves the most relevant chunks from your knowledge base and returns a structured explanation with sources cited.

### View history
Go to `/dashboard` to browse all past queries and the docs they matched against.

---

## Project structure

```
src/
├── app/
│   ├── _components/
│   │   ├── LogInput.tsx       # Log textarea + streaming answer UI
│   │   └── DocUploader.tsx    # Drag-and-drop file upload
│   ├── api/
│   │   ├── ingest/route.ts    # Chunks, embeds, and stores uploaded docs
│   │   └── explain/route.ts   # Retrieves context and streams LLM answer
│   ├── dashboard/page.tsx     # Query history view
│   ├── page.tsx               # Main UI
│   └── layout.tsx
├── lib/
│   ├── supabase.ts            # Supabase client (anon + admin)
│   ├── embeddings.ts          # OpenAI embedding calls
│   ├── chunker.ts             # Text splitting + PDF extraction
│   └── retrieval.ts           # Similarity search + log pre-processing
├── types/index.ts
supabase/
└── schema.sql                 # pgvector table, index, and match function
docs-sample/                   # Sample runbook and postmortem for testing
```

---

## Roadmap

- [ ] Slack bot — `/explain-log` slash command
- [ ] Claude LLM integration
- [ ] Team authentication with Clerk
- [ ] CI/CD hook — auto-explain failed build logs via `POST /api/explain`
- [ ] Confidence scoring — flag low-similarity matches
- [ ] Multi-team workspace support

---

## License

MIT
