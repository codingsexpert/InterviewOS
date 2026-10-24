import { Mic, Volume2, GitBranch, Terminal, ShieldAlert, CreditCard } from "lucide-react";

export function CoreFeatures() {
  const features = [
    {
      icon: Volume2,
      title: "Real-Time Speech Synthesis",
      description:
        "Powered by Fish Audio s2.1-pro-free delivering natural human interviewer cadence with low-latency streaming directly from backend services.",
      badge: "Fish Audio TTS",
    },
    {
      icon: Mic,
      title: "Streaming Speech-to-Text",
      description:
        "High-accuracy audio transcription via Sarvam AI STT with seamless endpointing and silence detection over persistent WebSockets.",
      badge: "Sarvam AI STT",
    },
    {
      icon: GitBranch,
      title: "Adaptive Conversation State",
      description:
        "LangGraph state machine determines when to probe deeper, request clarification, or advance to the next technical topic based on response depth.",
      badge: "LangGraph Agent",
    },
    {
      icon: ShieldAlert,
      title: "Rubric Evaluation Engine",
      description:
        "Automated post-interview assessment scoring Technical Accuracy, Problem Solving, Structure, and Delivery with Gemini 1.5 Pro.",
      badge: "Rubric Analytics",
    },
    {
      icon: Terminal,
      title: "Live Coding Sandbox",
      description:
        "Integrated real-time code editor allowing candidates to solve algorithmic problems while conversing with the AI interviewer.",
      badge: "Monaco Editor",
    },
    {
      icon: CreditCard,
      title: "Usage Quotas & Billing",
      description:
        "Tiered subscriptions and session tracking managed via Razorpay with real-time quota verification on every mock session.",
      badge: "Razorpay Gateway",
    },
  ];

  return (
    <section id="features" className="py-20 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-2">
            Technical Capabilities
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Core Platform Architecture
          </h3>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Engineered as an asynchronous, scalable system balancing low latency audio transmission with deep cognitive LLM reasoning.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {feature.badge}
                  </span>
                </div>

                <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
