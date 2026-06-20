import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Users,
  CalendarCheck,
  AlertTriangle,
  CloudSun,
  Search,
  Activity,
} from "lucide-react";
import api from "../../services/api";
import AuthorityNavbar from "../../components/authority/AuthorityNavbar";

export default function AuthorityDashboard() {
  const [stats, setStats] = useState(null);
  const [crowd, setCrowd] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const statsRes = await api.get("/dashboard/summary");
      const crowdRes = await api.get("/public/crowd-status");
      const weatherRes = await axios.get(
        "https://api.open-meteo.com/v1/forecast?latitude=26.7996&longitude=82.2042&current=temperature_2m"
      );

      setStats(statsRes.data);
      setCrowd(crowdRes.data);
      setWeather({ temp: weatherRes.data.current.temperature_2m });
    } catch (error) {
      console.error(error);
    }
  }

  if (!stats || !crowd) {
    return <div className="p-10">Loading Dashboard...</div>;
  }

  const cards = [
    { title: "Total Devotees", value: stats.total_users || 0, icon: Users, color: "from-violet-500 to-purple-600" },
    { title: "Today's Bookings", value: stats.today_bookings || 0, icon: CalendarCheck, color: "from-blue-500 to-cyan-500" },
    { title: "Crowd Status", value: crowd.status, icon: Activity, color: "from-green-500 to-emerald-600" },
    { title: "Active SOS", value: stats.active_sos || 0, icon: AlertTriangle, color: "from-red-500 to-red-600" },
    { title: "Missing Persons", value: stats.missing_cases || 0, icon: Search, color: "from-orange-500 to-amber-600" },
    { title: "Weather", value: weather?.temp + "°C", icon: CloudSun, color: "from-sky-500 to-cyan-500" },
  ];

  return (
    <div className="flex">
      <AuthorityNavbar />

      <main className="ml-72 flex-1 min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-slate-900">Authority Dashboard</h1>
            <p className="text-slate-600 mt-3">Temple Operations Command Center</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl p-6 shadow-sm"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center text-white mb-4`}>
                    <Icon size={26} />
                  </div>
                  <p className="text-slate-500">{card.title}</p>
                  <h2 className="text-4xl font-bold mt-2">{card.value}</h2>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              <button className="p-5 rounded-2xl bg-red-50 hover:bg-red-100 text-left">🚨 View SOS Cases</button>
              <button className="p-5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-left">🧒 Missing Persons</button>
              <button className="p-5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-left">📢 Broadcast Notice</button>
              <button className="p-5 rounded-2xl bg-green-50 hover:bg-green-100 text-left">📈 Risk Analysis</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}