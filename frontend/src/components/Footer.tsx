import Link from "next/link";
import { Terminal, GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-12 text-sm text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-semibold text-base text-neutral-900 dark:text-white">
                InterviewOS
              </span>
            </div>
            <p className="text-sm text-neutral-500 max-w-sm mb-4 leading-relaxed">
              Production-oriented AI Mock Interview SaaS Platform. Engineered with Next.js, FastAPI, PostgreSQL, LangGraph, Sarvam STT, and Fish Audio TTS.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/codingsexpert/InterviewOS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
              >
                <GitBranch className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-neutral-900 dark:text-white mb-3 text-xs uppercase tracking-wider font-mono">
              Navigation
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#overview" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Core Features
                </Link>
              </li>
              <li>
                <Link href="#architecture" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  System Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Specifications */}
          <div>
            <h5 className="font-semibold text-neutral-900 dark:text-white mb-3 text-xs uppercase tracking-wider font-mono">
              Voice & AI Stack
            </h5>
            <ul className="space-y-2 text-xs font-mono text-neutral-500">
              <li>STT: Sarvam AI API</li>
              <li>TTS: Fish Audio (s2.1-pro-free)</li>
              <li>LLM: Google Gemini 1.5</li>
              <li>Agent: LangGraph State Machine</li>
              <li>Backend: FastAPI + SQLAlchemy 2.0</li>
              <li>Database: PostgreSQL 15+</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 InterviewOS. All rights reserved.</p>
          <p className="font-mono text-neutral-400">Phase 01: Full-Stack Foundation Verified</p>
        </div>
      </div>
    </footer>
  );
}
