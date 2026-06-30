import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  CalendarDays, 
  Users, 
  Info, 
  ArrowLeft, 
  CloudSun, 
  Compass, 
  Flame, 
  Moon, 
  Sun, 
  Palette, 
  Flower2, 
  CloudRain, 
  Thermometer,
  AlertTriangle,
  Loader2 // Safely added to fix the reference crash
} from "lucide-react";
import api from "../../services/api";

// Master Festival Database synchronized across your components
const FESTIVAL_DATABASE = [
  { date: "2026-01-14", name: "Uttarayan / Makar Sankranti" },
  { date: "2026-01-23", name: "Vasant Panchami" },
  { date: "2026-02-01", name: "Maghi Purnima" },
  { date: "2026-02-15", name: "Mahashivratri" },
  { date: "2026-03-02", name: "Holi / Purnima" },
  { date: "2026-03-03", name: "Dhuleti / Vasantotsav" },
  { date: "2026-03-19", name: "Gudi Padwa / Chaitra Starts" },
  { date: "2026-03-26", name: "Ram Navami" },
  { date: "2026-04-02", name: "Shree Hanuman Jayanti" },
  { date: "2026-04-19", name: "Akshaya Tritiya" },
  { date: "2026-05-01", name: "Buddha Purnima" },
  { date: "2026-06-16", name: "Ram Rathotsav - Rath Yatra" },
  { date: "2026-06-29", name: "Devsnan Purnima" },
  { date: "2026-07-25", name: "Devpodhi Ekadashi / Gauri Vrata Starts" },
  { date: "2026-07-29", name: "Guru Purnima / Vyas Purnima" },
  { date: "2026-08-28", name: "Rakshabandhan / Nariyeli Purnima" },
  { date: "2026-09-04", name: "Janmashtami – Shree Krishna Jayanti" },
  { date: "2026-09-14", name: "Ganesh Chaturthi" },
  { date: "2026-10-11", name: "Navaratri Starts" },
  { date: "2026-10-20", name: "Dashera (Victory Day of Shri Rama)" },
  { date: "2026-10-25", name: "Sharad Purnima" },
  { date: "2026-11-06", name: "Dhanterash" },
  { date: "2026-11-08", name: "Diwali (Shri Rama Back in Ayodhya)" },
  { date: "2026-11-10", name: "New Year (Coronation Day)" },
  { date: "2026-11-24", name: "Dev Diwali / Purnima" },
  { date: "2026-12-23", name: "Purnima / Shri Dattatrey Jayanti" }
];

