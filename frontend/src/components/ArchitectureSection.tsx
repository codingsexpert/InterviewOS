import { Mic, Bot, Cpu, Volume2, Shield } from "lucide-react";

export function ArchitectureSection() {
  const pipelineSteps = [
    {
      title: "Candidate Audio",
      desc: "Web Audio PCM Stream (16kHz)",
      icon: Mic,
      tech: "Browser Context",
    },
    {
      title: "Speech to Text",
      desc: "Low-latency streaming transcription",
      icon: Cpu,
      tech: "Sarvam AI STT",
    },
    {
      title: "LangGraph Agent",
      desc: "Multi-turn interview state machine",
      icon: Bot,
      tech: "FastAPI Backend",
    },
    {
      title: "Reasoning Engine",
      desc: "Question planning & follow-ups",
      icon: Cpu,
      tech: "Gemini 1.5",
    },
    {
      title: "Speech Synthesis",
      desc: "Natural conversational voice playback",
      icon: Volume2,
      tech: "Fish Audio s2.1-pro-free",
    },
  ];

  return (
    <section id="architecture" className="py-20 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-2">
            Technical Specification
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Real-Time Voice Pipeline Architecture
          </h3>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Engineered with a backend-isolated security perimeter. Vendor API keys (Fish Audio, Sarvam, Gemini) never touch client code.
          </p>
        </div>

        {/* Pipeline Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mb-3">{step.desc}</p>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    {step.tech}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Box */}
        <div className="mt-12 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 max-w-4xl mx-auto flex items-start gap-4">
          <Shield className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm text-neutral-700 dark:text-neutral-300">
            <strong className="text-emerald-800 dark:text-emerald-400 block mb-1">
              Backend Security Perimeter Enforced
            </strong>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              All interactions with Fish Audio TTS (model <code>s2.1-pro-free</code>) and Sarvam AI STT are securely proxied through the FastAPI backend.
              Frontend clients communicate over authenticated WebSockets without holding any API secrets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
