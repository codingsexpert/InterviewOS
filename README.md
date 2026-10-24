# InterviewOS

> **Production-Oriented AI Mock Interview SaaS Platform**  
> Based on Project 07 from the *"11 Full-Stack AI Portfolio Projects"* reference architecture.

---

## 🚀 Overview

**InterviewOS** is an intelligent, real-time mock interview platform designed to simulate high-fidelity technical and behavioral interviews. Combining adaptive conversational AI with ultra-low-latency voice synthesis and recognition, InterviewOS helps candidates prepare for real-world hiring rounds with tailored questions, real-time follow-ups, and rubric-based feedback.

### Key Capabilities
- **Google OAuth & User Profiles:** Secure authentication and quota-backed user accounts.
- **Resume & Job Description Parsing:** PDF extraction and semantic skill matching.
- **Dynamic Question Generation:** Gemini-powered personalized interview blueprints.
- **Ultra-Low Latency Voice Pipeline:** Seamless candidate microphone streaming via Sarvam AI STT, LangGraph conversational agent with Gemini, and Fish Audio TTS playback.
- **Adaptive Follow-up Engine:** Multi-turn dialogue evaluation that probes deeper based on candidate responses.
- **Comprehensive Rubric Evaluation:** Multi-dimensional scoring (technical accuracy, communication, structure, confidence) with actionable growth plans.
- **Coding Interview Sandbox:** Integrated live code editor and evaluation runtime.
- **Subscriptions & Quotas:** Tiered access via Razorpay billing.
- **Recruiter Mode:** Assessment generation and candidate benchmark reports.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0 (Async), Alembic |
| **Database & Cache** | PostgreSQL, Redis (Optional in local mode via in-memory fallback) |
| **AI Orchestration** | Google Gemini API (`gemini-1.5-pro` / `gemini-1.5-flash`), LangGraph, LangSmith |
| **Voice Processing** | **STT:** Sarvam AI Speech-to-Text<br>**TTS:** Fish Audio TTS (`s2.1-pro-free` via `https://api.fish.audio/v1/tts`) |
| **Storage & Media** | S3-compatible Object Storage (MinIO / AWS S3 / Cloudflare R2) |
| **Payments** | Razorpay Payment Gateway |
| **Observability** | Sentry, LangSmith Tracing, Structured JSON Logging |

---

## 💻 Hardware & Local Development Principles

- **Target Development Machine:** Intel MacBook (8 GB RAM).
- **Zero Heavy Docker Dependency:** Docker is **strictly optional**. All local development can be run natively using standard Python virtual environments (`venv`) and Node.js (`npm` or `pnpm`), paired with local or lightweight managed PostgreSQL/Redis services (e.g. Homebrew services, Supabase, Neon, or Upstash).
- **Resource Efficiency:** Asynchronous I/O, streaming responses, and connection pooling to keep RAM consumption below 1.5 GB for the entire local dev stack.

---

## 🔒 Security & Secrets Management

- **Zero Hardcoded Secrets:** All credentials, tokens, and API endpoints are loaded strictly via environment variables.
- **Fish Audio Backend Isolation:** All Fish Audio TTS operations originate exclusively from the backend service. No frontend client ever receives or communicates directly with the Fish Audio API.
- **Critical Environment Variables:**
  - `FISH_AUDIO_API_KEY`: API key for Fish Audio TTS service (backend only).
  - `FISH_AUDIO_MODEL`: Target model identifier (`s2.1-pro-free`).
  - `FISH_AUDIO_BASE_URL`: API endpoint (`https://api.fish.audio/v1/tts`).
  - `SARVAM_API_KEY`: API key for Sarvam AI STT.
  - `GEMINI_API_KEY`: Google Gemini API key.
  - `DATABASE_URL`: PostgreSQL connection string (asyncpg).
  - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Razorpay credentials.

---

## 📂 Project Structure

```text
interview-os/
├── .github/
│   └── workflows/              # CI/CD pipelines
├── backend/                    # FastAPI application (Phase 01+)
├── frontend/                   # Next.js App Router application (Phase 01+)
├── docs/                       # Architecture, database schema, standards, and roadmaps
│   ├── architecture.md         # System architecture & Mermaid diagrams
│   ├── database-design.md      # Complete PostgreSQL schema design & ER diagrams
│   ├── tech-stack.md           # Deep dive into technology choices & rationales
│   ├── development-roadmap.md  # 13-phase roadmap from setup to production
│   ├── engineering-standards.md# Code quality, security, and low-RAM dev guidelines
│   └── phase-tracker.md        # Real-time tracking of implementation phases
├── scripts/                    # Development, migration, and automation scripts
├── .gitignore                  # Git ignore rules for Python, Node, and secrets
└── README.md                   # Project overview and documentation
```

---

## 🗺️ Development Phases Summary

- **Phase 00:** Project Initialization & Architecture Design (COMPLETED)
- **Phase 01:** Full-Stack Foundation (Next.js, FastAPI, PostgreSQL, Alembic) (COMPLETED — see [docs/setup-guide.md](docs/setup-guide.md))
- **Phase 02:** Authentication & User Management (DEFERRED — Postponed per user request; database ready)
- **Phase 03:** Resume & Job Description Processing (COMPLETED — Working PDF extraction, JD processing, PostgreSQL persistence, and `/interview/setup` UI)
- **Phase 04:** Gemini Question Planning Engine (LOCKED — Next Phase)
- **Phase 05:** Voice Pipeline (Sarvam STT + Fish Audio TTS)
- **Phase 06:** Adaptive LangGraph Interviewer
- **Phase 07:** AI Rubric Evaluation Engine
- **Phase 08:** Reports & Progress Analytics Dashboard
- **Phase 09:** Razorpay Subscriptions & Usage Quotas
- **Phase 10:** Coding Interview Sandbox
- **Phase 11:** Recruiter Mode, Sentry & Observability
- **Phase 12:** Production Readiness, E2E Testing & Deployment

---

## 📄 License & Attribution

Designed and developed as part of **InterviewOS** for high-performance AI mock interviewing. All rights reserved.
