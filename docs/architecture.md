# InterviewOS — System Architecture

This document defines the high-level and detailed architecture for **InterviewOS**, an enterprise-grade AI mock interview platform featuring real-time conversational voice synthesis and adaptive question orchestration.

---

## 1. High-Level System Architecture

InterviewOS operates as a decoupled client-server architecture:
- **Client (Frontend):** Next.js App Router with TypeScript, Tailwind CSS, and shadcn/ui. Handles audio recording (MediaRecorder API / AudioWorklet), audio streaming playback, real-time code editor, and responsive analytical dashboards.
- **Server (Backend):** Python FastAPI application providing asynchronous REST endpoints and WebSockets for low-latency bidirectional voice and state interaction.
- **Data & Caching:** PostgreSQL for persistent relational storage with async SQLAlchemy and Alembic; Redis for fast session caches, rate limiting, and temporary audio buffer management (with in-memory fallback for lightweight local dev).
- **AI & Voice Services:**
  - **Sarvam AI STT:** Converts streaming audio input from the candidate into low-latency text transcripts.
  - **LangGraph & Gemini API:** State machine managing multi-turn interview flow, persona tracking, adaptive follow-ups, and question branching.
  - **Fish Audio TTS:** Synthesizes natural, low-latency speech from AI text using model `s2.1-pro-free` via backend-secured endpoint.

```mermaid
flowchart TB
    subgraph Client["Client Layer (Next.js 14+ App Router)"]
        UI["shadcn/ui Dashboard & Interview View"]
        AudioIn["Microphone Capture (Web Audio / MediaRecorder)"]
        AudioOut["Audio Playback Context (Streaming Buffer)"]
        CodeEditor["Live Code Editor Sandbox"]
    end

    subgraph Backend["API Layer (FastAPI Asynchronous Backend)"]
        FastAPI["FastAPI Gateway / Router"]
        WSHandler["WebSocket Audio & State Handler"]
        AuthMiddleware["OAuth & Session Middleware"]
        LangGraphRuntime["LangGraph Interview Runtime Engine"]
        StorageService["S3 Storage Manager (PDFs & Audio)"]
        BillingService["Razorpay Subscription Service"]
    end

    subgraph Data["Data & Persistence Layer"]
        PG[("PostgreSQL Database")]
        RedisCache[("Redis Session & Rate Limit Store")]
        S3Bucket[("S3 / R2 Object Storage")]
    end

    subgraph ExternalAI["External AI & Voice Cloud Infrastructure"]
        Sarvam["Sarvam AI (Speech-to-Text)"]
        Gemini["Google Gemini 1.5 Pro / Flash"]
        FishAudio["Fish Audio TTS (s2.1-pro-free)"]
        RazorpayGateway["Razorpay Payment Gateway"]
        LangSmithTracing["LangSmith Observability"]
    end

    %% Client to Backend
    UI <-->|HTTPS / REST API| FastAPI
    AudioIn -->|WebSocket: Audio Chunks / PCM| WSHandler
    WSHandler -->|WebSocket: Synthesized Audio Stream| AudioOut
    CodeEditor <-->|REST / WS| FastAPI

    %% Backend internal
    FastAPI --> AuthMiddleware
    WSHandler <--> LangGraphRuntime
    FastAPI --> StorageService
    FastAPI --> BillingService

    %% Backend to Persistence
    FastAPI <-->|SQLAlchemy AsyncPG| PG
    WSHandler <-->|Redis Cache| RedisCache
    StorageService <-->|Boto3 / aioboto3| S3Bucket

    %% Backend to External
    WSHandler -->|Audio Stream| Sarvam
    Sarvam -->|Candidate Transcript| LangGraphRuntime
    LangGraphRuntime <-->|Prompts & Structured Outputs| Gemini
    LangGraphRuntime -->|Assistant Speech Text| FishAudio
    FishAudio -->|Audio Chunks| WSHandler
    BillingService <-->|Webhooks & Orders| RazorpayGateway
    LangGraphRuntime -.->|Telemetry| LangSmithTracing
```

---

## 2. Voice Pipeline Architecture

The real-time voice pipeline provides conversational latency with adaptive turn-taking and graceful interruption handling. All external vendor traffic flows strictly through the backend to protect API keys.

