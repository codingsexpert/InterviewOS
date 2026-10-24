import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-20 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-neutral-900 dark:bg-neutral-950 text-white relative overflow-hidden shadow-xl border border-neutral-800">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-xs font-mono text-neutral-300 mb-6">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Phase 01 Established</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to elevate your engineering hiring preparation?
            </h3>

            <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
              InterviewOS bridges the gap between passive problem solving and real interview pressure with autonomous, low-latency voice AI.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="#architecture"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-neutral-950 bg-white hover:bg-neutral-100 transition-colors"
              >
                <span>Read Architecture Specs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                disabled
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-neutral-400 bg-neutral-800/80 border border-neutral-700 cursor-not-allowed"
              >
                <span>Join Beta Waitlist</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-700 text-neutral-300">
                  Phase 02
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
