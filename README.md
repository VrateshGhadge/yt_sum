# YouTube Transcript Backend

A backend service that accepts a **YouTube video URL** and returns a **clean transcript** using a **fallback-based, production-style design**.

The system first tries to fetch YouTube captions and falls back to **audio-based transcription (Whisper)** when captions are unavailable.

---

## What This Project Does

- Accepts a YouTube URL
- Tries to fetch captions from YouTube
- Falls back to Whisper transcription if captions fail
- Returns sanitized transcript text
- Designed to later support AI summarization

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
→ Whisper (fallback)
→ Clean transcript → Response

```

---

## Features

- JWT authentication
- Protected API routes
- Rate limiting
- Centralized error handling
- Cost-aware fallback design

---

## ech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT, bcrypt
- youtube-transcript
- OpenAI Whisper (fallback)
- yt-dlp, ffmpeg

---

## Note on Whisper

Whisper requires OpenAI billing.

- Integration is implemented
- Local testing may be blocked without billing
- Design is production-ready

---

## What This Project Shows

- Clean backend architecture
- Fallback handling for unreliable APIs
- Secure and scalable backend design
- Real-world development practices

---
