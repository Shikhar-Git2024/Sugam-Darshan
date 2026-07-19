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

import mandala from "../../assets/decorations/mandala.svg";
import mandala2 from "../../assets/decorations/mandala2.svg";

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
        <section className="py-24 bg-[#FFF8F1] flex items-center justify-center min-h-[450px]">
            <div className="flex flex-col items-center gap-4">
                <Sparkles
                    className="w-8 h-8 text-orange-600 animate-pulse"
                />
                <p className="text-orange-700 font-semibold">
                    Loading crowd forecast...
                </p>
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
        <div className="bg-[#FFFDF9] border border-orange-200 backdrop-blur-md rounded-xl p-4 shadow-2xl min-w-[150px]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</p>
          <p className="font-bold text-orange-900 text-sm">{label}</p>
          <div className="mt-2.5 pt-2 border-t border-orange-100 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-600">Expected Devotees:</span>
            <span className="text-orange-700 font-mono font-bold text-xs">
              {payload[0].value.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <section id="forecast" className="relative py-24 overflow-hidden bg-gradient-to-br from-[#FFFDF8] via-[#FFF8EF] to-[#FFF3E3]">
    {/* Mandalas - using fixed, clean utility classes */}
    <img
      src={mandala}
      alt=""
      className="absolute -top-20 -left-20 w-[600px] opacity-[0.1] pointer-events-none select-none z-0"
    />
    <img
      src={mandala2}
      alt=""
      className="absolute bottom-0 -right-20 w-[600px] opacity-[0.1] pointer-events-none select-none z-0"
    />
    <div className="absolute top-20 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-orange-100/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16 relative z-10"
        >
          {/* Refined Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FDE7C6] border border-[#F2C887] px-5 py-2 text-[#92400E] font-bold text-xs uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles size={14} className="animate-spin [animation-duration:5s]" />
            7-Day Crowd Forecast
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-black text-[#5D3A1A] leading-tight">
            Plan Your Darshan
            <br />
            <span className="text-[#92400E]">
              with Confidence
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 text-[#8B7355] max-w-2xl text-lg leading-relaxed font-medium">
            Check the expected crowd for the next 7 days and choose the best time for a peaceful darshan.
          </p>
        </motion.div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-stretch">
          
          {/* Left Block Side: Chart Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex flex-col justify-between rounded-[32px] border border-[#FAD6A5]/40 bg-gradient-to-br from-white via-[#FFF9F1] to-[#FFF3E6] backdrop-blur-md p-8 shadow-[0_20px_50px_rgba(217,119,6,0.08)] transition-all duration-500 hover:shadow-[0_25px_60px_rgba(217,119,6,0.12)]"
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 rounded-[32px] border border-white/50 pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-[#FAD6A5]/30">
              <div>
                <h3 className="text-xl font-black text-[#5D3A1A] tracking-tight">
                  7-Day Crowd Forecast
                </h3>
                <p className="text-[#8B7355] text-xs mt-1 font-medium">
                  Expected number of devotees over the next seven days.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#FAD6A5]/20 border border-[#FAD6A5]/30 px-4 py-2 text-[#92400E] font-bold text-[10px] uppercase tracking-wider">
                <Activity size={12} /> Updated Daily
              </div>
            </div>

            {/* Recharts Chart View */}
            <div className="flex-1 min-h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forecastTelemetryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#D97706" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FAD6A5" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#8B7355", fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => `${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                    tick={{ fill: "#A16207", fontSize: 10, fontWeight: 600 }}
                    dx={-5}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="crowd"
                    stroke="#D97706"
                    strokeWidth={3}
                    fill="url(#forecastTelemetryGrad)"
                    activeDot={{ r: 6, fill: "#D97706", stroke: "#FFFBF5", strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-4 h-full justify-between"
          >
            {[
              {
                title: "Best Time",
                subtitle: "Best Day to Visit",
                val: bestDay.day,
                icon: Calendar,
                // Sage Green Theme
                color: "text-[#3E653E]",
                bg: "bg-[#E8F0E8]/70",
                border: "border-[#CDE0CD]",
                badge: "Low Density",
                desc: "Lowest expected crowd for a smoother and faster darshan.",
              },
              {
                title: "Busy Day",
                subtitle: "Peak Expected Crowd",
                val: peakDay.day,
                icon: TrendingUp,
                // Terracotta/Red Theme
                color: "text-[#991B1B]",
                bg: "bg-[#FEE2E2]/70",
                border: "border-[#FECACA]",
                badge: "Max Surge",
                desc: "Expect more devotees and longer waiting times.",
              },
              {
                title: "Average Crowd",
                subtitle: "Daily Footfall",
                val: averageCrowd.toLocaleString(),
                icon: Users,
                // Saffron/Gold Theme
                color: "text-[#92400E]",
                bg: "bg-[#FAD6A5]/30",
                border: "border-[#FAD6A5]/50",
                badge: "Devotees / Day",
                desc: "Average number of devotees expected each day.",
              }
            ].map((item, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-[24px] border ${item.border} ${item.bg} backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex-1`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-lg bg-white/50 border ${item.border} flex items-center justify-center ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-[#8B7355] uppercase">{item.title}</p>
                    <h4 className="font-bold text-[#5D3A1A] text-sm mt-0.5">{item.subtitle}</h4>
                  </div>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <span className={`text-2xl font-black ${item.color} tracking-tight`}>{item.val}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.border} ${item.color} uppercase tracking-wider`}>{item.badge}</span>
                </div>
                <p className="text-[11px] text-[#8B7355] mt-3 border-t border-[#FAD6A5]/30 pt-3">{item.desc}</p>
              </div>
            ))}

            {/* Recommendation Banner - remains anchor */}
            <div className="rounded-2xl p-6 bg-[#5D3A1A] text-[#FFFBF5] shadow-xl relative overflow-hidden flex-1 flex flex-col justify-center border border-[#92400E]/20">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-[0.03]">
                <BrainCircuit size={140} />
              </div>
              <div className="flex items-center gap-2.5 mb-2">
                <BrainCircuit size={18} className="text-[#FAD6A5]" />
                <h3 className="font-bold text-[10px] tracking-widest uppercase text-[#FAD6A5]">Sugam AI Suggestion</h3>
              </div>
              <p className="leading-relaxed text-xs text-[#FFFBF5]/80">
                Visit on <span className="font-bold text-[#FAD6A5] underline underline-offset-4">{bestDay.day}</span> for a more comfortable darshan with shorter queues.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}