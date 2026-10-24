"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { Terminal, Shield, ArrowLeft, ArrowRight, UserCheck } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    try {
      setIsDemoLoading(true);
      await signIn("demo", { callbackUrl: "/dashboard" });
    } catch {
      setIsDemoLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to InterviewOS</span>
        </Link>

        {/* Card */}
        <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          {/* Brand header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sign in to InterviewOS</h1>
              <p className="text-xs text-neutral-500">Candidate & Recruiter Access</p>
            </div>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            Choose an option to enter your mock interview workspace on Mac, iPhone, or iPad:
          </p>

          {/* Quick Demo Access Button */}
          <button
            onClick={handleDemoLogin}
            disabled={isDemoLoading || isLoading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-medium text-sm transition-all shadow-sm mb-3 disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isDemoLoading ? "Opening Workspace..." : "Enter Workspace (Demo Candidate)"}</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-mono">
              <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || isDemoLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-medium text-sm transition-all shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? "Redirecting to Google..." : "Google Account (Live Auth)"}</span>
          </button>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex items-start gap-2 text-xs text-neutral-500">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              Secure OAuth 2.0 with HTTP-only cookies and cryptographic token verification. No passwords stored.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
