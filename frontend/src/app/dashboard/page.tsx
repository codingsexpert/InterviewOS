"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Terminal,
  User as UserIcon,
  LogOut,
  Sparkles,
  FileText,
  Mic,
  Award,
  Shield,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="flex items-center gap-2 text-sm text-neutral-500 font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span>Validating candidate session...</span>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const displayName = user?.name || "Candidate";

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* Top Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-semibold text-base tracking-tight">InterviewOS</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              Candidate Workspace
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pr-3 border-r border-neutral-200 dark:border-neutral-800">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold leading-none">{displayName}</span>
                <span className="text-[10px] text-neutral-500 font-mono mt-0.5">{user?.email}</span>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 mb-2">
                <Shield className="w-3 h-3" />
                <span>Google OAuth Session Verified</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome back, {displayName}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Active Tier: <strong className="text-neutral-900 dark:text-white uppercase font-mono">Free Tier (3 Mock Sessions)</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-500">
                Phase 02 Authenticated Shell
              </span>
            </div>
          </div>
        </div>

        {/* Candidate Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <span className="text-xs font-mono text-neutral-500">MOCK SESSIONS</span>
            <p className="text-2xl font-bold mt-1">0 / 3</p>
            <span className="text-[11px] text-neutral-400">Available in free quota</span>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <span className="text-xs font-mono text-neutral-500">AVG TECHNICAL SCORE</span>
            <p className="text-2xl font-bold mt-1">--</p>
            <span className="text-[11px] text-neutral-400">Awaiting first session</span>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <span className="text-xs font-mono text-neutral-500">VOICE INTERVIEW TIME</span>
            <p className="text-2xl font-bold mt-1">0 mins</p>
            <span className="text-[11px] text-neutral-400">Low-latency audio pipeline</span>
          </div>
        </div>

        {/* Feature Modules Pipeline Status */}
        <h2 className="text-base font-bold tracking-tight mb-4">Interview Preparation Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phase 03 */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between opacity-80">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Phase 03 Upcoming
                </span>
              </div>
              <h3 className="font-semibold text-base mb-1">Resume & Job Description Alignment</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Upload your resume PDF and paste target job descriptions to extract skill deltas and experience gaps.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>PDF Extraction Engine</span>
              <span className="font-mono">Locked</span>
            </div>
          </div>

          {/* Phase 04 */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between opacity-80">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Phase 04 Upcoming
                </span>
              </div>
              <h3 className="font-semibold text-base mb-1">Gemini Question Blueprint Planner</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Automated multi-category question generation calibrated precisely to candidate seniority.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>Question Calibrator</span>
              <span className="font-mono">Locked</span>
            </div>
          </div>

          {/* Phase 05/06 */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between opacity-80">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Phase 05 & 06 Upcoming
                </span>
              </div>
              <h3 className="font-semibold text-base mb-1">Live Voice Simulation Sandbox</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Real-time conversational interview with Sarvam AI STT, LangGraph state agent, and Fish Audio s2.1-pro-free TTS.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>Voice Pipeline</span>
              <span className="font-mono">Locked</span>
            </div>
          </div>

          {/* Phase 07/08 */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between opacity-80">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Phase 07 & 08 Upcoming
                </span>
              </div>
              <h3 className="font-semibold text-base mb-1">Rubric Reports & 7-Day Growth Plan</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Objective scoring across Technical, Structuring, Communication, and Confidence metrics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>Analytics Engine</span>
              <span className="font-mono">Locked</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
