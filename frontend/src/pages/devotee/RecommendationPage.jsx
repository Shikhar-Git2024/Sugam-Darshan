import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, CalendarDays, Compass, CheckCircle2, 
  CloudSun, Sun, CloudRain, 
  Thermometer, ArrowRight, Lightbulb
} from "lucide-react";
import axios from "axios";
import api from "../../services/api";

const FESTIVAL_DATABASE = [
  { date: "2026-01-14", name: "Uttarayan / Makar Sankranti" },
  { date: "2026-01-23", name: "Vasant Panchami" },
  { date: "2026-02-01", name: "Maghi Purnima" },
  { date: "2026-02-15", name: "Mahashivratri" },
  { date: "2026-03-02", name: "Holi / Purnima" },
  { date: "2026-03-26", name: "Ram Navami" },
  { date: "2026-04-02", name: "Shree Hanuman Jayanti" },
  { date: "2026-06-16", name: "Ram Rathotsav - Rath Yatra" },
  { date: "2026-07-29", name: "Guru Purnima / Vyas Purnima" },
  { date: "2026-09-04", name: "Janmashtami – Shree Krishna Jayanti" },
  { date: "2026-10-20", name: "Dashera (Victory Day of Shri Rama)" },
  { date: "2026-11-08", name: "Diwali (Shri Rama Back in Ayodhya)" },
  { date: "2026-11-10", name: "New Year (Coronation Day)" },
  { date: "2026-11-24", name: "Dev Diwali" }
];

const HOUR_MAPPING = {
  "07:00 AM - 09:00 AM": 8,
  "09:00 AM - 11:00 AM": 10,
  "11:00 AM - 12:00 PM": 11,
  "01:00 PM - 03:00 PM": 14,
  "03:00 PM - 05:00 PM": 16,
  "05:00 PM - 07:00 PM": 18,
  "07:00 PM - 09:00 PM": 20,
  "MANGAL AARTI": 4,
  "SHRINGAR AARTI": 6,
  "SHAYAN AARTI": 22
};

