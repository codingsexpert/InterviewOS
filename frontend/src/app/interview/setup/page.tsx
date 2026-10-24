"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Briefcase,
  Building,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Eye,
  FileCode,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface ResumeData {
  id: string;
  original_filename: string;
  file_size: number;
  page_count: number;
  word_count: number;
  processing_status: string;
  extracted_text_preview: string;
  extracted_text?: string;
  warning_message?: string | null;
  created_at: string;
}

interface JobDescriptionData {
  id: string;
  title: string;
  company_name?: string | null;
  description_text: string;
  word_count: number;
  created_at: string;
}

const SAMPLE_JOB_DESCRIPTION = {
  title: "Senior Full Stack Engineer",
  company_name: "Stripe",
  description_text: `We are looking for a Senior Full Stack Engineer to join our Core Platform team. 

Key Responsibilities:
- Architect and scale web applications using Next.js, React, TypeScript, and Python (FastAPI).
- Design resilient distributed backend microservices and PostgreSQL schemas.
- Build high-performance REST and WebSocket APIs with sub-100ms latency.
- Collaborate with infrastructure and AI engineers to deploy automated evaluation pipelines.

Required Qualifications:
- 5+ years of experience building modern full-stack web applications.
- Strong proficiency in modern JavaScript/TypeScript, React, Python, and SQL databases.
- Experience with Docker, cloud providers (AWS/GCP), and CI/CD pipelines.
- Solid understanding of distributed systems, concurrency, and security best practices.`,
};

