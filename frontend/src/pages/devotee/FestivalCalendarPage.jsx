import { motion } from "framer-motion";
import {
  CalendarDays, Clock3, Users, AlertTriangle, Sparkles, MapPin
} from "lucide-react";

export default function FestivalCalendarPage() {
  const festivals = [
    { name: "Guru Purnima", date: "2026-07-19", crowd: "High", wait: "60+ Min", daysLeft: 35 },
    { name: "Shravan Month", date: "2026-07-25", crowd: "Very High", wait: "90+ Min", daysLeft: 41 },
    { name: "Janmashtami", date: "2026-09-04", crowd: "High", wait: "70+ Min", daysLeft: 82 },
    { name: "Dussehra", date: "2026-10-20", crowd: "Moderate", wait: "40 Min", daysLeft: 128 },
    { name: "Diwali", date: "2026-11-08", crowd: "Extreme", wait: "120+ Min", daysLeft: 147 },
  ];

  const nextFestival = festivals[0];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Festival Calendar</h1>
          <p className="mt-2 text-slate-500">Plan your pilgrimage around upcoming festivals and crowd patterns.</p>
        </motion.header>

        {/* Next Festival Highlight */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-amber-700 via-orange-800 to-red-900 text-white rounded-3xl p-8 shadow-xl"
        >
          <Sparkles className="text-amber-300 mb-4" size={32} />
          <p className="text-amber-100 font-medium tracking-wide uppercase text-sm">Upcoming Major Event</p>
          <h2 className="text-3xl font-bold mt-2">{nextFestival.name}</h2>
          <p className="text-amber-50 mt-1 text-lg">Starts in {nextFestival.daysLeft} days</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Festivals", val: festivals.length, icon: CalendarDays, color: "text-amber-600" },
            { label: "Peak Crowd", val: "120k+", icon: Users, color: "text-blue-600" },
            { label: "Max Wait", val: "2 hrs", icon: Clock3, color: "text-green-600" },
            { label: "Risk Level", val: "High", icon: AlertTriangle, color: "text-red-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <stat.icon className={`${stat.color} mb-3`} size={24} />
              <p className="text-sm text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.val}</h3>
            </div>
          ))}
        </div>

        {/* Festival List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Upcoming Schedule</h2>
          {festivals.map((f, i) => (
            <motion.div 
              key={i} 
              whileHover={{ x: 4 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-800">{f.name}</h3>
                <p className="text-sm text-slate-500">{f.date}</p>
              </div>
              <div className="flex gap-8 text-right">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Crowd</p>
                  <p className="font-semibold text-orange-800">{f.crowd}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Wait</p>
                  <p className="font-semibold">{f.wait}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Advisory */}
        <div className="bg-white border border-orange-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-orange-900 mb-6">Festival Travel Advisory</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Book darshan slots early during festivals",
              "Reach 1-2 hours before reporting time",
              "Use crowd intelligence before travel",
              "Carry water and essentials"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-600">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}