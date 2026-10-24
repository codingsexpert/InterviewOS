# InterviewOS — 13-Phase Development Roadmap

This document outlines the systematic, phased execution plan for **InterviewOS**. 

> **Core Development Rule:**  
> Every phase must execute five sequential milestones:  
> **1. Implementation ➔ 2. Integration ➔ 3. Testing ➔ 4. Documentation ➔ 5. GitHub Commit & Push.**  
> **Never proceed to the next phase automatically.** Each phase requires explicit review and approval.

---

## Phase Overview Matrix

| Phase | Title | Primary Deliverable | Status |
| :---: | :--- | :--- | :---: |
| **00** | Architecture & Repo Init | Project structure, architecture, DB design, roadmap | **COMPLETED** |
| **01** | Full-Stack Foundation | Running Next.js, FastAPI, async PostgreSQL, Alembic | **COMPLETED** |
| **02** | Google OAuth & Users | User authentication, session management, profiles | **COMPLETED** |
| **03** | Resume & JD Processing | PDF parsing, skill extraction, role alignment | LOCKED |
| **04** | Gemini Question Planner | Dynamic question blueprints, difficulty calibrator | UPCOMING |
| **05** | Real-Time Voice Pipeline | Sarvam STT & Fish Audio TTS (`s2.1-pro-free`) integration | UPCOMING |
| **06** | Adaptive LangGraph Agent | Multi-turn interview graph, dynamic follow-up engine | UPCOMING |
| **07** | AI Rubric Evaluation | Multi-dimensional scoring (tech, comms, structure) | UPCOMING |
| **08** | Reports & Analytics | Candidate dashboard, progress tracking, 7-day plans | UPCOMING |
| **09** | Razorpay Subscriptions | Tiered plans, checkout flow, usage quotas | UPCOMING |
| **10** | Coding Interview Module | Live code sandbox, syntax highlighting, test execution | UPCOMING |
| **11** | Recruiter Mode & Telemetry | Recruiter views, candidate benchmarking, Sentry | UPCOMING |
| **12** | Production Testing & Deploy | E2E test suites, security audit, CI/CD, production deploy| UPCOMING |

---

## Detailed Phase Breakdown

### Phase 00 — Architecture and Repository Initialization *(Current Phase)*
- **Implementation:** Scaffold folder structure (`frontend/`, `backend/`, `docs/`, `scripts/`, `.github/workflows/`), `.gitignore`, `README.md`.
- **Integration:** Initialize Git version control; verify repository root.
- **Testing:** Verify zero secrets committed; validate document linkages.
- **Documentation:** Create architecture, database design, tech stack, roadmap, engineering standards, and phase tracker.
- **Git Commit:** `docs: initialize InterviewOS architecture and roadmap`.

---

### Phase 01 — Working Frontend, Backend & Database Foundation
- **Implementation:**
  - Initialize Next.js 14+ App Router with TypeScript, Tailwind CSS, and shadcn/ui.
  - Initialize FastAPI backend with Python 3.11+, Pydantic v2 settings, and CORS.
  - Setup async SQLAlchemy 2.0 with PostgreSQL and initialize Alembic.
  - Provide optional local in-memory/sqlite or cloud Postgres setup to protect 8 GB RAM Mac.
- **Integration:** Health check endpoints (`/api/health`), database connection verification.
- **Testing:** Backend unit test suite (`pytest`) and frontend smoke test.
- **Documentation:** `docs/setup-guide.md` with low-RAM local run steps.
- **Git Commit:** `feat(core): establish working frontend, backend, and database foundation`.

---

### Phase 02 — Google OAuth and User Management [DEFERRED]
> **Status:** Deferred / Postponed by user decision. Core database tables and auth foundations exist, but authentication is bypassed in local development mode to accelerate feature building. Must be completed before production release.

---

### Phase 03 — Resume and Job Description Processing [COMPLETED — 2026-10-24]
- **Implementation:**
  - PDF file upload UI (`/interview/setup`) with drag-and-drop, progress spinner, file validation.
  - Backend PDF parsing service (`pypdf`) with magic bytes validation (`%PDF-`), 5MB size limit, path traversal sanitization, and non-public disk storage.
  - Scanned/image-only PDF detection (`scanned_no_text` status) without hallucinating text.
  - Target job description normalization and word counting service.
  - PostgreSQL persistence (`resumes` and `job_descriptions` tables) with UUID identifiers via Alembic migration `0003_resumes_and_jobs`.
  - Phase 04 AI Question Planner handoff contract interface (`InterviewSetupContract`).
- **Integration:** End-to-end ingestion pipeline saving to PostgreSQL and displaying live preview in Next.js UI.
- **Testing:** 14 unit and integration tests covering valid uploads, corrupted headers, oversized files, scanned documents, encrypted files, and UUID retrieval (24/24 total backend tests passing).
- **Documentation:** Ingestion workflow, database specifications, and architectural data flow.
- **Git Commit:** `feat: implement resume and job description processing`.

---

### Phase 04 — Gemini Question Planner
- **Implementation:**
  - Interview blueprint generator using Gemini 1.5 Pro.
  - Question calibration based on resume experience vs. job description delta.
  - Question cataloging into `questions` table with evaluation rubrics.
