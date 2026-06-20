import { motion } from "framer-motion";
import {
  Calendar,
  Brain,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Calendar,
      title: "Choose Your Visit Date",
      description: "Select your preferred darshan date and time.",
    },
    {
      number: "02",
      icon: Brain,
      title: "System Checks Crowd Data",
      description: "Our smart system checks the expected visitor volume and line waiting times.",
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Get Best Recommendations",
      description: "Receive the best time slots for a completely smooth and comfortable darshan.",
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Book & Travel Safely",
      description: "Confirm your temple visit pass and travel with complete peace of mind.",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden bg-slate-950 text-slate-100 selection:bg-violet-500/30">
      {/* Premium Tech Grid Mesh Background Layer - Matches Rest of Dashboard */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      {/* Cyberpunk Dynamic Ambient Glow Components */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Dynamic Telemetry Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 border-b border-slate-800/60 pb-10"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Works</span>
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl text-sm md:text-base">
              Planning your peaceful darshan takes less than a minute.
            </p>
          </div>
          <div className="self-start lg:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono font-bold tracking-wider uppercase">
              Simple Process
            </span>
          </div>
        </motion.div>

        {/* High-Density Display Dashboard Matrix Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 hover:bg-slate-900/80 hover:border-violet-500/40 transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number Display */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/5 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={22} />
                    </div>
                    <span className="text-3xl font-black font-mono text-slate-800 group-hover:text-violet-500/20 transition-colors select-none">
                      {step.number}
                    </span>
                  </div>

                  {/* Content Block */}
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase font-mono">Step Sequence</p>
                  <h3 className="text-lg font-black text-white tracking-tight mt-1.5">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-slate-400 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Decorative Bottom Matrix Frame Line */}
                <div className="mt-6 pt-2 border-t border-slate-800/40 w-full" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}