export default function RecommendationPage() {
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState("DARSHAN");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [weatherForecastMap, setWeatherForecastMap] = useState({});
  const [backendSlots, setBackendSlots] = useState([]);
  const [aiForecastData, setAiForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  const dynamicSevenDays = useMemo(() => {
    const sequence = [];
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + i);
      
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      sequence.push({
        date: formattedDate,
        dayName: i === 0 ? "Today" : weekdays[targetDate.getDay()]
      });
    }
    return sequence;
  }, []);

  useEffect(() => {
    if (dynamicSevenDays.length > 0) {
      setSelectedDate(dynamicSevenDays[0].date);
    }
    window.scrollTo(0, 0);
  }, [dynamicSevenDays]);

  useEffect(() => {
    async function fetchWeatherTrack() {
      try {
        const weatherRes = await axios.get("https://api.weatherapi.com/v1/forecast.json", {
          params: { key: "e925dc04f434469e90c42358260307", q: "Kanpur", days: 7, aqi: "no" }
        });

        const apiForecastDays = weatherRes.data?.forecast?.forecastday || [];
        const freshWeatherMap = {};

        dynamicSevenDays.forEach((day) => {
          const matchingApiData = apiForecastDays.find(fd => fd.date === day.date);
          if (matchingApiData) {
            freshWeatherMap[day.date] = {
              avgTemp: matchingApiData.day.avgtemp_c,
              conditionText: matchingApiData.day.condition.text,
              humidity: matchingApiData.day.avghumidity,
              chanceOfRain: matchingApiData.day.daily_chance_of_rain,
              hourlyArray: matchingApiData.hour,
              windSpeed: matchingApiData.day.maxwind_kph,
              uv: matchingApiData.day.uv,
            };
          }
        });
        setWeatherForecastMap(freshWeatherMap);
      } catch (err) {
        console.error("Weather data offline:", err);
      }
    }
    if (dynamicSevenDays.length > 0) fetchWeatherTrack();
  }, [dynamicSevenDays]);

  useEffect(() => {
    async function fetchDatabaseCapacityMetrics() {
      setLoading(true);
      try {
        const slotsRes = await api.get(`/available-slots?visit_date=${selectedDate}&booking_type=${bookingType}`);
        if (slotsRes.data?.success) {
          setBackendSlots(slotsRes.data.slots || []);
        }

        const forecastRes = await api.get("/public/forecast");
        if (forecastRes.data) {
          setAiForecastData(forecastRes.data);
        }
      } catch (err) {
        console.error("Database connection fault:", err);
      } finally {
        setLoading(false);
      }
    }
    if (selectedDate) fetchDatabaseCapacityMetrics();
  }, [selectedDate, bookingType]);

  const integratedSlotsList = useMemo(() => {
    const activeWeatherDay = weatherForecastMap[selectedDate];

    return backendSlots.map((dbSlot) => {
      const hourIndex = HOUR_MAPPING[dbSlot.slot] ?? 12;
      let liveTemp = "24°C";
      let liveCondition = "Clear";

      if (activeWeatherDay?.hourlyArray) {
        const hourData = activeWeatherDay.hourlyArray[hourIndex];
        if (hourData) {
          liveTemp = `${Math.round(hourData.temp_c)}°C`;
          liveCondition = hourData.condition?.text || "Clear";
        }
      }

      return {
        ...dbSlot,
        temp: liveTemp,
        condition: liveCondition
      };
    });
  }, [backendSlots, selectedDate, weatherForecastMap]);

  const activeDayFestivalContext = useMemo(() => {
    return FESTIVAL_DATABASE.find(f => f.date === selectedDate) || null;
  }, [selectedDate]);

  const dynamicAIRecommendation = useMemo(() => {
    if (aiForecastData.length === 0) return null;

    const sortedForecast = [...aiForecastData].sort((a, b) => a.crowd - b.crowd);
    const bestDayItem = sortedForecast[0];

    const weekdayMapping = { Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };
    const bestDayName = weekdayMapping[bestDayItem.day] || bestDayItem.day;

    const bestWeather = weatherForecastMap[bestDayItem.date];
    const computedTempText = bestWeather ? `${Math.round(bestWeather.avgTemp)}°C` : "24°C";
    const computedCondition = bestWeather ? bestWeather.conditionText : "Clear";

    const suggestedTimeSlot = bookingType === "DARSHAN" ? "07:00 AM - 09:00 AM" : "MANGAL AARTI";

    const dateObj = new Date(bestDayItem.date);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedOutletDate = `${bestDayName}, ${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}`;

    return {
      date: bestDayItem.date,
      dayString: formattedOutletDate,
      timeSlot: suggestedTimeSlot,
      crowdCount: bestDayItem.crowd,
      waitTime: bestDayItem.expected_wait,
      level: bestDayItem.crowd_level,
      score: 96,
      reason: `Our forecast highlights ${bestDayName} as the best day for your visit. It features the lowest crowd volumes of the week with an expected wait time of just ${bestDayItem.expected_wait} minutes. The weather looks clear at around ${computedTempText} (${computedCondition}) to ensure a comfortable experience.`,
    };
  }, [aiForecastData, weatherForecastMap, bookingType]);

  const activeDaySummary = useMemo(() => {
    const match = aiForecastData.find(c => c.date === selectedDate);
    const weatherMatch = weatherForecastMap[selectedDate];
    const dateObj = new Date(selectedDate);
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    return {
      dayName: isNaN(dateObj.getDay()) ? "---" : weekdays[dateObj.getDay()],
      timeSlot: selectedSlot ? selectedSlot.slot : "None Selected",
      crowdLevel: match ? match.crowd_level : "LOW",
      waitTime: match ? `${match.expected_wait} mins` : "15 mins",
      temp: weatherMatch ? `${Math.round(weatherMatch.avgTemp)}°C` : "24°C",
      score: match ? (match.crowd_level === "LOW" ? 96 : match.crowd_level === "MODERATE" ? 84 : 65) : 90
    };
  }, [selectedDate, selectedSlot, aiForecastData, weatherForecastMap]);

  const renderWeatherIcon = (conditionText = "") => {
    const text = conditionText.toLowerCase();
    if (text.includes("sunny") || text.includes("clear")) {
      return <Sun size={15} className="text-amber-600" />;
    }
    if (text.includes("rain") || text.includes("drizzle") || text.includes("shower")) {
      return <CloudRain size={15} className="text-[#ea580c]" />;
    }
    return <CloudSun size={15} className="text-slate-700" />;
  };

  const getCrowdChip = (level = "LOW") => {
    const norm = level.toUpperCase();
    if (norm === "LOW") {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-tight px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> BEST CHOICE
        </span>
      );
    }
    if (norm === "MODERATE" || norm === "NORMAL") {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-tight px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> MODERATE CROWD
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-tight px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> PEAK DAY
      </span>
    );
  };

  const handleContinueSelection = () => {
    if (!selectedSlot) return;
    navigate("/devotee/booking", {
      state: { bookingType, visitDate: selectedDate, slot: selectedSlot.slot },
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-gradient-to-b from-[#FFFDF8] via-[#FFF9F2] to-[#F8FAFC] w-full">
      
      {/* ==================== CORE PLATFORM CONTENT CONTAINER ==================== */}
      <main className="p-4 md:p-6 space-y-8 flex-1 max-w-5xl w-full mx-auto text-left text-slate-900 antialiased">
        
        {/* HEADER SECTION */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#ea580c] font-bold text-xs tracking-wider uppercase">
              <Compass size={14} className="text-[#ea580c]" />
              Sugam Darshan Planner
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 m-0">Plan Your Darshan</h1>
            <p className="text-xs font-semibold text-slate-600 m-0">
              Choose your preferred date and time. Recommendations are based on crowd levels, weather, and slot availability.
            </p>
          </div>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 self-start md:self-center">
            {["DARSHAN", "AARTI"].map((type) => (
              <button
                key={type}
                onClick={() => { setBookingType(type); setSelectedSlot(null); }}
                className={`px-4 py-2 rounded-md font-bold text-xs tracking-wider transition-all cursor-pointer border-0 uppercase ${
                  bookingType === type 
                    ? "bg-[#ea580c] text-white shadow-xs" 
                    : "text-slate-700 hover:text-slate-900 bg-transparent"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== BOOKING JOURNEY PROGRESS INDICATOR ==================== */}
        <div className="w-full bg-white rounded-xl border border-[#f3e3c3] p-4 shadow-xs max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative px-6 md:px-12">

            <div className="absolute left-12 right-12 top-4 h-[2px] bg-[#f3e3c3] z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-black text-sm shadow-sm ring-4 ring-[#fffbeb]">
                1
              </div>
              <span className="mt-2 text-xs font-bold text-slate-900">
                Plan Visit
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-[#d6d3d1] text-slate-500 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="mt-2 text-xs font-medium text-slate-500">
                Booking
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-[#d6d3d1] text-slate-500 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="mt-2 text-xs font-medium text-slate-500">
                Confirmation
              </span>
            </div>

          </div>
        </div>

        {/* ==================== HERO: AI RECOMMENDED PLAN ==================== */}
        <AnimatePresence mode="wait">
          {dynamicAIRecommendation && (
            <motion.div 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl p-5 border shadow-3xs bg-[#fffbeb] border-[#f3e3c3] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3e3c3]/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#fffdf6] border border-[#f3e3c3] rounded-lg text-[#ea580c] shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight text-slate-900 m-0">✨ AI Recommended Plan</h3>
                    <p className="text-xs text-slate-600 m-0 font-medium">Recommended for the best visiting experience</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-3xs shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">SCORE</span>
                  <div className="w-8 h-8 rounded-md bg-[#ea580c] flex items-center justify-center font-black text-sm text-white shadow-xs">
                    {dynamicAIRecommendation.score}
                  </div>
                </div>
              </div>
              
              <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-semibold m-0">
                {dynamicAIRecommendation.reason}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs font-semibold">
                <div className="bg-white p-3 rounded-lg border border-[#f3e3c3]">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-wider font-bold">Recommended Date</span>
                  <span className="font-extrabold text-[#ea580c] text-sm mt-0.5 block">{dynamicAIRecommendation.dayString}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#f3e3c3]">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-wider font-bold">Recommended Time</span>
                  <span className="font-extrabold text-amber-700 text-sm mt-0.5 block">{dynamicAIRecommendation.timeSlot}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#f3e3c3]">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-wider font-bold">Expected Wait</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">~{dynamicAIRecommendation.waitTime} mins</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#f3e3c3]">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-wider font-bold">Expected Crowd</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{dynamicAIRecommendation.level}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 font-medium pt-1.5 border-t border-[#f3e3c3]/60">
                Prediction Confidence: <span className="font-bold text-slate-800">94%</span> • Based on crowd forecast, weather, and booking trends
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* YOUR VISIT SUMMARY HUD */}
        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md border border-slate-950">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber-400 m-0">Your Visit Summary</h4>
              <p className="text-sm font-semibold text-slate-300 m-0">Review your selected visit details.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-800 p-3 rounded-lg border border-slate-700/60 w-full md:w-auto">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-bold tracking-wider">Visit Date</span>
                <span className="font-extrabold text-white text-sm mt-0.5 block">{selectedDate} ({activeDaySummary.dayName})</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-bold tracking-wider">Time Slot</span>
                <span className="font-extrabold text-amber-400 truncate block max-w-[140px] text-sm mt-0.5">{activeDaySummary.timeSlot}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-bold tracking-wider">Crowd Level</span>
                <span className="font-extrabold text-emerald-400 text-sm mt-0.5 block">{activeDaySummary.crowdLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-bold tracking-wider">Visit Score</span>
                <span className="font-extrabold text-amber-400 text-sm mt-0.5 block">{activeDaySummary.score}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* CHOOSE DATE */}
        <div className="space-y-4 pt-2">
          <div className="px-1 space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 m-0">
              <span className="text-[#ea580c] font-extrabold">1.</span> Choose Date
            </h2>
            <p className="text-sm text-slate-600 m-0">Select your preferred visit date.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {dynamicSevenDays.map((d) => {
              const isSelected = selectedDate === d.date;
              const hasFestival = FESTIVAL_DATABASE.some(f => f.date === d.date);
              const match = aiForecastData.find(c => c.date === d.date);
              const weatherMatch = weatherForecastMap[d.date];
              const crowdLevel = match ? match.crowd_level : "LOW";

              return (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  key={d.date}
                  type="button"
                  onClick={() => { setSelectedDate(d.date); setSelectedSlot(null); }}
                  className={`p-3 rounded-xl border-2 text-left flex flex-col justify-between h-36 cursor-pointer transition-all duration-200 shadow-3xs ${
                    isSelected 
                      ? "bg-[#fffbeb] border-[#ea580c] text-slate-900 ring-2 ring-[#ea580c]/10" 
                      : "bg-white border-[#f3e3c3] text-slate-800 hover:bg-[#fffbeb]/50"
                  }`}
                >
                  <div className="w-full space-y-1.5">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 m-0">
                        {d.dayName}
                      </p>
                      {hasFestival && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 shadow-3xs" />}
                    </div>
                    <p className="text-xs font-black tracking-tight text-slate-900 m-0">{d.date}</p>
                    <div className="pt-0.5">{getCrowdChip(crowdLevel)}</div>
                  </div>

                  <div className="w-full pt-2 border-t border-[#f3e3c3]/50 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[#ea580c] font-extrabold">{crowdLevel}</span>
                    <span className="text-slate-800 font-extrabold">{weatherMatch ? `${Math.round(weatherMatch.avgTemp)}°C` : "--"}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* FESTIVAL ALERT PANEL */}
        <AnimatePresence>
          {activeDayFestivalContext && (
            <motion.div 
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex items-center gap-3.5 shadow-3xs"
            >
              <Sparkles size={16} className="text-[#ea580c] shrink-0" />
              <span className="text-xs font-semibold text-amber-900 leading-relaxed">
                <strong className="text-amber-950 font-bold">Festival Notice:</strong> {selectedDate} lines up with <strong className="text-amber-950 font-black">{activeDayFestivalContext.name}</strong>. Higher visitor traffic is expected due to the festival.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AVAILABLE SLOTS ALLOCATION */}
        <div className="space-y-4 pt-2">
          <div className="px-1 space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 m-0">
              <span className="text-[#ea580c] font-extrabold">2.</span> Select Available Slots
            </h2>
            <p className="text-sm text-slate-600 m-0">Choose a slot based on availability.</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-xs font-bold text-slate-500 bg-white border border-[#f3e3c3] rounded-xl space-y-2 shadow-3xs">
              <div className="w-5 h-5 border-2 border-[#ea580c] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="tracking-wider uppercase text-[10px] text-slate-500">Loading available times...</p>
            </div>
          ) : integratedSlotsList.length === 0 ? (
            <div className="text-center py-10 text-slate-700 font-bold text-xs bg-white rounded-xl border border-[#f3e3c3] shadow-3xs">
              No slots available for this configuration selection.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {integratedSlotsList.map((slot) => {
                const isSelected = selectedSlot?.slot === slot.slot;
                const isFull = slot.remaining_capacity <= 0 || !slot.available;
                const capacityMax = 5000; 
                const percentageAvailable = Math.max(0, Math.min(100, (slot.remaining_capacity / capacityMax) * 100));

                return (
                  <motion.div
                    whileHover={!isFull ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isFull ? { scale: 0.98 } : {}}
                    key={slot.slot}
                    onClick={() => !isFull && setSelectedSlot(slot)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between h-38 relative shadow-3xs ${
                      isFull
                        ? "border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed"
                        : isSelected 
                          ? "border-[#ea580c] bg-[#fffbeb] ring-2 ring-[#ea580c]/10 cursor-pointer" 
                          : "border-[#f3e3c3] bg-white hover:bg-[#fffbeb]/30 cursor-pointer"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-extrabold text-slate-900 text-sm tracking-tight m-0">
                          {slot.slot}
                        </h3>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-[#f3e3c3] text-[11px] font-bold text-slate-800 shrink-0">
                          {renderWeatherIcon(slot.condition)}
                          <span>{slot.temp}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium m-0">
                        Forecast: <span className="text-slate-800 font-semibold">{slot.condition}</span>
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-100 w-full">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <span>Available Slots</span>
                          <span className={isFull ? "text-rose-600 font-black" : "text-slate-900 font-black"}>
                            {isFull ? "CLOSED" : `${slot.remaining_capacity.toLocaleString()} left`}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isFull ? "bg-slate-300" : percentageAvailable < 20 ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{ width: isFull ? "100%" : `${percentageAvailable}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center w-full text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-slate-500">Crowd Level</span>
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          isFull ? "bg-slate-200 text-slate-600" :
                          slot.crowd_level === "LOW" ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"
                        }`}>
                          {isFull ? "FILLED" : slot.crowd_level || "LOW"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weather Information */}
        <div className="bg-white border border-[#f3e3c3] rounded-xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center gap-3">
            <CloudSun size={20} className="text-[#ea580c]" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">
                Weather Information
              </h4>
              <p className="text-sm font-bold text-slate-900 m-0">
                {weatherForecastMap[selectedDate]?.conditionText || "Loading..."}
              </p>
            </div>
          </div>

          {weatherForecastMap[selectedDate] ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#fffbeb] border border-[#f3e3c3] rounded-lg p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">
                  Temperature
                </p>
                <p className="text-lg font-black text-slate-900">
                  {Math.round(weatherForecastMap[selectedDate].avgTemp)}°C
                </p>
              </div>

              <div className="bg-[#fffbeb] border border-[#f3e3c3] rounded-lg p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">
                  Humidity
                </p>
                <p className="text-lg font-black text-slate-900">
                  {weatherForecastMap[selectedDate].humidity}%
                </p>
              </div>

              <div className="bg-[#fffbeb] border border-[#f3e3c3] rounded-lg p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">
                  Wind Speed
                </p>
                <p className="text-lg font-black text-slate-900">
                  {weatherForecastMap[selectedDate].windSpeed || "N/A"} km/h
                </p>
              </div>

              <div className="bg-[#fffbeb] border border-[#f3e3c3] rounded-lg p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">
                  UV Index
                </p>
                <p className="text-lg font-black text-slate-900">
                  {weatherForecastMap[selectedDate].uv || "--"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Weather information is loading...
            </p>
          )}
        </div>

        {/* Travel Tips */}
        <div className="bg-white border border-[#f3e3c3] rounded-xl p-5 shadow-3xs space-y-3">
          <div className="flex items-center gap-3">
            <Lightbulb size={20} className="text-[#ea580c]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">
              Travel Tips
            </h4>
          </div>

          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex gap-2">
              <span className="text-[#ea580c] font-bold">•</span>
              <span>
                {weatherForecastMap[selectedDate]?.chanceOfRain > 40
                  ? "Rain is expected. Carry an umbrella."
                  : "The weather looks clear. Carry water and stay hydrated."}
              </span>
            </div>

            <div className="flex gap-2">
              <span className="text-[#ea580c] font-bold">•</span>
              <span>
                Arrive at least <strong>15 minutes early</strong> to avoid queues.
              </span>
            </div>

            <div className="flex gap-2">
              <span className="text-[#ea580c] font-bold">•</span>
              <span>
                Keep your booking confirmation and Government ID ready.
              </span>
            </div>
          </div>
        </div>

      </main>

      {/* ==================== CONTENT-BOUND CONTAINER FOOTER TRAY ==================== */}
      <div className="w-full bg-white/95 backdrop-blur-xs border-t border-[#f3e3c3] px-4 py-4 mt-8 sticky bottom-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5 w-full sm:w-auto text-left">
            <div className={`p-2 rounded-lg border transition-colors ${selectedSlot ? 'bg-[#fffbeb] border-[#ea580c] text-[#ea580c]' : 'bg-slate-50 border-slate-200 text-slate-500'} shrink-0`}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              {selectedSlot ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 leading-none">{selectedSlot.slot}</span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded uppercase tracking-wide"> Ready </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 m-0 pt-1">
                    Visit Date: <strong className="text-slate-900 font-bold">{selectedDate}</strong> ({activeDaySummary.dayName})
                  </p>
                </>
              ) : (
                <>
                  <span className="text-sm font-bold text-slate-800 block leading-none">No Time Slot Selected</span>
                  <p className="text-xs font-semibold text-slate-500 m-0 pt-1">Select a time slot to continue.</p>
                </>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            <button
              onClick={handleContinueSelection}
              disabled={!selectedSlot}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-black text-xs tracking-widest transition-all uppercase border-0 flex items-center justify-center gap-2 cursor-pointer ${
                selectedSlot 
                  ? "bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm active:scale-[0.995]" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              Continue to Booking
              <ArrowRight size={13} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}