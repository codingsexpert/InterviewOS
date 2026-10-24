import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, Zap, Mic } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background Subtle Gradient & Grid */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(0,0,0,0))]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Phase Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-8 backdrop-blur-sm">
          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          <span>InterviewOS Architecture & Full-Stack Engine</span>
          <span className="text-neutral-400 dark:text-neutral-600">|</span>
          <span className="text-neutral-500">Phase 01 Active</span>
        </div>

        {/* Primary Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white max-w-4xl mx-auto leading-[1.1]">
          The Intelligent Operating System for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
            Technical Mock Interviews
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Simulate high-stakes engineering interviews with adaptive AI agents. Combining real-time voice streaming, automated resume alignment, and rubric-based evaluation.
        </p>

        {/* CTA Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/interview/setup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all"
          >
            <span>Start Interview Setup</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="#architecture"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-neutral-900 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-all"
          >
            <span>Explore Architecture</span>
          </Link>
        </div>

        {/* Metrics & Architecture Preview Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-medium mb-1">
              <Mic className="w-4 h-4 text-blue-500" />
              <span>Voice Pipeline</span>
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">&lt;500ms</p>
            <p className="text-xs text-neutral-500">Sarvam STT + Fish Audio TTS</p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-medium mb-1">
              <Bot className="w-4 h-4 text-indigo-500" />
              <span>Agent Runtime</span>
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">LangGraph</p>
            <p className="text-xs text-neutral-500">Adaptive multi-turn state graph</p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-medium mb-1">
              <Zap className="w-4 h-4 text-purple-500" />
              <span>LLM Reasoning</span>
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">Gemini 1.5</p>
            <p className="text-xs text-neutral-500">Flash & Pro dual-model routing</p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-medium mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Architecture</span>
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">PostgreSQL 15+</p>
            <p className="text-xs text-neutral-500">Async SQLAlchemy & Alembic</p>
          </div>
        </div>
      </div>
    </section>
  );
}
