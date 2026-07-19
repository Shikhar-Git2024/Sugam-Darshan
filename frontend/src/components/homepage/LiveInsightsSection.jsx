import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Users,
  Clock3,
  Activity,
  TrendingUp,
  CloudSun,
  RefreshCw,
  MapPin,
  Eye,
  CalendarDays
} from "lucide-react";
import api from "../../services/api";
import bannerImage from "../../assets/images/live-insights-banner.png";
import illustration from "../../assets/images/live-temple-illustration.png";
import mandala from "../../assets/decorations/mandala.svg";

export default function LiveInsightsSection() {
  const [stats, setStats] = useState(null);
  const [crowd, setCrowd] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Accept an optional signal parameter for network abortion
  async function loadData(signal = null) {
    setIsRefreshing(true);
    try {
      // Pass the signal down to your API instances
      const statsResponse = await api.get("/public/home-stats", { signal });
      const crowdResponse = await api.get("/public/crowd-status", { signal });
      const weatherResponse = await axios.get(
        "https://api.open-meteo.com/v1/forecast?latitude=26.7996&longitude=82.2042&current=temperature_2m",
        { signal }
      );

      setStats(statsResponse.data || {});
      setCrowd(crowdResponse.data || {});
      setWeather({
        temperature: Math.round(weatherResponse.data?.current?.temperature_2m || 0),
        condition:
          weatherResponse.data?.current?.temperature_2m > 35
            ? "Hot"
            : weatherResponse.data?.current?.temperature_2m > 28
            ? "Pleasant"
            : "Cool",
      });
    } catch (error) {
      // Ignore errors generated intentionally by aborting the request
      if (axios.isCancel(error) || error.name === "CanceledError") {
        return;
      }
      console.error("Error loading insights data:", error);
    } finally {
      // Only reset the refreshing animation if we haven't aborted
      if (!signal?.aborted) {
        setTimeout(() => setIsRefreshing(false), 600);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    
    // Initial fetch using the controller's signal
    loadData(controller.signal);

    // Auto-refresh stream every 30 seconds
    const interval = setInterval(() => {
      loadData(controller.signal);
    }, 30000);

    // Clean up both the loop interval AND cancel pending requests
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, []);

  if (!stats || !crowd) {
    return (
      <section className="py-32 relative py-28 overflow-hidden bg-[#fffaf2] flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
          <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">Initializing Telemetry Stream...</p>
        </div>
      </section>
    );
  }

  const tempVal = weather ? `${weather.temperature}°C` : "--";

  const status = (crowd.status || "").toUpperCase();

  const statusConfig = {
    LOW: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-700",
    },
    MODERATE: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      badge: "bg-yellow-100 text-yellow-700",
    },
    HIGH: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      badge: "bg-orange-100 text-orange-700",
    },
    CRITICAL: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      badge: "bg-red-100 text-red-700",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.MODERATE;

  return (
    <section className="relative pt-0 pb-20 overflow-hidden bg-[#fffaf2]">
      <img
        src={mandala}
        alt=""
        className="absolute top-50 left-0 w-[700px] opacity-10 pointer-events-none select-none z-0"
      />
      <img
        src={mandala}
        alt=""
        className="absolute top-200 right-0 w-[700px] opacity-10 pointer-events-none select-none z-0"
      />
        
        {/* Section Hero */}
        <div className="relative overflow-hidden w-full min-h-[380px] flex items-center">
          <img
            src={bannerImage}
            alt="Live Temple Insights"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Warm, deep overlay for better text contrast */}
          <div className="absolute inset-0 bg-[#5D3A1A]/60 backdrop-blur-[0.2px]" />
          
          <div className="relative z-10 flex items-center px-6 md:px-16 max-w-7xl mx-auto w-full">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-[#FAD6A5] drop-shadow-md">
                Live Temple Insights
              </h2>
              
              <p className="mt-4 text-[#FFFBF5]/90 text-lg leading-relaxed max-w-lg font-medium drop-shadow-md">
                Stay updated with real-time crowd conditions, waiting time,
                expected visitors, and weather information before planning
                your darshan.
              </p>
            
              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center gap-3">
                  {/* Refined Live Indicator */}
                  <div className="flex items-center gap-2 bg-[#E8F0E8] border border-[#CDE0CD] px-4 py-2 rounded-full shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4A7C4A] animate-pulse"></span>
                    <span className="text-[#3E653E] font-bold text-xs uppercase tracking-wider">
                      Live Status
                    </span>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={() => loadData()}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md text-[#5D3A1A] px-6 py-3 font-semibold border border-[#FAD6A5]/50 shadow-lg hover:bg-white hover:scale-105 transition-all duration-300"
                  >
                    <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="bg-[#fff7ee] py-12">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[32px] border border-[#FAD6A5]/30 bg-[#FFFBF5]/80 backdrop-blur-md p-3 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <img
                  src={illustration}
                  alt="Temple Crowd"
                  className="h-[430px] w-full rounded-[24px] object-cover transition-transform duration-700 hover:scale-105"
                />
                {/* Subtle gradient overlay to enhance depth */}
                <div className="absolute inset-3 rounded-[24px] bg-gradient-to-t from-[#5D3A1A]/20 via-transparent to-transparent" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative bg-[#FFFBF5] rounded-3xl border border-[#FAD6A5] shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                  <div>
                      <h3 className="text-3xl font-black text-[#5D3A1A]">
                        Real-Time Temple Status
                      </h3>
                      <p className="text-[#8B7355] mt-1 font-medium">
                        Updated directly from the temple monitoring system.
                      </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[#E8F0E8] border border-[#CDE0CD] px-4 py-2 shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4A7C4A] animate-pulse"></span>
                    <span className="text-[#3E653E] font-bold text-xs uppercase tracking-wider">
                      Live Status
                    </span>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Card Definition Helper */}
                {[
                  {
                    title: "Current Visitors",
                    value: crowd.current_visitors?.toLocaleString() || "0",
                    icon: Users,
                    bg: "bg-[#FFFBF5]/90", // Creamy Saffron
                    border: "border-[#FAD6A5]/50",
                    text: "text-[#5D3A1A]", // Rich Brown
                    iconBg: "bg-[#FAD6A5]/30",
                    iconColor: "text-[#B45309]",
                  },
                  {
                    title: "Waiting Time",
                    value: `${crowd.wait_time} min`,
                    icon: Clock3,
                    bg: "bg-[#FDF9F5]/90", // Soft Amber
                    border: "border-[#FDE68A]/50",
                    text: "text-[#854D0E]",
                    iconBg: "bg-[#FDE68A]/30",
                    iconColor: "text-[#D97706]",
                  },
                  {
                    title: "Crowd Status",
                    value: crowd.status,
                    icon: Activity,
                    bg: currentStatus.bg.replace('50', '50/90'), // Keeps status dynamic
                    border: currentStatus.border,
                    text: currentStatus.text,
                    iconBg: "bg-black/5",
                    iconColor: currentStatus.text,
                  },
                  {
                    title: "Expected Today",
                    value: crowd.expected_today?.toLocaleString() || "0",
                    icon: TrendingUp,
                    bg: "bg-[#F0F7FF]/90", // Soft Sky
                    border: "border-[#BAE6FD]/50",
                    text: "text-[#0C4A6E]",
                    iconBg: "bg-[#BAE6FD]/30",
                    iconColor: "text-[#0369A1]",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`group relative overflow-hidden rounded-3xl border ${item.bg} ${item.border} backdrop-blur-md p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#8B7355]">
                          {item.title}
                        </p>
                        <h4 className={`mt-2 text-2xl font-black ${item.text}`}>
                          {item.value}
                        </h4>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center`}>
                        <item.icon className={item.iconColor} size={24} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#FAD6A5]/30 flex items-center justify-between">
                {/* Last Updated Section */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAD6A5]/20 flex items-center justify-center">
                    <CalendarDays size={18} className="text-[#92400E]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355]">
                      Last Updated
                    </p>
                    <p className="font-semibold text-[#5D3A1A]">
                      {crowd.last_updated || "Just now"}
                    </p>
                  </div>
                </div>

                {/* Auto Refresh Badge */}
                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAD6A5]/20 border border-[#FAD6A5]/40 text-[#92400E] font-medium text-xs shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#92400E] animate-pulse"></span>
                  Auto Refresh • 30s
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -5 }}
            className="relative mt-10 rounded-3xl border border-[#FAD6A5]/30 bg-[#FFFBF5]/80 backdrop-blur-md p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#FAD6A5]/30 flex items-center justify-center">
                  <CloudSun size={34} className="text-[#92400E]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#5D3A1A]">
                    Weather in Ayodhya
                  </h3>
                  <p className="text-[#8B7355] mt-1 font-medium">
                    Current conditions for your darshan journey.
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355]">
                    Temperature
                  </p>
                  <h3 className="text-4xl font-black text-[#5D3A1A]">
                    {tempVal}
                  </h3>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355]">
                    Condition
                  </p>
                  <h3 className="text-xl font-bold text-[#5D3A1A]">
                    {weather?.condition}
                  </h3>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355]">
                    Travel Advice
                  </p>
                  <span className="inline-block mt-2 rounded-full bg-[#E8F0E8] border border-[#CDE0CD] px-4 py-2 text-[#3E653E] font-bold text-sm">
                    Good Time for Darshan
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}