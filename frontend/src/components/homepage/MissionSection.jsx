import { motion } from "framer-motion";
import {
  Target,
  Eye,
} from "lucide-react";

export default function MissionSection() {
  return (
    <section id="mission-purpose" className="relative py-32 overflow-hidden bg-slate-950 text-slate-100 selection:bg-violet-500/30">
      {/* Premium Tech Grid Mesh Background Layer */}
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
              Building The Future Of <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Smart Pilgrimages</span>
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl text-sm md:text-base">
              Our core principles ensure your spiritual journey is peaceful and safe.
            </p>
          </div>
          <div className="self-start lg:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono font-bold tracking-wider uppercase">
              Our Purpose
            </span>
          </div>
        </motion.div>

        {/* Dual Column Matrix Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-8 md:p-10 hover:bg-slate-900/80 hover:border-violet-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Icon Frame */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/5 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-8 group-hover:scale-105 transition-transform duration-300">
                <Target size={26} />
              </div>

              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">Core Objective</span>
              <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                Our Mission
              </h3>

              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                To make your temple travel completely safe, organized, and stress-free. We use helpful data updates to tell you how crowds look ahead of time so your family avoids long waiting delays.
              </p>
            </div>

          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-8 md:p-10 hover:bg-slate-900/80 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Icon Frame */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/5 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-105 transition-transform duration-300">
                <Eye size={26} />
              </div>

              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">Future Outlook</span>
              <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                Our Vision
              </h3>

              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                A future where every devotee enjoys an elegant, informed, and completely protected darshan experience. No heavy crowding rushes, no guessing hours, and zero unnecessary lines for your family.
              </p>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}