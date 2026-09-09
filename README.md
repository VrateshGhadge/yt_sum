# YouTube Transcript Backend

A backend service that accepts a **YouTube video URL** and returns a **clean transcript** with **free AI summaries** — no OpenAI, no billing.

The system fetches YouTube captions (free, keyless) and summarizes them using **OpenRouter `:free` models**, so the entire pipeline costs \$0.

---

## What This Project Does

- Accepts a YouTube URL
- Fetches captions from YouTube
- Returns sanitized transcript text
- Generates AI summaries via OpenRouter free models
- Designed to later support summary modes, Q&A, notes/quiz, and video history

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
- Protected API routes
- Rate limiting
- Centralized error handling
- Free AI summaries via OpenRouter `:free` models (zero spend)

---

## ech Stack

- Node.js, Express
- MongoDB, Mongoose
- Clerk, @clerk/express
- youtube-transcript
- OpenRouter (free models)

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
