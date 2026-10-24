# InterviewOS — Engineering Standards & Development Policies

This document establishes the mandatory engineering standards, security rules, Git workflow, and performance practices for the **InterviewOS** project.

---

## 1. Security & Credentials Policy (Zero-Tolerance)

### 1.1 Strict Environment Variable Isolation
1. **No Hardcoded Secrets:** Under no circumstance may any secret, API token, password, or private key appear in source code, configuration files, Git commit history, or documentation.
2. **Environment Variable Naming Standard:**
   - `FISH_AUDIO_API_KEY`: API key for Fish Audio Text-to-Speech.
   - `FISH_AUDIO_MODEL`: Fish Audio model identifier (must be configured to `s2.1-pro-free`).
   - `FISH_AUDIO_BASE_URL`: Base API endpoint (configured to `https://api.fish.audio/v1/tts`).
   - `SARVAM_API_KEY`: API authentication key for Sarvam AI STT.
   - `GEMINI_API_KEY`: Google AI Studio API key.
   - `DATABASE_URL`: PostgreSQL connection string (e.g. `postgresql+asyncpg://user:pass@host:5432/interviewos`).
   - `REDIS_URL`: Redis connection string or `memory://` for local fallback.
   - `RAZORPAY_KEY_ID`: Public key for Razorpay checkout.
   - `RAZORPAY_KEY_SECRET`: Secret key for Razorpay signature verification (backend only).
   - `NEXTAUTH_SECRET`: Secret for signing frontend session tokens.
   - `SENTRY_DSN`: Sentry project DSN for error telemetry.
3. **Backend-Only Vendor Routing:**
   - All interactions with Fish Audio TTS, Sarvam AI, and Gemini API **must originate exclusively from the FastAPI backend**.
   - The Next.js frontend client must never hold or transmit vendor API keys.
4. **Git Credential Auditing:**
   - A `.gitignore` must enforce exclusion of all `.env`, `.env.*` (except `.env.example`), `*.pem`, `*.key`, and secret files.
   - Any credential accidentally leaked or pasted must be immediately revoked and rotated; never reuse a compromised key.

---

## 2. Low-RAM Development Guidelines (Intel MacBook 8 GB RAM)

To preserve system responsiveness and avoid memory exhaustion on an older Intel Mac:

1. **Docker is Optional, Not Mandatory:**
   - Do **NOT** mandate Docker for daily local development. Docker Desktop on macOS utilizes an emulation hypervisor consuming 3–4 GB of base RAM.
   - Run the backend directly in Python virtual environment (`python -m venv venv`).
   - Run the frontend via Node.js natively (`npm run dev`).
2. **Database Execution Options:**
   - Option A (Native): Homebrew PostgreSQL (`brew install postgresql@15 && brew services start postgresql@15`). Consumes < 60 MB RAM.
   - Option B (Remote Serverless): Free-tier Neon or Supabase cloud instance. Consumes 0 MB local RAM.
3. **Redis Execution Options:**
   - Option A: Native Homebrew Redis service.
   - Option B: Use the built-in in-memory fallback during local development.
4. **Process Monitoring:**
   - Check local memory usage with `scripts/check_memory.sh` or standard macOS Activity Monitor.
   - Never run unnecessary heavy background daemon watchers simultaneously.

---

## 3. Code Quality & Formatting Standards

### 3.1 Backend (Python 3.11+)
- **Linter & Formatter:** Use `ruff` for ultra-fast linting and formatting.
- **Type Checking:** All function signatures and module boundaries must have strict Python type hints verified with `mypy`.
- **Data Modeling:** All request/response payloads must be modeled with `pydantic.BaseModel` (v2).
- **Asynchronous Execution:** Async endpoints must never execute blocking I/O calls (use `httpx.AsyncClient` instead of `requests`; use `asyncio.to_thread` for unavoidable CPU-heavy routines).

### 3.2 Frontend (TypeScript & Next.js)
- **Language Mode:** Strict TypeScript (`strict: true` in `tsconfig.json`). No `any` types permitted in production code without documented exception.
- **Component Architecture:** Distinguish clearly between React Server Components (RSC) for data fetching and Client Components (`"use client"`) for interactive voice and editor state.
- **Styling:** Use Tailwind CSS utility classes and shadcn/ui components. Avoid custom ad-hoc CSS stylesheets when utilities suffice.

---

## 4. Git Workflow & Commit Rules

1. **Phase Isolation:**
   - Development follows the 13-phase roadmap strictly.
   - Never proceed to the next phase without explicit approval.
2. **Conventional Commits:**
   All commits must adhere to the Conventional Commits specification:
   - `docs: <description>` (documentation updates)
   - `feat(<scope>): <description>` (new features)
   - `fix(<scope>): <description>` (bug fixes)
   - `test(<scope>): <description>` (adding or modifying tests)
   - `refactor(<scope>): <description>` (code adjustments without behavioral changes)
   - `chore(<scope>): <description>` (tooling, dependencies, repository maintenance)
3. **Phase Checkpoint Rule:**
   Every phase concludes with:
   - Automated tests executed and passing.
   - Documentation updated reflecting current architecture and phase tracker.
   - A single clean checkpoint commit pushed to GitHub.

---

## 5. Testing Philosophy

| Test Level | Framework | Purpose |
| :--- | :--- | :--- |
| **Backend Unit Tests** | `pytest`, `pytest-asyncio` | Service logic, rubric math, parsing utilities |
| **Backend Integration Tests**| `httpx.AsyncClient` | Endpoint request/response verification with test DB |
| **Frontend Unit Tests** | `vitest`, `react-testing-library` | Component rendering, state transitions, audio context |
| **End-to-End Tests** | `playwright` | Full user journeys (login, interview session, report) |
