import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Users,
  Clock3,
} from "lucide-react";

export default function HackathonSection() {
  const achievements = [
    {
      icon: Trophy,
      value: "1st",
      label: "Rank Secured",
    },
    {
      icon: Users,
      value: "600+",
      label: "Competing Teams",
    },
    {
      icon: Clock3,
      value: "24",
      label: "Hours of Planning",
    },
    {
      icon: Medal,
      value: "₹25K",
      label: "Prize Awarded",
    },
  ];

  return (
    <section id="achievements" className="relative py-32 overflow-hidden bg-slate-950 text-slate-100 selection:bg-violet-500/30">
      {/* Premium Tech Grid Mesh Background Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      {/* Cyberpunk Dynamic Ambient Glow Components */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Dynamic Telemetry Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 border-b border-slate-800/60 pb-10"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Award-Winning <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200">Innovation</span>
            </h2>
            <p className="mt-3 text-slate-400 max-w-2xl text-sm md:text-base">
              Sugam Darshan won the First Prize at the National Competition for creating a simple, helpful way to manage temple crowds and keep families safe.
            </p>
          </div>
          <div className="self-start lg:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-amber-400 text-[10px] font-mono font-bold tracking-wider uppercase">
              Recognition & Achievement
            </span>
          </div>
        </motion.div>

        {/* Main Award Card — High Fidelity Dashboard Look */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 md:p-10 shadow-2xl mb-8 group"
        >
          {/* Internal Premium Node Backlight */}
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-amber-500/10 blur-[80px] group-hover:bg-amber-500/15 transition-colors duration-300 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-start md:items-center gap-6">
              {/* Premium Trophy Frame */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/5 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Trophy size={32} />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded">
                  NATIONAL INNOVATION COMPETITION
                </span>
                <h3 className="text-3xl font-black text-white tracking-tight mt-2">
                  1st Place Grand Winner
                </h3>
                <p className="text-slate-400 text-xs md:text-sm mt-1">
                  Chhatrapati Shahu Ji Maharaj University, Kanpur
                </p>
              </div>
            </div>

            <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-slate-800/80 pt-6 md:pt-0 md:pl-8 shrink-0">
              <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">Project Focus</span>
              <p className="text-sm font-bold text-slate-200 mt-1 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl">
                Safe Pilgrimage System
              </p>
            </div>
          </div>
        </motion.div>

        {/* Achievement Stats Grid Layer */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-5 hover:bg-slate-900/60 hover:border-amber-500/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-400 transition-colors">
                    <Icon size={18} />
                  </div>
                  <div className="text-2xl font-black font-mono text-white tracking-tight">
                    {item.value}
                  </div>
                </div>

                <div>
                  <div className="border-t border-slate-800/60 pt-3">
                    <p className="text-[11px] font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                      {item.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}