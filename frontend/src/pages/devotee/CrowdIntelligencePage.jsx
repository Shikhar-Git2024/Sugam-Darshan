import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock3, CalendarDays, TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import api from "../../services/api";

export default function CrowdIntelligencePage() {
  const [crowd, setCrowd] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [crowdRes, forecastRes] = await Promise.all([
        api.get("/public/crowd-status"),
        api.get("/public/forecast")
      ]);
      setCrowd(crowdRes.data);
      setForecast(forecastRes.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Unified status colors based on your Amber/Orange theme
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'low': return 'text-emerald-600';
      case 'moderate': return 'text-amber-600';
      case 'high': return 'text-orange-600';
      default: return 'text-slate-800';
    }
  };

  const bestDay = forecast.length > 0 ? forecast.reduce((a, b) => a.crowd < b.crowd ? a : b) : null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Crowd Intelligence</h1>
          <p className="mt-2 text-slate-500">AI-powered forecasting for smarter Darshan planning.</p>
        </motion.div>

        {/* Live Status Cards */}
        {crowd && (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, label: "Current Status", val: crowd.status, color: getStatusColor(crowd.status) },
              { icon: Clock3, label: "Estimated Wait", val: `${crowd.wait_time} Min`, color: "text-slate-800" },
              { icon: CalendarDays, label: "Recommended Slot", val: crowd.recommended_slot, color: "text-slate-800" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <item.icon className="text-orange-500 mb-4" size={24} />
                <p className="text-slate-500 text-sm font-medium">{item.label}</p>
                <h3 className={`text-3xl font-bold mt-1 ${item.color}`}>{item.val}</h3>
              </div>
            ))}
          </div>
        )}

        {/* Forecast Chart */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-orange-600" />
            <h2 className="text-2xl font-bold text-slate-800">Weekly Forecast</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="crowd" 
                  stroke="#ea580c" // Orange-600
                  fill="#ffedd5"   // Orange-100
                  strokeWidth={3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Day Recommendation */}
        {bestDay && (
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-10 text-white shadow-xl">
            <p className="text-orange-100 font-semibold uppercase tracking-widest text-sm">Optimal Planning</p>
            <h2 className="text-4xl font-bold mt-2">Best Day To Visit: {bestDay.day}</h2>
            <div className="flex gap-8 mt-6">
              <div>
                <p className="text-orange-100 text-sm">Expected Crowd</p>
                <p className="text-2xl font-bold">{bestDay.crowd} visitors</p>
              </div>
              <div>
                <p className="text-orange-100 text-sm">Est. Wait Time</p>
                <p className="text-2xl font-bold">10-15 Min</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}