import { motion } from "framer-motion";
import { Brain, Users, Clock3, TrendingUp, AlertCircle } from "lucide-react";

// Expanded architecture data
const templeAreas = [
  { id: "garbh", name: "Garbh Griha", crowd: 95, wait: "25 Min", x: 45, y: 45, r: 8 },
  { id: "nritya", name: "Nritya Mandap", crowd: 75, wait: "18 Min", x: 45, y: 30, w: 10, h: 8 },
  { id: "sabha", name: "Sabha Mandap", crowd: 65, wait: "15 Min", x: 45, y: 58, w: 12, h: 10 },
  { id: "rang", name: "Rang Mandap", crowd: 55, wait: "12 Min", x: 45, y: 72, w: 12, h: 8 },
  { id: "kirtan", name: "Kirtan Mandap", crowd: 35, wait: "8 Min", x: 45, y: 84, w: 12, h: 8 },
  { id: "shikhar", name: "Main Shikhar", crowd: 85, wait: "20 Min", x: 45, y: 45, r: 4, isShikhar: true },
  { id: "small1", name: "Temple A", crowd: 45, wait: "10 Min", x: 20, y: 20, w: 8, h: 8 },
  { id: "small2", name: "Temple B", crowd: 40, wait: "9 Min", x: 70, y: 20, w: 8, h: 8 },
];

function getColor(crowd) {
  if (crowd < 40) return "#22c55e"; // Green
  if (crowd < 70) return "#eab308"; // Yellow
  return "#ef4444"; // Red
}

export default function EnhancedCrowdMap() {
  const bestArea = templeAreas.reduce((a, b) => (a.crowd < b.crowd ? a : b));

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Temple Crowd Live-Map</h1>
          <p className="text-slate-500 mt-2">Real-time occupancy and wait-time analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Zones", val: templeAreas.length, icon: Users, color: "text-violet-600" },
            { label: "High Density", val: templeAreas.filter(x => x.crowd > 70).length, icon: TrendingUp, color: "text-red-500" },
            { label: "Avg Wait", val: "18 Min", icon: Clock3, color: "text-blue-500" },
            { label: "Optimal Zone", val: bestArea.name, icon: Brain, color: "text-green-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <stat.icon className={`mb-2 ${stat.color}`} />
              <p className="text-sm text-slate-400">{stat.label}</p>
              <h2 className="text-xl font-bold">{stat.val}</h2>
            </div>
          ))}
        </div>

        {/* Architectural View */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
          <svg viewBox="0 0 100 100" className="w-full h-[500px] overflow-visible">
            {/* Parikrama Path */}
            <rect x="5" y="5" width="90" height="90" rx="10" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
            
            {templeAreas.map((area) => (
              <motion.g key={area.id} whileHover={{ scale: 1.05 }} className="cursor-pointer">
                {area.r ? (
                  <circle cx={area.x} cy={area.y} r={area.r} fill={getColor(area.crowd)} />
                ) : (
                  <rect x={area.x} y={area.y} width={area.w} height={area.h} rx="3" fill={getColor(area.crowd)} />
                )}
                <text x={area.x} y={area.y - (area.r || 0) - 2} textAnchor="middle" fontSize="3" className="font-semibold fill-slate-700">
                  {area.name}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>

        {/* Smart Recommendations */}
        <div className="mt-8 bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="text-yellow-400" /> AI Optimization
            </h2>
            <p className="mt-2 text-slate-300 max-w-lg">
              Based on current flow, we suggest diverting to <b>{bestArea.name}</b>. It is currently operating at only {bestArea.crowd}% capacity.
            </p>
          </div>
          <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition">
            View Directions
          </button>
        </div>
      </div>
    </div>
  );
}