export default function InterviewSetupPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Resume Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [showFullResumeText, setShowFullResumeText] = useState(false);
  const [copiedResume, setCopiedResume] = useState(false);

  // Job Description State
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [isSubmittingJD, setIsSubmittingJD] = useState(false);
  const [jobDescriptionData, setJobDescriptionData] = useState<JobDescriptionData | null>(null);
  const [jdError, setJdError] = useState<string | null>(null);
  const [copiedContract, setCopiedContract] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setResumeError(null);

    // Validate extension
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setResumeError("Invalid file format. Please upload a PDF document (.pdf).");
      return;
    }

    // Validate size (5MB max)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setResumeError(`File exceeds maximum upload limit of 5MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    if (file.size === 0) {
      setResumeError("Uploaded file is empty (0 bytes). Please upload a valid document.");
      return;
    }

    uploadResume(file);
  };

  const uploadResume = async (file: File) => {
    setIsUploadingResume(true);
    setResumeError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiUrl}/api/v1/resumes`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Upload failed with status ${response.status}`);
      }

      setResumeData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload and process PDF resume.";
      setResumeError(msg);
      setResumeData(null);
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleResetResume = () => {
    setResumeData(null);
    setResumeError(null);
    setShowFullResumeText(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Job Description handlers
  const handleFillSampleJD = () => {
    setJobTitle(SAMPLE_JOB_DESCRIPTION.title);
    setCompanyName(SAMPLE_JOB_DESCRIPTION.company_name);
    setJobDescriptionText(SAMPLE_JOB_DESCRIPTION.description_text);
    setJdError(null);
  };

  const handleSubmitJobDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setJdError(null);

    if (jobTitle.trim().length < 2) {
      setJdError("Job title must be at least 2 characters.");
      return;
    }

    if (jobDescriptionText.trim().length < 30) {
      setJdError("Job description must contain at least 30 characters of meaningful text.");
      return;
    }

    setIsSubmittingJD(true);

    try {
      const response = await fetch(`${apiUrl}/api/v1/job-descriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle.trim(),
          company_name: companyName.trim() || null,
          description_text: jobDescriptionText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Processing failed with status ${response.status}`);
      }

      setJobDescriptionData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process job description.";
      setJdError(msg);
    } finally {
      setIsSubmittingJD(false);
    }
  };

  const handleCopyText = (text: string, type: "resume" | "contract") => {
    navigator.clipboard.writeText(text);
    if (type === "resume") {
      setCopiedResume(true);
      setTimeout(() => setCopiedResume(false), 2000);
    } else {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    }
  };

  const isContractReady = resumeData && jobDescriptionData;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Phase 03 Active</span>
              <span className="text-neutral-400 dark:text-neutral-600">|</span>
              <span>Document Processing Engine</span>
            </div>

            <div className="text-xs font-mono text-neutral-500 bg-neutral-200/50 dark:bg-neutral-900/50 px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-800">
              Dev Mode: Safe Unauthenticated Workflow
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Interview Preparation & Document Alignment
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
            Upload your technical PDF resume and target job posting. Our backend validates document integrity,
            extracts digital text, and structures your profile for the Phase 04 AI Question Planner.
          </p>
        </div>

        {/* Phase 04 Ready Banner (when both are completed) */}
        {isContractReady && (
          <div className="mb-8 p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-white text-base">
                      Documents Processed & AI Contract Established
                    </h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                      Phase 04 Handoff Ready
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Both documents are stored in PostgreSQL with UUID identifiers. Phase 04 AI Question Planner will
                    synthesize candidate-role delta questions using these verified payloads.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() =>
                    handleCopyText(
                      JSON.stringify(
                        {
                          resume_id: resumeData.id,
                          job_description_id: jobDescriptionData.id,
                          job_title: jobDescriptionData.title,
                          company_name: jobDescriptionData.company_name,
                          readiness_status: "ready_for_planner",
                        },
                        null,
                        2
                      ),
                      "contract"
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedContract ? "Copied JSON" : "Copy Phase 04 Contract"}</span>
                </button>
              </div>
            </div>

            {/* Contract Identifiers Grid */}
            <div className="mt-4 pt-4 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white/40 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500 block mb-0.5">Resume ID</span>
                <span className="font-mono text-neutral-900 dark:text-white font-medium truncate block">
                  {resumeData.id}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/40 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500 block mb-0.5">Job Description ID</span>
                <span className="font-mono text-neutral-900 dark:text-white font-medium truncate block">
                  {jobDescriptionData.id}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/40 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500 block mb-0.5">Target Role</span>
                <span className="text-neutral-900 dark:text-white font-medium truncate block">
                  {jobDescriptionData.title} {jobDescriptionData.company_name ? `@ ${jobDescriptionData.company_name}` : ""}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/40 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500 block mb-0.5">Total Words Synthesized</span>
                <span className="text-neutral-900 dark:text-white font-medium block">
                  {resumeData.word_count + jobDescriptionData.word_count} words
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ============================================================== */}
          {/* STEP 1: RESUME PDF UPLOAD & EXTRACTION */}
          {/* ============================================================== */}
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                    Candidate Resume (PDF)
                  </h2>
                  <p className="text-xs text-neutral-500">Real PDF parsing & text extraction</p>
                </div>
              </div>

              {resumeData && (
                <button
                  onClick={handleResetResume}
                  className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace PDF</span>
                </button>
              )}
            </div>

            {/* Error Message */}
            {resumeError && (
              <div className="mb-4 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 text-xs flex items-start gap-2.5">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block mb-0.5">Resume Processing Error</span>
                  <span>{resumeError}</span>
                </div>
              </div>
            )}

            {/* Upload Zone (when no resume processed yet) */}
            {!resumeData && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[260px] ${
                  isDragging
                    ? "border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 scale-[0.99]"
                    : "border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50"
                } ${isUploadingResume ? "opacity-60 pointer-events-none" : ""}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,application/pdf"
                  className="hidden"
                  id="resume-file-input"
                />

                {isUploadingResume ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Extracting Resume Text...
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Verifying magic bytes, counting pages, and extracting text
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60 flex items-center justify-center text-neutral-600 dark:text-neutral-400 mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Drag & drop your PDF resume here
                    </p>
                    <p className="text-xs text-neutral-500 mt-1 mb-4">
                      or click to browse files from your computer
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-200 dark:bg-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                      <span>PDF Only</span>
                      <span>•</span>
                      <span>Max 5 MB</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Extracted Resume Details Card */}
            {resumeData && (
              <div className="space-y-4">
                {/* Meta stats */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCheck className="w-5 h-5 text-blue-500 shrink-0" />
                      <span className="font-semibold text-sm truncate">{resumeData.original_filename}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        resumeData.processing_status === "completed"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {resumeData.processing_status === "completed" ? "Extracted" : "Scanned Alert"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-neutral-500 block text-[10px] uppercase">Pages</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{resumeData.page_count}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-neutral-500 block text-[10px] uppercase">Words</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{resumeData.word_count}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-neutral-500 block text-[10px] uppercase">Size</span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {(resumeData.file_size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  </div>

                  {/* Warning message for scanned document */}
                  {resumeData.warning_message && (
                    <div className="mt-3 p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{resumeData.warning_message}</span>
                    </div>
                  )}
                </div>

                {/* Extracted Text Viewer */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-900 text-neutral-100">
                  <div className="px-3.5 py-2 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <FileCode className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-mono">Extracted Text Stream</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText(resumeData.extracted_text || "", "resume")}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      >
                        {copiedResume ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedResume ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        onClick={() => setShowFullResumeText(!showFullResumeText)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{showFullResumeText ? "Collapse" : "Expand"}</span>
                      </button>
                    </div>
                  </div>

                  <div
                    className={`p-4 text-xs font-mono leading-relaxed overflow-y-auto whitespace-pre-wrap select-text text-neutral-300 ${
                      showFullResumeText ? "max-h-[380px]" : "max-h-[160px]"
                    }`}
                  >
                    {resumeData.extracted_text || (
                      <span className="text-neutral-500 italic">No extractable text found in this PDF document.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* STEP 2: JOB DESCRIPTION INPUT & PROCESSING */}
          {/* ============================================================== */}
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                    Target Job Description
                  </h2>
                  <p className="text-xs text-neutral-500">Role specifications & required competencies</p>
                </div>
              </div>

              {!jobDescriptionData && (
                <button
                  type="button"
                  onClick={handleFillSampleJD}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use Sample JD</span>
                </button>
              )}

              {jobDescriptionData && (
                <button
                  onClick={() => setJobDescriptionData(null)}
                  className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Edit JD</span>
                </button>
              )}
            </div>

            {/* Error Message */}
            {jdError && (
              <div className="mb-4 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 text-xs flex items-start gap-2.5">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block mb-0.5">Job Description Error</span>
                  <span>{jdError}</span>
                </div>
              </div>
            )}

            {/* Job Description Form */}
            {!jobDescriptionData ? (
              <form onSubmit={handleSubmitJobDescription} className="space-y-4">
                <div>
                  <label
                    htmlFor="job-title"
                    className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                  >
                    Target Job Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                    <input
                      id="job-title"
                      type="text"
                      required
                      placeholder="e.g. Senior Full Stack Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="company-name"
                    className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                  >
                    Hiring Company / Team <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                    <input
                      id="company-name"
                      type="text"
                      placeholder="e.g. Stripe, OpenAI, Google"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="job-description-text"
                      className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Job Description Text <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {jobDescriptionText.length} chars (min 30)
                    </span>
                  </div>
                  <textarea
                    id="job-description-text"
                    required
                    rows={8}
                    placeholder="Paste the target role description, responsibilities, and technical requirements..."
                    value={jobDescriptionText}
                    onChange={(e) => setJobDescriptionText(e.target.value)}
                    className="w-full p-3 text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingJD || jobTitle.trim().length === 0 || jobDescriptionText.trim().length < 30}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmittingJD ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Validating & Storing...</span>
                    </>
                  ) : (
                    <>
                      <span>Process Job Description</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Processed Job Description Preview */
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {jobDescriptionData.title}
                      </h3>
                      {jobDescriptionData.company_name && (
                        <p className="text-xs text-neutral-500">{jobDescriptionData.company_name}</p>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Validated
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
                    <span>Word Count: <strong className="text-neutral-900 dark:text-white">{jobDescriptionData.word_count}</strong></span>
                    <span>•</span>
                    <span>ID: <strong className="font-mono text-neutral-900 dark:text-white truncate">{jobDescriptionData.id.slice(0, 8)}...</strong></span>
                  </div>
                </div>

                {/* Normalized JD text */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-900 text-neutral-100">
                  <div className="px-3.5 py-2 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-mono">Normalized Description</span>
                    </div>
                  </div>

                  <div className="p-4 text-xs font-mono leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-wrap select-text text-neutral-300">
                    {jobDescriptionData.description_text}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Phase 04 Pipeline Flow Details */}
        <div className="mt-12 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
            System Data Flow: Phase 03 to Phase 04
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              <span className="font-mono text-[10px] text-blue-500 font-bold block mb-1">STAGE 01</span>
              <strong className="block text-neutral-900 dark:text-white mb-1">PDF Magic Validation</strong>
              <p className="text-neutral-500">Header inspection (`%PDF-`), file size limits, safe disk storage.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              <span className="font-mono text-[10px] text-indigo-500 font-bold block mb-1">STAGE 02</span>
              <strong className="block text-neutral-900 dark:text-white mb-1">Text Extraction</strong>
              <p className="text-neutral-500">Pure digital text parsed via PyPDF, scanned image detection.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              <span className="font-mono text-[10px] text-purple-500 font-bold block mb-1">STAGE 03</span>
              <strong className="block text-neutral-900 dark:text-white mb-1">PostgreSQL Persistence</strong>
              <p className="text-neutral-500">UUID records created for Resume and Job Description tables.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              <span className="font-mono text-[10px] text-emerald-500 font-bold block mb-1">STAGE 04 (Next)</span>
              <strong className="block text-neutral-900 dark:text-white mb-1">AI Question Planner</strong>
              <p className="text-neutral-500">Phase 04 will consume these UUIDs to generate role-aligned question plans.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
