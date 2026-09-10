# YouTube Transcript Backend

A backend service that accepts a **YouTube video URL** and returns a **clean transcript** with **free AI summaries** — no OpenAI, no billing.

The system fetches YouTube captions (free, keyless) and summarizes them using **OpenRouter `:free` models**, so the entire pipeline costs \$0.

---

## What This Project Does

- Accepts a YouTube URL
- Fetches captions from YouTube
- Returns sanitized transcript text
- Generates AI summaries via OpenRouter free models (4 modes)
- Answers questions about a video with timestamp citations
- Generates study notes and quizzes
- Stores per-user video history

---

## Local Setup

Prerequisites: **Node.js 20+**, **Docker** (or OrbStack), a free **Clerk** account, and a free **OpenRouter** API key.

### 1. Start MongoDB

The database is declared in `compose.yaml`, so no manual container setup is needed:

```bash
docker compose up -d      # start
docker compose ps         # check status (wait for "healthy")
docker compose down       # stop (data persists in the ytsum-mongo-data volume)
```

Data lives in the named volume `ytsum-mongo-data`, so it survives `down`/`up`. To wipe it and start fresh: `docker compose down -v`.

### 2. Configure the backend

```bash
cd backend
npm install
cp .env.example .env.local     # then fill in your keys
```

Required values (see `backend/.env.example` for the full list):

| Variable | Where to get it |
|---|---|
| `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | [dashboard.clerk.com](https://dashboard.clerk.com) → API Keys |
| `OPENROUTER_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) (free, no card) |
| `MONGO_URL` | `mongodb://127.0.0.1:27017/ytsum` (matches `compose.yaml`) |

### 3. Configure the frontend

```bash
cd frontend
npm install
cp .env.example .env.local
```

Set `VITE_CLERK_PUBLISHABLE_KEY` to the **same Clerk instance** as the backend — if they differ, every API request returns 401.

### 4. Run both servers

```bash
cd backend  && node src/index.js    # http://localhost:3000
cd frontend && npm run dev          # http://localhost:5173
```

Open http://localhost:5173 and sign in.

---

## Why This Project?

YouTube captions are unreliable for programmatic access.  
This project demonstrates how real-world backends handle API failures** using fallback strategies**.

---

## Architecture

```

Routes → Controllers → Services → Utils / Models

```

- Controllers handle request/response
- Services handle business logic & external APIs
- Middleware handles auth, rate limiting, and errors

---

## Transcript Flow

```

Request → Auth → Transcript Service
→ YouTube captions
→ Clean transcript → AI summary (OpenRouter free) → Response

```

---

## Features

- Clerk session authentication
- Protected API routes (JSON 401 for API clients)
- Rate limiting
- Centralized error handling
- Free AI summaries via OpenRouter `:free` models (zero spend) — 4 modes (`concise`, `detailed`, `bullets`, `keypoints`)
- Timestamped transcript + video player sync
- Q&A grounded in the transcript, with citations
- Notes and quiz generation
- Per-user video history (`GET /api/history`, `GET/DELETE /api/history/:id`)

---

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose (local via Docker Compose)
- Clerk, @clerk/express
- youtube-transcript-plus
- OpenRouter (free models)
- React 18, Vite, TypeScript, Tailwind (frontend)

---

## API Endpoints

All routes require a Clerk session token: `Authorization: Bearer <token>`.

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/transcript` | `{ youtubeUrl }` | clean transcript text |
| POST | `/api/summary` | `{ youtubeUrl, mode?, includeTranscript? }` | summary (+ transcript/timestamps) and saves to history |
| POST | `/api/ask` | `{ question, videoId \| youtubeUrl }` | answer + timestamped citations |
| POST | `/api/notes` | `{ videoId \| youtubeUrl }` | bullet study notes |
| POST | `/api/quiz` | `{ videoId \| youtubeUrl, questionCount? }` | multiple-choice questions |
| GET | `/api/history` | — | the user's saved analyses (newest first) |
| GET | `/api/history/:id` | — | full record incl. transcript + segments |
| DELETE | `/api/history/:id` | — | delete an owned record |

---

## Note on AI Costs

All AI calls go to **OpenRouter `:free` models** — no OpenAI, no credit card, $0 spend.

- Free models have per-IP rate limits (daily caps) and occasional 429s; the API returns a friendly retry message when that happens
- The model is configurable via `AI_MODEL` in `.env.local` (default: `nvidia/nemotron-3.5-lightning:free`)
- Falling back to the `openrouter/free` auto-router happens automatically on rate limits

---

## What This Project Shows

- Clean backend architecture
- Fallback handling for unreliable APIs
- Secure and scalable backend design
- Real-world development practices

---
