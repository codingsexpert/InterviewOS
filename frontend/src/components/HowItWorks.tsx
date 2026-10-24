import { FileText, Cpu, Headphones, Award } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Resume & Job Description Analysis",
      description:
        "Upload your resume PDF and paste the target job description. Gemini 1.5 extracts skills, experience levels, and architectural gaps to customize the interview scope.",
      phase: "Phase 03",
    },
    {
      number: "02",
      icon: Cpu,
      title: "Blueprint Planning & Calibration",
      description:
        "The Question Planner constructs a tailored interview trajectory covering core technical depth, system design, and role-specific behavioral scenarios.",
      phase: "Phase 04",
    },
    {
      number: "03",
      icon: Headphones,
      title: "Autonomous Voice Mock Interview",
      description:
        "Converse in real-time. Microphone audio streams to Sarvam STT, routes through the LangGraph state machine, and streams back synthesized speech via Fish Audio TTS.",
      phase: "Phases 05 & 06",
    },
    {
      number: "04",
      icon: Award,
      title: "Rubric Assessment & Practice Roadmap",
      description:
        "Receive a detailed scorecard across 4 core competencies, question-by-question breakdown, audio replays, and a personalized 7-day growth curriculum.",
      phase: "Phases 07 & 08",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-2">
            Execution Flow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            How InterviewOS Operates
          </h3>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            A continuous loop from candidate data ingestion through low-latency speech synthesis and objective evaluation.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white font-mono font-bold text-sm">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-2xl font-mono font-extrabold text-neutral-300 dark:text-neutral-700">
                      {step.number}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="inline-block text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                    Target: {step.phase}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
