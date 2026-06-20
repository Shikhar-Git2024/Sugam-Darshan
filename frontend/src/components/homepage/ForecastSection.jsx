import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Sparkles,
  TrendingUp,
  Calendar,
  Users,
  BrainCircuit,
  Activity,
  ArrowDownRight
} from "lucide-react";

export default function ForecastSection() {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    loadForecast();
  }, []);

  async function loadForecast() {
    try {
      const response = await api.get("/public/forecast");
      setForecastData(response.data || []);
    } catch (error) {
      console.error("Error loading crowd forecast data:", error);
    }
  }

  if (!forecastData.length) {
    return (
      <section className="py-32 bg-slate-950 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="w-8 h-8 text-violet-500 animate-pulse" />
          <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">Analyzing Crowd Trends...</p>
        </div>
      </section>
    );
  }

  const bestDay = [...forecastData].sort((a, b) => a.crowd - b.crowd)[0];
  const peakDay = [...forecastData].sort((a, b) => b.crowd - a.crowd)[0];
  
  const averageCrowd = Math.round(
    forecastData.reduce((sum, item) => sum + item.crowd, 0) / forecastData.length
  );

  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-slate-700/60 backdrop-blur-md rounded-xl p-4 shadow-2xl min-w-[150px]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</p>
          <p className="font-bold text-white text-sm">{label}</p>
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400">Expected Devotees:</span>
            <span className="text-violet-400 font-mono font-bold text-xs">
              {payload[0].value.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <section id="forecast" className="relative py-32 overflow-hidden bg-slate-950 text-slate-100 selection:bg-violet-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-50" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header Block Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-[10px] tracking-widest uppercase mb-4">
            <Sparkles size={12} className="animate-spin [animation-duration:4s]" />
            AI-Powered Crowd Forecasting
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Upcoming Crowd <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Density Forecast</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl text-sm md:text-base">
            Review predictive footfall models before planning your journey to secure a smooth, comfortable, and timely Darshan experience.
          </p>
        </motion.div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-stretch">
          
          {/* Left Block Side: Chart Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-between bg-slate-900/40 rounded-2xl border border-slate-800/80 backdrop-blur-xl p-6 lg:p-8 h-full"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/60">
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  7-Day Footfall Outlook
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Predicted fluctuations in visitor patterns across upcoming dates.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                <Activity size={12} className="text-violet-400" /> Live Predictions
              </div>
            </div>

            {/* Recharts Chart View */}
            <div className="flex-1 min-h-[350px] w-full font-mono text-[11px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forecastTelemetryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b' }} 
                    dx={-5}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="crowd"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fill="url(#forecastTelemetryGrad)"
                    isAnimationActive={true}
                    animationDuration={1500}
                    activeDot={{ r: 5, strokeWidth: 1, fill: '#ffffff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Right Block Side: Grid Summary Cards */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-4 h-full justify-between"
          >
            {/* Card Element 1: Best Day */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl p-5 hover:bg-slate-900/60 hover:border-emerald-500/30 transition-all duration-300 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Recommended</p>
                  <h4 className="font-bold text-white text-sm mt-0.5">Best Day to Visit</h4>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-emerald-400 tracking-tight">{bestDay.day}</span>
                <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-0.5">
                  <ArrowDownRight size={10} /> Low Density
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 border-t border-slate-800/60 pt-2">
                This date shows the lowest projected footfall across the current calendar loop.
              </p>
            </div>

            {/* Card Element 2: Peak Day */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl p-5 hover:bg-slate-900/60 hover:border-orange-500/30 transition-all duration-300 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Highest Forecast</p>
                  <h4 className="font-bold text-white text-sm mt-0.5">Peak Expected Crowd</h4>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-orange-400 tracking-tight">{peakDay.day}</span>
                <span className="text-[10px] font-mono text-orange-400/80 bg-orange-500/5 border border-orange-500/10 px-2 py-0.5 rounded">
                  Max Surge
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 border-t border-slate-800/60 pt-2">
                Expect larger queues and extended waiting times at safety screening points.
              </p>
            </div>

            {/* Card Element 3: Average Crowd */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl p-5 hover:bg-slate-900/60 hover:border-violet-500/30 transition-all duration-300 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Weekly Average</p>
                  <h4 className="font-bold text-white text-sm mt-0.5">Average Daily Footfall</h4>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-violet-400 tracking-tight font-mono">
                  {averageCrowd.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Devotees / Day</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 border-t border-slate-800/60 pt-2">
                The baseline average attendance calculated across our active forecast horizon.
              </p>
            </div>

            {/* Bottom Recommendation Alert Banner */}
            <div className="rounded-xl p-5 bg-gradient-to-br from-violet-600/90 to-indigo-700/90 text-white shadow-xl relative overflow-hidden flex-1 flex flex-col justify-center">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
                <BrainCircuit size={120} />
              </div>
              <div className="flex items-center gap-2.5 mb-3">
                <BrainCircuit size={18} className="text-indigo-200" />
                <h3 className="font-bold text-xs tracking-wider uppercase text-indigo-100">
                  Smart Planning Tip
                </h3>
              </div>
              <p className="leading-relaxed text-xs text-white/90">
                Planning your arrival for <span className="font-bold text-cyan-300 underline underline-offset-4">{bestDay.day}</span> will maximize entry speed and significantly reduce overall waiting times inside the complex.
              </p>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}