export default function RecommendationPage() {
  const navigate = useNavigate();
  const [forecast, setForecast] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookingType, setBookingType] = useState("DARSHAN");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-scroll anchor viewport to top on initial page mount routing
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchForecast();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate, bookingType]);

  const fetchForecast = async () => {
    try {
      const res = await api.get("/public/forecast");
      setForecast(res.data);
      if (res.data.length > 0) {
        const bestDay = [...res.data].sort((a, b) => a.crowd - b.crowd)[0];
        setSelectedDate(bestDay.date);
      }
    } catch (error) {
      console.error("Error drawing operational forecast metrics:", error);
    }
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/available-slots?visit_date=${selectedDate}&booking_type=${bookingType}`);
      setSlots(res.data.slots || []);
    } catch (error) {
      console.error("Error mapping available capacity intervals:", error);
    } finally {
      setLoading(false);
    }
  };

  const bestDay = useMemo(() => {
    return forecast.length > 0 ? [...forecast].sort((a, b) => a.crowd - b.crowd)[0] : null;
  }, [forecast]);

  // Dynamic cross-reference check mapping for the active selected day's festival context
  const activeDayFestivalContext = useMemo(() => {
    if (!selectedDate) return null;
    return FESTIVAL_DATABASE.find(f => f.date === selectedDate) || null;
  }, [selectedDate]);

  // Option Y Weather Simulation Engine based on algorithmic time keywords
  const simulateWeather = (slotName) => {
    const timeLower = slotName.toLowerCase();
    if (timeLower.includes("am") || timeLower.includes("morning") || timeLower.includes("06:") || timeLower.includes("08:")) {
      return { condition: "Pleasant & Clear", temp: "24°C", icon: <CloudSun size={16} className="text-sky-500" /> };
    }
    if (timeLower.includes("12:") || timeLower.includes("01:") || timeLower.includes("02:") || timeLower.includes("pm") && (timeLower.includes("1") || timeLower.includes("2") || timeLower.includes("3"))) {
      return { condition: "Sunny & Warm", temp: "34°C", icon: <Sun size={16} className="text-amber-500" /> };
    }
    if (timeLower.includes("evening") || timeLower.includes("04:") || timeLower.includes("05:") || timeLower.includes("06:")) {
      return { condition: "Cool Breeze", temp: "27°C", icon: <CloudSun size={16} className="text-orange-500" /> };
    }
    return { condition: "Clear Sky", temp: "22°C", icon: <Moon size={16} className="text-indigo-400" /> };
  };

  const handleContinue = () => {
    if (!selectedSlot) return;
    navigate("/devotee/booking", {
      state: { bookingType, visitDate: selectedDate, slot: selectedSlot.slot },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-amber-50/20 p-4 md:p-8 text-slate-800 antialiased selection:bg-orange-100 pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Native Internal Router Back Controller Wrapper */}
        <div className="flex items-center justify-start">
          <Link 
            to="/devotee/dashboard" 
            className="inline-flex items-center gap-2.5 text-base font-black text-slate-500 hover:text-slate-900 transition bg-white/80 hover:bg-white px-5 py-2.5 rounded-2xl border border-slate-200/60 shadow-xs cursor-pointer group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Premium Giant Header Box Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-xs tracking-widest uppercase">
              <Compass size={16} className="animate-spin-slow" />
              AI Intelligent Router
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Plan Your Darshan</h1>
            <p className="text-base font-semibold text-slate-500 leading-normal">
              AI-powered insights computing crowd densities and ambient climate variables to secure serene travel slots.
            </p>
          </div>

          {/* Large Interactive Switch Toggles */}
          <div className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl shadow-md w-fit self-start md:self-center">
            {["DARSHAN", "AARTI"].map((type) => (
              <button
                key={type}
                onClick={() => { setBookingType(type); setSelectedSlot(null); }}
                className={`px-6 py-2.5 rounded-xl font-black text-sm tracking-wide transition-all cursor-pointer ${
                  bookingType === type 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Contextual Festival Alert Banner Block */}
        <AnimatePresence>
          {activeDayFestivalContext && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80 rounded-2xl p-5 flex items-start gap-4 shadow-3xs text-base font-bold text-orange-900"
            >
              <div className="p-2 bg-orange-500 text-white rounded-xl shadow-3xs shrink-0 mt-0.5 animate-pulse">
                <Sparkles size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-orange-950 tracking-tight">Ritual Day Pre-Booking Alert!</h4>
                <p className="text-sm font-semibold text-orange-800/90 leading-relaxed">
                  The selected date ({selectedDate}) intersects with <strong className="text-orange-600 font-extrabold">{activeDayFestivalContext.name}</strong>. 
                  Expect localized queue rerouting patterns and massive celebratory footfall increases during evening modules.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Horizontal Scrollable Calendar Date Selection strip layout */}
        <div className="space-y-3">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays size={20} className="text-orange-600" />
            Select Target Visit Window
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
            {forecast.map((f) => {
              const isSelected = selectedDate === f.date;
              const isBest = bestDay?.date === f.date;
              return (
                <button
                  key={f.date}
                  onClick={() => { setSelectedDate(f.date); setSelectedSlot(null); }}
                  className={`p-4 rounded-2xl border transition-all text-left min-w-[140px] shrink-0 flex flex-col justify-between h-24 cursor-pointer relative ${
                    isSelected 
                      ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                      : "bg-white border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isSelected ? "text-orange-400" : "text-slate-400"}`}>{f.day}</p>
                    <p className="text-sm font-black mt-0.5">{f.date}</p>
                  </div>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}>
                      {f.crowd_level}
                    </span>
                    {isBest && <Sparkles size={14} className="text-amber-400 fill-amber-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Smart Insight Panel Card Wrapper */}
        {bestDay && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950 rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-5 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-600 rounded-lg text-white shadow-xs">
                <Sparkles size={16} />
              </div>
              <h2 className="text-lg md:text-xl font-black tracking-tight">AI Serenity Core Evaluation</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2 border-t border-slate-800/80">
              {[
                { label: "Optimal Visit Window", value: bestDay.day, sub: bestDay.date },
                { label: "Predicted Footfall", value: `${bestDay.crowd} Devotees`, sub: "Peak Index" },
                { label: "Est. Queue Processing", value: `${bestDay.expected_wait} Mins`, sub: "Transit Time" },
                { label: "Density Code", value: bestDay.crowd_level, sub: "Highly Recommended" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{item.label}</p>
                  <p className="text-lg md:text-xl font-black text-orange-400 tracking-tight">{item.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Widescreen Micro-Hover Matrix Capacity Slots Sheet Container */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Available Time Windows</h2>
          
          {loading ? (
            <div className="flex items-center gap-2 text-slate-500 py-12 font-bold text-base bg-white rounded-2xl border border-slate-100 justify-center">
              <Loader2 className="animate-spin text-orange-600" size={18} />
              Parsing real-time allocation matrices...
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-bold text-base bg-white rounded-2xl border border-dashed border-slate-200">
              No available quota permits found for this specific date matrix setup.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.slot === slot.slot;
                const weather = simulateWeather(slot.slot);
                
                return (
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.04)" }}
                    whileTap={{ scale: 0.99 }}
                    key={slot.slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between h-44 cursor-pointer relative ${
                      isSelected 
                        ? "border-orange-600 bg-amber-50/50 shadow-xs ring-2 ring-orange-500/10" 
                        : "border-slate-200/80 bg-white hover:border-orange-300"
                    }`}
                  >
                    {/* Top Row: Time and Weather Simulation Attributes */}
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-extrabold text-slate-900 text-lg md:text-xl tracking-tight leading-none">{slot.slot}</h3>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/50 shadow-3xs text-xs font-bold text-slate-600 shrink-0">
                        {weather.icon}
                        <span>{weather.temp}</span>
                      </div>
                    </div>

                    {/* Middle Row: Simulated Condition Note */}
                    <p className="text-xs text-slate-400 font-bold -mt-3">
                      Climate: <span className="text-slate-600">{weather.condition}</span>
                    </p>

                    {/* Bottom Status Blocks Container */}
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center w-full">
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Crowd Code</p>
                        <span className="text-sm font-black text-orange-700">{slot.crowd_level}</span>
                      </div>
                      <div className="text-right space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Remaining Quota</p>
                        <span className="text-sm font-black text-slate-800">{slot.remaining_capacity} passes</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Global Floating Actions Panel Trigger Block */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="pt-4"
            >
              <button
                onClick={handleContinue}
                className="w-full py-4 rounded-2xl bg-orange-700 hover:bg-orange-800 text-white font-extrabold text-base transition-colors shadow-lg shadow-orange-700/10 cursor-pointer tracking-wide"
              >
                Confirm Intent and Continue Selection
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}