- **Integration:** Pre-interview preparation screen displaying interview outline.
- **Testing:** Blueprint generation test cases across Junior, Mid, and Staff roles.
- **Documentation:** Question planning prompt templates and rubric criteria.
- **Git Commit:** `feat(ai): build personalized interview question planner`.

---

### Phase 05 — Sarvam STT and Fish Audio TTS
- **Implementation:**
  - Audio capture in browser via Web Audio API (16kHz mono).
  - WebSocket streaming handler in FastAPI.
  - Backend Sarvam AI STT integration for real-time transcription.
  - Backend Fish Audio TTS client calling `https://api.fish.audio/v1/tts` with model `s2.1-pro-free`.
  - Audio streaming response forwarder down to browser audio buffer.
- **Integration:** Full duplex audio roundtrip test.
- **Testing:** Latency benchmark, audio chunk validation, and error recovery on network drops.
- **Documentation:** Voice pipeline latency benchmarks and security configuration.
- **Git Commit:** `feat(voice): integrate Sarvam STT and Fish Audio TTS pipeline`.

---

### Phase 06 — Adaptive LangGraph Interviewer
- **Implementation:**
  - LangGraph conversational graph with dynamic nodes: Ingestion, Interviewer Turn, Candidate Turn, Evaluation Gate, Follow-up Prober, and Topic Advancer.
  - Interruption handling and silence detection.
  - Conversational memory management with LangSmith tracing.
- **Integration:** Wire LangGraph state engine into the live WebSocket voice pipeline.
- **Testing:** Multi-turn simulation tests covering answer depth and clarification triggers.
- **Documentation:** LangGraph state graph documentation and node descriptions.
- **Git Commit:** `feat(agent): implement adaptive multi-turn LangGraph interviewer`.

---

### Phase 07 — AI Evaluation Engine
- **Implementation:**
  - Multi-dimensional scoring engine evaluating:
    1. Technical Competence
    2. Problem Solving & Structuring
    3. Communication & Articulation
    4. Delivery & Confidence
  - Individual question feedback and highlight generation.
  - 7-day personalized practice plan generator.
  - PostgreSQL `evaluation_reports` population.
- **Integration:** Trigger evaluation generation automatically upon interview conclusion.
- **Testing:** Synthetic interview evaluation assertions and score stability tests.
- **Documentation:** Evaluation rubric definitions and score calculation methods.
- **Git Commit:** `feat(eval): add comprehensive rubric evaluation and practice planner`.

---

### Phase 08 — Reports and Progress Analytics
- **Implementation:**
  - Dynamic interview report view with score visualizations and audio snippets.
  - Candidate history dashboard showing progression curves over time.
  - PDF report export generation.
- **Integration:** Frontend reports dashboard linked to backend report endpoints.
- **Testing:** Visual regression and responsive layout tests.
- **Documentation:** Analytics metric documentation.
- **Git Commit:** `feat(reports): build interview report view and analytics dashboard`.

---

### Phase 09 — Razorpay Subscriptions
- **Implementation:**
  - Razorpay checkout integration on frontend.
  - Backend Razorpay subscription lifecycle and webhook handler (signature verification).
  - Database `subscriptions`, `payments`, and `usage_records` tracking.
  - Quota enforcement middleware (limiting free users to allocated sessions).
- **Integration:** End-to-end payment sandbox flow from checkout to quota upgrade.
- **Testing:** Webhook idempotency tests, payment success, and failure handling.
- **Documentation:** Billing architecture and webhook specifications.
- **Git Commit:** `feat(billing): integrate Razorpay subscriptions and quota gating`.

---

### Phase 10 — Coding Interview Module
- **Implementation:**
  - Integrated Monaco / CodeMirror editor within the interview interface.
  - Real-time code sync over WebSockets.
  - Sandboxed code execution runner (supporting Python, JavaScript/TypeScript).
  - Voice interviewer commenting on code structure and algorithmic complexity.
- **Integration:** Dual voice + coding interactive session mode.
- **Testing:** Execution security tests, timeout protection, and testcase verification.
- **Documentation:** Coding sandbox security and runtime specs.
- **Git Commit:** `feat(code): implement live coding interview sandbox`.

---

### Phase 11 — Industry Features and Observability
- **Implementation:**
  - Recruiter Mode: shareable candidate scorecard and interview replay.
  - Sentry APM integration across Next.js and FastAPI.
  - LangSmith tracing production setup for LLM cost and latency monitoring.
  - Structured audit logging.
- **Integration:** Production observability dashboards.
- **Testing:** Error injection tests to verify Sentry capture.
- **Documentation:** Operations and observability manual.
- **Git Commit:** `feat(ops): add recruiter mode, Sentry observability, and LangSmith tracing`.

---

### Phase 12 — Production Testing and Deployment
- **Implementation:**
  - Complete Playwright E2E test suite covering full user journey.
  - Production Dockerfiles (for cloud deployment, keeping local dev lightweight).
  - GitHub Actions CI/CD workflows for linting, testing, and deployment to Cloud Run / Vercel.
  - Security hardening (CSP headers, rate limiting, CORS restrictions).
- **Integration:** Staging and production environment deployment.
- **Testing:** Full regression, load testing, and security vulnerability scan.
- **Documentation:** Deployment runbook and disaster recovery procedures.
- **Git Commit:** `chore(deploy): configure CI/CD and finalize production readiness`.
