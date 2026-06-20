import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock3, CloudSun, MapPin } from "lucide-react";
import api from "../../services/api";
import axios from "axios";

export default function WelcomeSection() {
  const [crowd, setCrowd] = useState(null);
  const [weather, setWeather] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [crowdResponse, weatherResponse] = await Promise.all([
        api.get("/public/crowd-status"),
        axios.get("https://api.open-meteo.com/v1/forecast?latitude=26.7996&longitude=82.2042&current=temperature_2m")
      ]);
      setCrowd(crowdResponse.data);
      setWeather({ temperature: Math.round(weatherResponse.data.current.temperature_2m) });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Pranam, Good Morning";
    if (hour < 17) return "Pranam, Good Afternoon";
    return "Pranam, Good Evening";
  };

  return (
    <section className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] p-8 bg-gradient-to-br from-amber-700 via-orange-800 to-red-900 text-white shadow-2xl"
      >
        {/* Subtle Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 text-amber-100">
            <MapPin size={16} />
            <span className="text-sm tracking-wide uppercase">Shri Ram Janmabhoomi Mandir</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-medium">
            {getGreeting()}, {user?.name || "Devotee"}
          </h1>
          
          <p className="mt-2 text-amber-50/80 text-lg max-w-lg">
            May your visit be peaceful. Here is the latest update to help you plan your Darshan smoothly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { label: "Crowd Status", value: crowd?.status || "Normal", icon: Users },
              { label: "Wait Time", value: crowd?.wait_time ? `${crowd.wait_time} Min` : "--", icon: Clock3 },
              { label: "Local Weather", value: weather ? `${weather.temperature}°C` : "--", icon: CloudSun },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-2 text-amber-100 mb-2">
                  <item.icon size={18} />
                  <span className="text-sm font-medium opacity-90">{item.label}</span>
                </div>
                <h3 className="text-2xl font-semibold text-white">{item.value}</h3>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}