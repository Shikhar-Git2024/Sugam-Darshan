import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Calendar,
  Shield,
  MapPinned,
  Bell,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    id: "ai-recommendations",
    icon: Brain,
    title: "Best Time to Visit",
    desc: "Find out the best and least crowded hours for your family's visit.",
  },
  {
    id: "smart-booking",
    icon: Calendar,
    title: "Easy Slot Booking",
    desc: "Book your preferred darshan slots quickly without any hassle.",
  },
  {
    id: "crowd-forecasting",
    icon: BarChart3,
    title: "Crowd Updates",
    desc: "Check how many people are at the temple before you leave home.",
  },
  {
    id: "emergency-support",
    icon: Shield,
    title: "Emergency Support",
    desc: "Get instant help and medical support inside the temple if needed.",
  },
  {
    id: "temple-navigation",
    icon: MapPinned,
    title: "Temple Route Guide",
    desc: "Easy maps to help you find lines, drinking water, and exits easily.",
  },
  {
    id: "live-notifications",
    icon: Bell,
    title: "Mobile Notifications",
    desc: "Receive simple text alerts about your booking status and line updates.",
  },
];

export default function FeaturesSection() {
  const navigate = useNavigate();

  const handleCardClick = (targetId) => {
    navigate(`/features#${targetId}`);
  };

  return (
    <section id="features" className="relative py-32 overflow-hidden bg-slate-950 text-slate-100 selection:bg-violet-500/30">
      {/* Premium Tech Grid Mesh Background Layer - Matches Live Insights Exactly */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

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
              Our Features for <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Devotees</span>
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl text-sm md:text-base">
              Everything you need for a comfortable, safe, and peaceful darshan experience.
            </p>
          </div>
          <div className="self-start lg:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono font-bold tracking-wider uppercase">
              Temple Services
            </span>
          </div>
        </motion.div>

        {/* High-Density Display Dashboard Matrix Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => handleCardClick(feature.id)}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 hover:bg-slate-900/80 hover:border-violet-500/40 transition-colors duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Icon Node Matching Card Design */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/5 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={22} />
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase font-mono">Service Module</p>
                  <h3 className="text-xl font-black text-white tracking-tight mt-1.5">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-slate-400 text-xs leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                {/* Matrix Interactive Action Bar Footer */}
                <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-violet-400 group-hover:text-white transition-colors duration-200">
                  <span className="tracking-wide uppercase font-mono text-[11px]">Read Details</span>
                  <div className="transform translate-x-0 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200 text-cyan-400">
                    <ArrowUpRight size={16} />
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