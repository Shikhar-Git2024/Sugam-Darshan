import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  Users, 
  CalendarCheck, 
  Activity, 
  Clock3, 
  CloudSun, 
  RefreshCw, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  MapPin
} from "lucide-react";
import api from "../../services/api";

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
        condition: "Clear Sky",
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
      <section className="py-32 bg-slate-950 flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
          <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">Initializing Telemetry Stream...</p>
        </div>
      </section>
    );
  }

  const visitorsVal = stats.total_visitors ? Number(stats.total_visitors).toLocaleString() : "0";
  const bookingsVal = stats.active_bookings ? Number(stats.active_bookings).toLocaleString() : "0";
  const statusVal = crowd.status ? String(crowd.status).toUpperCase() : "UNKNOWN";
  const waitVal = crowd.wait_time ? `${String(crowd.wait_time)} Min` : "0 Min";
  const tempVal = weather ? `${weather.temperature}°C` : "--";

  return (
    <section className="relative py-32 overflow-hidden bg-slate-950 text-slate-100 selection:bg-violet-500/30">
      {/* Premium Tech Grid Mesh Background Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

      {/* Deep Cyberpunk Dynamic Ambient Glow Components */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* Dynamic Telemetry Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 border-b border-slate-800/60 pb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Live Operations <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Intelligence</span>
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl text-sm md:text-base">
              Real-time synchronization matrix monitoring active visitor throughput, wait thresholds, and regional status controls.
            </p>
          </div>
          
          <div className="flex items-center gap-4 self-start lg:self-auto">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">System Status</p>
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 justify-end mt-0.5">
                <ShieldCheck size={14} /> Operational
              </p>
            </div>
            <button 
              onClick={() => loadData()}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-xs tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin text-cyan-400" : "text-slate-400"} />
              {isRefreshing ? "SYNCING MATRICES..." : "FORCE REFRESH"}
            </button>
          </div>
        </div>

        {/* High-Density Display Dashboard Matrix Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Registered Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 hover:bg-slate-900/80 hover:border-violet-500/40 transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/5 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-300">
                <Users size={22} />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-violet-400/70 bg-violet-500/5 border border-violet-500/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                <TrendingUp size={12} /> +12.4% MoM
              </span>
            </div>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Total Verified Devotees</p>
            <h3 className="text-4xl font-black text-white tracking-tight mt-2 font-mono">
              {visitorsVal}
            </h3>
            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>DB Ledger Sync: Live</span>
              <span className="font-mono text-slate-400">Target 5M</span>
            </div>
          </motion.div>

          {/* Card 2: Active Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 hover:bg-slate-900/80 hover:border-blue-500/40 transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/5 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <CalendarCheck size={22} />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-blue-400/70 bg-blue-500/5 border border-blue-500/10 px-2.5 py-1 rounded-md">
                Active Passes
              </span>
            </div>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Allocated Darshan Slots</p>
            <h3 className="text-4xl font-black text-white tracking-tight mt-2 font-mono">
              {bookingsVal}
            </h3>
            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Token Issuance Rate</span>
              <span className="text-emerald-400 font-semibold">99.98% Cap</span>
            </div>
          </motion.div>

          {/* Card 3: Crowd Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 hover:bg-slate-900/80 hover:border-emerald-500/40 transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/5 border border-emerald-200/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Activity size={22} />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                AI Vision Stream
              </div>
            </div>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Premises Density Threshold</p>
            <div className="flex items-center gap-3 mt-2">
              <h3 className="text-4xl font-black text-white tracking-tight">
                {statusVal}
              </h3>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Flow Speed Matrix</span>
              <span className="text-slate-400 font-medium">Optimal Flow</span>
            </div>
          </motion.div>

          {/* Card 4: Current Wait Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 hover:bg-slate-900/80 hover:border-orange-500/40 transition-colors duration-300 lg:col-span-1 md:col-span-2"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/5 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform duration-300">
                <Clock3 size={22} />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-orange-400/70 bg-orange-500/5 border border-orange-500/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                <Zap size={11} /> High Priority
              </span>
            </div>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Avg Queue Processing Delay</p>
            <h3 className="text-4xl font-black text-white tracking-tight mt-2 font-mono">
              {waitVal}
            </h3>
            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Turnstile Throughput</span>
              <span className="text-slate-400 font-mono">~340 dev/min</span>
            </div>
          </motion.div>

          {/* Card 5: Weather Telemetry */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 hover:bg-slate-900/80 hover:border-sky-500/40 transition-colors duration-300 lg:col-span-2 md:col-span-2"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/5 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform duration-300">
                <CloudSun size={22} />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-sky-400/70 bg-sky-500/5 border border-sky-500/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                <MapPin size={11} /> Ayodhya Region
              </span>
            </div>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Environmental Telemetry</p>
            
            <div className="flex items-baseline gap-4 mt-2">
              <h3 className="text-4xl font-black text-white tracking-tight font-mono">
                {tempVal}
              </h3>
              <p className="text-slate-400 font-medium text-sm flex items-center gap-1.5">
                • {weather ? weather.condition : "Retrieving Weather Sensors"}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Operational Conditions</span>
              <span className="text-sky-400 font-semibold">Perfect for Darshan</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}