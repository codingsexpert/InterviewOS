"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, Menu, X } from "lucide-react";
import { ApiStatusIndicator } from "./ApiStatusIndicator";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-900 shadow-sm transition-transform group-hover:scale-105">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base tracking-tight text-neutral-950 dark:text-white">
                InterviewOS
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">
                Phase 01 Active
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <Link href="#overview" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              Overview
            </Link>
            <Link href="#how-it-works" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#features" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              Core Features
            </Link>
            <Link href="#architecture" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              Architecture
            </Link>
          </nav>

          {/* Right Action: Status Indicator & Disabled Auth Action */}
          <div className="hidden sm:flex items-center gap-4">
            <ApiStatusIndicator />
            <button
              disabled
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-500 bg-neutral-100 dark:bg-neutral-900 cursor-not-allowed opacity-80"
              title="Authentication will be enabled in Phase 02 (Google OAuth)"
            >
              Sign In (Phase 02)
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ApiStatusIndicator />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 pt-3 pb-5 space-y-3">
          <Link
            href="#overview"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white py-1"
          >
            Overview
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white py-1"
          >
            How It Works
          </Link>
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white py-1"
          >
            Core Features
          </Link>
          <Link
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white py-1"
          >
            Architecture
          </Link>
          <div className="pt-2">
            <button
              disabled
              className="w-full text-center py-2 px-3 rounded-md text-xs font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-500 bg-neutral-100 dark:bg-neutral-900 cursor-not-allowed"
            >
              Sign In (Coming Soon in Phase 02)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
