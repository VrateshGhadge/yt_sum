# Summify

Paste a YouTube link, get something readable: a summary in four styles, a
timestamped transcript, answers to questions about the video, study notes and a
quiz. Every part of the pipeline is free and keyless — captions come from
YouTube, generation runs on OpenRouter's free tier, and no billing account is
required anywhere.


https://github.com/user-attachments/assets/bf087e7e-5c71-4918-ac20-fd228b1d4e7b
---







## Features

- **Four summary styles** — concise, detailed, bullets and key points, each with
  its own layout rather than one passage restyled four ways.
- **Timestamped transcript** grouped into ~30-second sections; clicking a line
  seeks the video.
- **Ask questions** about the video and get answers with the timestamps they
  came from.
- **Study notes** and a **multiple-choice quiz** with explanations and a score.
- **History** of everything you have summarized, reopenable and deletable.
- **Clerk session auth** on every API route.

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS v4 (no component library) |
| Backend | Node.js 20+, Express 5, Mongoose |
| Database | MongoDB (Docker Compose locally, Atlas when deployed) |
| Auth | Clerk (`@clerk/clerk-react`, `@clerk/express`) |
| Captions | YouTube, via `youtube-transcript-plus` |
| Generation | OpenRouter free-tier models |

The visual system is documented in [DESIGN.md](DESIGN.md) and the product scope in
[PRODUCT.md](PRODUCT.md). Design tokens live in `frontend/src/styles.css` as a
Tailwind `@theme` block; everything else is utilities in the markup.

---

## Architecture

```
frontend/                React app
  src/components/        landing/ (public page) + the workspace screens
  src/components/analysis/  summary, ask, notes, quiz panels
  src/hooks/             route + workspace state
  src/lib/               router, formatting, chapter and topic derivation
  src/styles.css         design tokens + the few rules that cannot be utilities

backend/                 Express API
  src/routes/            one file per endpoint group
  src/controllers/       request/response, error shaping
  src/services/          transcripts, AI, history
  src/middleware/        Clerk auth, rate limiting, error handler
  src/models/            Mongoose schemas
```

A request travels: **route → controller → service → (YouTube | OpenRouter) → model**.

---

## Getting started

Prerequisites: **Node.js 20+**, **Docker** (or OrbStack), a free **Clerk**
application, and a free **OpenRouter** API key.

### 1. Database

MongoDB is declared in `compose.yaml`, so there is no manual container setup:

```bash
docker compose up -d      # start
docker compose ps         # wait for "healthy"
docker compose down       # stop (data survives in the ytsum-mongo-data volume)
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env.local     # then fill in the keys
node src/index.js              # http://localhost:3000
```

| Variable | Value |
|---|---|
| `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `OPENROUTER_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) — free, no card |
| `MONGO_URL` | `mongodb://127.0.0.1:27017/ytsum` (matches `compose.yaml`) |

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev                    # http://localhost:5173
```

| Variable | Value |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | the **same Clerk instance** as the backend — different instances mean every request returns 401 |
| `VITE_API_BASE_URL` | `http://localhost:3000` locally |

`npm run build` typechecks and builds; `npm run lint` lints.

---

## API

All routes need a Clerk session token, `Authorization: Bearer <token>`, except
the health probe.

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/summary` | `{ youtubeUrl, mode?, includeTranscript? }` | summary (+ transcript segments) and saves to history |
| POST | `/api/ask` | `{ question, videoId \| youtubeUrl }` | answer + timestamped citations |
| POST | `/api/notes` | `{ videoId \| youtubeUrl }` | study notes |
| POST | `/api/quiz` | `{ videoId \| youtubeUrl, questionCount? }` | multiple-choice questions |
| POST | `/api/transcript` | `{ youtubeUrl }` | clean transcript text |
| GET | `/api/history` | — | the user's summaries, newest first |
| GET | `/api/history/:id` | — | full record including transcript and segments |
| DELETE | `/api/history/:id` | — | delete a record |
| GET | `/api/health` | `?video=<id>` optional | database state, and whether the host can read that video's captions |

`/api/health` exists because two things differ between a laptop and a server and
are invisible from the UI: whether the database is connected, and whether the
host is allowed to read YouTube captions. It returns no user data.

---

## Deployment

Deployed as three pieces: the frontend on **Netlify**, the API on **Render**, and
the database on **MongoDB Atlas**.

- Set `VITE_API_BASE_URL` in Netlify to the Render URL. It is inlined at build
  time, so changing it requires a redeploy, not just a restart.
- Set `CLIENT_ORIGIN` on Render to the frontend's origin, exactly, with no
  trailing slash — it is compared as a plain string.
- Give the backend `MONGO_URL`, `OPENROUTER_API_KEY`, the Clerk keys, and
  `APP_URL`.

### Known limitation: captions on the deployed API

YouTube refuses to serve caption data to datacentre addresses. From Render's
addresses the player response comes back without any caption tracks, so
**summarizing a new video fails on the deployed instance** while working
perfectly against a local backend. This was verified rather than assumed: two
Render regions, a forced-IPv4 route, the Android and web Innertube clients, and a
supplied Innertube key all give the same answer.

Everything that reads an already-stored transcript — history, ask, notes, quiz —
works on the deployment. To summarize new videos there, the backend needs to
reach YouTube from a residential address: run it locally behind a tunnel
(Cloudflare Tunnel is free), or put the caption read behind a residential proxy.

---

## Notes on the free tier

- Model calls go to OpenRouter's free tier, which has rate limits. The API
  answers with one plain sentence — *"Rate limit reached. Please try again in a
  few minutes."* — and never names a provider, a model or a quota in anything a
  visitor can read. The diagnostic detail (`limit`, `source`, `reset`) goes to
  the server log.
- `AI_MODEL` selects the model; `AI_FALLBACK_MODEL` is tried when the first is
  rate-limited. Both default to free models.
- Caption reads are cached in memory for 15 minutes per video, so switching
  summary styles does not re-download the transcript.
