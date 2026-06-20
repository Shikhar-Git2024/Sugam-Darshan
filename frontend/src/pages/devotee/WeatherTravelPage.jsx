import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  CloudSun, Thermometer, Wind, Droplets, AlertTriangle, 
  CheckCircle2, Calendar, MapPin, Navigation 
} from "lucide-react";

export default function WeatherTravelPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

  async function loadWeather() {
    try {
      const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast?latitude=26.7996&longitude=82.2042&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto"
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-10 text-center text-orange-800">Loading blessings and weather updates...</div>;

  const { current, daily } = weather;
  const advisory = current.temperature_2m > 38 ? "Heat Alert: Plan your visit during early morning or late evening." : "The weather is pleasant for your Darshan.";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Weather & Travel</h1>
          <p className="text-slate-500 mt-2">Plan your pilgrimage with real-time local updates.</p>
        </header>

        {/* Current Weather Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Temperature", val: `${current.temperature_2m}°C`, icon: CloudSun, color: "text-amber-600" },
            { label: "Humidity", val: `${current.relative_humidity_2m}%`, icon: Droplets, color: "text-blue-600" },
            { label: "Wind Speed", val: `${current.wind_speed_10m} km/h`, icon: Wind, color: "text-cyan-600" },
            { label: "Feels Like", val: `${Math.round(current.temperature_2m + 2)}°C`, icon: Thermometer, color: "text-red-600" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <item.icon className={`${item.color} mb-3`} size={24} />
              <p className="text-sm text-slate-500">{item.label}</p>
              <h3 className="text-2xl font-bold mt-1">{item.val}</h3>
            </div>
          ))}
        </div>

        {/* Advisory Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-amber-700 via-orange-800 to-red-900 rounded-3xl p-8 text-white shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-amber-200" />
            <h2 className="text-2xl font-semibold">Travel Advisory</h2>
          </div>
          <p className="text-amber-50 text-lg mb-6">{advisory}</p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {["Carry a water bottle", "Use a cap or umbrella", "Arrive 30 mins early", "Keep your booking digital pass ready"].map((tip, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <CheckCircle2 size={16} className="text-amber-200" /> {tip}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Forecast Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">7-Day Outlook</h2>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {daily.time.slice(0, 7).map((date, i) => (
              <div key={date} className="bg-slate-50 p-4 rounded-2xl text-center">
                <p className="text-xs font-semibold uppercase text-slate-400">{new Date(date).toLocaleDateString("en-IN", { weekday: 'short' })}</p>
                <p className="text-xl font-bold text-orange-900 mt-2">{daily.temperature_2m_max[i]}°</p>
                <p className="text-sm text-slate-500">{daily.temperature_2m_min[i]}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}