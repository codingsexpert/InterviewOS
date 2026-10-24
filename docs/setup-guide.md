# InterviewOS — Local Development & Setup Guide

This guide describes how to run both the **FastAPI Backend** and the **Next.js Frontend** locally on your machine (optimized for macOS on an Intel MacBook with 8 GB RAM without requiring Docker).

---

## 1. Prerequisites
- **Node.js:** v18+ (tested on Node v22.23.0)
- **Python:** 3.11+ (tested on Python 3.13.14)
- **PostgreSQL Database:** PostgreSQL 15+ (local Homebrew or remote cloud instance such as Supabase / Neon)

---

## 2. Backend Setup (FastAPI)

### Step 2.1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2.2: Create and Activate Python Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 2.3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2.4: Configure Environment Variables
Copy the template configuration:
```bash
cp .env.example .env
```
Edit `.env` and set your `DATABASE_URL`:
```env
DATABASE_URL=postgresql+asyncpg://<username>:<password>@<host>:<port>/<dbname>
```
*(Note: URLs starting with `postgres://` or `postgresql://` are automatically normalized by Pydantic to use the `postgresql+asyncpg://` driver).*

### Step 2.5: Run Database Migrations
```bash
alembic upgrade head
```

### Step 2.6: Run Automated Backend Tests
```bash
pytest tests -v
```

### Step 2.7: Start Backend Server
```bash
uvicorn app.main:app --reload --port 8000 --host 127.0.0.1
```
The API is now accessible at:
- **Health Check:** [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
- **Database Readiness:** [http://127.0.0.1:8000/api/v1/health/db](http://127.0.0.1:8000/api/v1/health/db)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 3. Frontend Setup (Next.js)

### Step 3.1: Navigate to Frontend Directory
In a new terminal window:
```bash
cd frontend
```

### Step 3.2: Install NPM Dependencies
```bash
npm install
```

### Step 3.3: Configure Environment Variables
```bash
cp .env.example .env.local
```
Ensure `NEXT_PUBLIC_API_URL` points to your backend instance:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 3.4: Verify Production Build & Linting
```bash
npm run lint
npm run build
```

### Step 3.5: Start Frontend Development Server
```bash
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000). The live `ApiStatusIndicator` in the top navbar will probe `http://localhost:8000/api/v1/health` and display real-time latency and status.

---

## 4. Current Status vs Future Functionality

| Capability | Current Status (Phase 01) | Next Planned Phase |
| :--- | :---: | :---: |
| Next.js Landing Page | **Implemented & Live** | Phase 01 |
| FastAPI REST API & OpenAPI | **Implemented & Live** | Phase 01 |
| PostgreSQL 15+ & Alembic | **Implemented & Live** | Phase 01 |
| Live API Status Indicator | **Implemented & Live** | Phase 01 |
| Automated Health Tests | **Implemented & Live (4 passing)**| Phase 01 |
| Google OAuth Authentication | Planned | Phase 02 |
| Resume & Job Description Parser | Planned | Phase 03 |
| Gemini Question Planner | Planned | Phase 04 |
| Sarvam STT & Fish Audio TTS | Planned | Phase 05 |
| LangGraph Conversational Agent | Planned | Phase 06 |
| AI Rubric Evaluation Engine | Planned | Phase 07 |
| Progress Analytics & Reports | Planned | Phase 08 |
| Razorpay Subscriptions | Planned | Phase 09 |
| Live Coding Sandbox | Planned | Phase 10 |
