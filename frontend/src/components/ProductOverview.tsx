import { Check, X, Server, Cpu } from "lucide-react";

export function ProductOverview() {
  return (
    <section id="overview" className="py-20 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-2">
            System Overview
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Designed for Realistic Engineering Hiring Rounds
          </h3>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Traditional interview prep relies on static flashcards or generic chatbots. InterviewOS delivers a reactive interviewer persona capable of probing technical architecture decisions.
          </p>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Practice */}
          <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white">Traditional Interview Tools</h4>
                <p className="text-xs text-neutral-500">Static Question Banks & Text Prompts</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Predetermined questions with zero adaptability to candidate responses.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Text-only interaction without natural speech pacing or interruption handling.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Vague binary feedback (&quot;Good answer&quot; or &quot;Needs work&quot;) without actionable rubric criteria.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>No alignment between candidate resume and target company job description.</span>
              </li>
            </ul>
          </div>

          {/* InterviewOS Paradigm */}
          <div className="p-8 rounded-2xl border-2 border-blue-500/30 dark:border-blue-500/40 bg-gradient-to-b from-blue-50/40 to-transparent dark:from-blue-950/20 dark:to-neutral-900 shadow-sm relative">
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600 text-white uppercase tracking-wider">
                InterviewOS
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white">The InterviewOS Architecture</h4>
                <p className="text-xs text-blue-600 dark:text-blue-400">Autonomous Multi-Turn Agent</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Dynamic Probing:</strong> LangGraph state graph inspects candidate depth and injects clarifying follow-up questions.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Low-Latency Voice:</strong> Direct audio streaming via Sarvam STT and Fish Audio s2.1-pro-free TTS for fluid conversational rhythm.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Multi-Dimensional Rubric:</strong> Evaluation across Technical Depth, Communication, Structuring, and Delivery with a 7-day practice plan.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Semantic Extraction:</strong> Parses PDF resumes and job descriptions using Gemini 1.5 to calibrate questions against the exact candidate delta.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