### Voice Flow Sequence:
1. **Microphone Capture:** Candidate speaks; frontend captures audio using standard Web Audio API / MediaStream at 16kHz mono.
2. **Streaming Ingestion:** Audio packets are sent over a persistent WebSocket connection to the backend.
3. **STT Processing:** Backend streams audio bytes to **Sarvam AI STT API**, returning incremental candidate transcripts.
4. **Adaptive Orchestration:** When speech endpointing detects completion, the final transcript is dispatched to the **LangGraph Interview Agent**.
5. **LLM Inference:** LangGraph executes the current interview step, feeding conversation history and rubric context to **Gemini 1.5**.
6. **TTS Synthesis:** Gemini's generated response tokens or sentences are streamed directly to **Fish Audio TTS API** (`https://api.fish.audio/v1/tts`) using model `s2.1-pro-free`.
7. **Audio Streaming Playback:** Fish Audio returns synthesized audio stream bytes, forwarded via WebSocket down to the candidate browser for continuous gapless playback.

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as Candidate
    participant Browser as Browser Audio Context
    participant WS as FastAPI WebSocket
    participant Sarvam as Sarvam AI (STT)
    participant Agent as LangGraph Agent (State Machine)
    participant Gemini as Google Gemini API
    participant Fish as Fish Audio TTS (s2.1-pro-free)

    Candidate->>Browser: Speaks response
    Browser->>WS: Stream Audio Binary Chunks (PCM / WebM)
    WS->>Sarvam: Forward audio stream for transcription
    Sarvam-->>WS: Return transcribed candidate text
    WS->>Agent: Candidate Turn (Transcript + Session State)
    
    Agent->>Gemini: Evaluate response + generate follow-up question
    Gemini-->>Agent: AI Response Text (Conversational interviewer reply)
    
    Agent->>Fish: POST /v1/tts (Text, model: s2.1-pro-free, auth header)
    Fish-->>WS: Return synthesized audio stream (MP3/Opus/WAV)
    WS-->>Browser: Stream binary audio packets
    Browser-->>Candidate: Seamless audio playback
```

---

## 3. LangGraph Adaptive Interview State Machine

The conversational flow is modeled as a state graph with nodes for each phase of an interview. This architecture enables dynamic branching, clarifying questions, and deep-dive technical follow-ups.

```mermaid
stateDiagram-v2
    [*] --> InitializeSession: Candidate starts interview
    
    InitializeSession --> IntroduceInterviewer: Load Blueprint, Resume & Job Description
    IntroduceInterviewer --> AwaitCandidateResponse: Play intro via Fish Audio
    
    AwaitCandidateResponse --> TranscribeInput: Audio received via Sarvam STT
    TranscribeInput --> AnalyzeAnswer: LangGraph state update
    
    state AnalyzeAnswer {
        [*] --> CheckCompleteness
        CheckCompleteness --> NeedsClarification: Answer too brief or ambiguous
        CheckCompleteness --> FollowUpEligible: Solid answer; explore depth
        CheckCompleteness --> NextQuestionReady: Thorough answer; advance topic
    }
    
    NeedsClarification --> GenerateFollowUp: Ask targeted probing question
    FollowUpEligible --> GenerateFollowUp: Drill down into architectural details
    GenerateFollowUp --> StreamSpeech: Synthesize voice via Fish Audio
    StreamSpeech --> AwaitCandidateResponse: Candidate responds
    
    NextQuestionReady --> CheckInterviewProgress: Check time & question quota
    CheckInterviewProgress --> TransitionNextTopic: Topics remaining
    TransitionNextTopic --> StreamSpeech
    
    CheckInterviewProgress --> ConcludeInterview: All blueprint topics covered
    ConcludeInterview --> GenerateEvaluationReport: Trigger Gemini rubric evaluator
    GenerateEvaluationReport --> StoreReport: Save to PostgreSQL
    StoreReport --> [*]: Display report in UI
```

---

## 4. End-to-End Data Ingestion & Question Planning Flow

Prior to the voice interview, InterviewOS processes the candidate's resume and target job description to create an interview blueprint.

```mermaid
flowchart LR
    subgraph Ingestion["1. Ingestion Phase"]
        PDF["Candidate Resume (PDF)"] --> PDFExtract["pypdf / pdfplumber Extraction"]
        JD["Job Description Text"] --> CleanJD["Text Normalization"]
    end

    subgraph Analysis["2. Semantic Extraction"]
        PDFExtract --> SkillGraph["Gemini Skills & Experience Parser"]
        CleanJD --> ReqMatrix["Gemini Role Requirements Parser"]
    end

    subgraph Blueprint["3. Blueprint Generation"]
        SkillGraph & ReqMatrix --> MatchEngine["Gap Analysis & Matching Engine"]
        MatchEngine --> BlueprintGen["Gemini Question Planner"]
        BlueprintGen --> PlannedQuestions["Tailored Interview Blueprint\n(Core, Behavioral, Technical & System Design)"]
    end

    subgraph Persistence["4. Storage"]
        PlannedQuestions --> DB[("PostgreSQL DB (Interviews & Questions)")]
    end
```

---

## 5. Architectural Considerations for 8 GB RAM Development

To guarantee smooth local development on an older Intel MacBook with 8 GB RAM, the following architectural choices are applied:

1. **Lightweight Monorepo / Decoupled Folders:** Frontend (`frontend/`) and Backend (`backend/`) exist in the same repository but execute as distinct processes without requiring heavy Docker containers.
2. **Native Environment Support:**
   - Backend runs directly in Python `venv` using `uvicorn` with reload.
   - Frontend runs via Next.js dev server (`npm run dev` or `pnpm dev`).
   - PostgreSQL and Redis can be run natively via Homebrew services or lightweight managed cloud instances (e.g. Neon, Supabase, Upstash), completely bypassing Docker memory overhead.
3. **Async Streaming Architecture:** FastAPI leverages async event loops (`asyncio` and `httpx.AsyncClient`) for high concurrency without blocking system threads or ballooning memory.
4. **Buffer Flushing:** Audio chunks are streamed directly between WebSockets and third-party APIs without accumulating large in-memory buffers on the backend.
