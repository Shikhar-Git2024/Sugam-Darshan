import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

import {
  Brain,
  Clock3,
  Shield,
  TrendingUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  Zap,
  Sparkles,
  CloudSun
} from "lucide-react";

export default function WhySugamSection() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const traditionalProblems = [
    "No visibility of live crowd levels",
    "Unpredictable waiting times",
    "Difficulty choosing the best time to visit",
    "Limited emergency awareness",
    "Last-minute travel uncertainty",
  ];

  const sugamBenefits = [
    "AI-powered crowd forecasting",
    "Smart slot recommendations",
    "Real-time crowd monitoring",
    "Emergency support integration",
    "Personalized pilgrimage planning",
  ];

  useEffect(() => {
    async function calculateLiveMetrics() {
      try {
        const response = await api.get("/public/forecast");
        const rawData = response.data || [];

        if (rawData.length > 0) {
          const peakDay = [...rawData].sort((a, b) => b.crowd - a.crowd)[0];
          const bestDay = [...rawData].sort((a, b) => a.crowd - b.crowd)[0];
          const totalLoad = rawData.reduce((sum, item) => sum + item.crowd, 0);
          const medianCalculated = Math.round(totalLoad / rawData.length);

          setMetrics({
            peakLoad: peakDay.crowd.toLocaleString(),
            optimalWindow: bestDay.day,
            meanThroughput: medianCalculated.toLocaleString(),
            activeNodes: rawData.length.toString()
          });
        }
      } catch (error) {
        console.error("Error aggregating live telemetry states:", error);
      } finally {
        setLoading(false);
      }
    }

    calculateLiveMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <section className="py-24 bg-slate-950 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-6 h-6 text-violet-500 animate-pulse" />
          <p className="text-slate-500 font-mono text-[10px] tracking-widest uppercase">Loading Live Temple Insights...</p>
        </div>
      </section>
    );
  }

  const dynamicStats = [
    {
      value: metrics.optimalWindow,
      label: "Best Day to Visit",
      metric: "Recommended",
      icon: TrendingUp,
      borderColor: "hover:border-emerald-500/30",
      bgGradient: "from-emerald-500/10 to-transparent",
      color: "text-emerald-400"
    },
    {
      value: `${metrics.peakLoad}`,
      label: "Peak Expected Crowd",
      metric: "Highest Forecast",
      icon: Shield,
      borderColor: "hover:border-orange-500/30",
      bgGradient: "from-orange-500/10 to-transparent",
      color: "text-orange-400"
    },
    {
      value: metrics.meanThroughput,
      label: "Average Daily Footfall",
      metric: "Weekly Average",
      icon: Brain,
      borderColor: "hover:border-violet-500/30",
      bgGradient: "from-violet-500/10 to-transparent",
      color: "text-violet-400"
    },
    {
      value: `${metrics.activeNodes} Days`,
      label: "Forecast Coverage",
      metric: "Forecast Days",
      icon: Clock3,
      borderColor: "hover:border-cyan-500/30",
      bgGradient: "from-cyan-500/10 to-transparent",
      color: "text-cyan-400"
    },
  ];

  return (
    <section id="why-sugam" className="relative py-32 bg-slate-950 text-slate-100 overflow-hidden selection:bg-violet-500/30">
      
      {/* Background Matrix Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Section Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 font-bold text-[10px] tracking-widest uppercase mb-4">
            <Zap size={11} className="animate-pulse" />
            AI-Powered Crowd Intelligence
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Why Choose Sugam Darshan?
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl text-sm md:text-base">
            Comparing classic unmonitored baseline environments against active predictive analytics built to ensure a safe, organized, and peaceful pilgrimage.
          </p>
        </motion.div>

        {/* Structural Comparison Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          
          {/* Legacy Profiles Container */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-xl p-8 hover:bg-slate-900/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">Traditional Temple Visit</h3>
                  <p className="text-[11px] text-slate-500">Unmanaged pilgrimage conditions</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-red-400 bg-red-500/5 border border-red-500/10 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                Unpredictable
              </span>
            </div>

            <div className="space-y-4">
              {traditionalProblems.map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <XCircle size={18} className="text-red-500/70 shrink-0 mt-0.5" />
                  <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sugam Active Profiler Container */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-indigo-950/20 backdrop-blur-xl p-8 hover:border-violet-500/50 transition-all duration-300 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-2xl pointer-events-none rounded-full" />

            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/5 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Sparkles size={18} className="animate-spin [animation-duration:6s]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">With Sugam Darshan</h3>
                  <p className="text-[11px] text-violet-400">Smart Pilgrimage Planning</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider flex items-center gap-1">
                <Activity size={10} className="animate-pulse" /> Active
              </span>
            </div>

            <div className="space-y-4">
              {sugamBenefits.map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  {item === "Live weather & travel insights" ? (
                    <CloudSun size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 size={18} className="text-violet-400 shrink-0 mt-0.5" />
                  )}
                  <span className="text-slate-200 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Real-time Dynamic Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dynamicStats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ y: -5 }}
                className={`group relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl p-6 transition-all duration-300 ${stat.borderColor}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center ${stat.color} group-hover:scale-105 transition-transform`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold tracking-wide">
                    {stat.metric}
                  </span>
                </div>

                <div className="text-3xl font-black text-white tracking-tight font-mono relative z-10">
                  {stat.value}
                </div>

                <p className="mt-1.5 text-xs font-medium text-slate-400 tracking-wide relative z-10">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}