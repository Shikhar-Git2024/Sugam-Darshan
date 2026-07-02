import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // Ensure react-router-dom is used in your routing layer
import {
  CalendarDays,
  Clock3,
  Users,
  AlertTriangle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Flame,
  Palette,
  Flower2,
  Compass,
  Info,
  ArrowLeft
} from "lucide-react";

// Full structural dataset synchronized exactly from image_55ce5b.png
const FESTIVAL_DATA = [
  { date: "2026-01-14", name: "Uttarayan / Makar Sankranti / Dhanurmas Ends", crowd: "High", wait: "45 Min", category: "solar" },
  { date: "2026-01-23", name: "Vasant Panchami", crowd: "Moderate", wait: "30 Min", category: "cultural" },
  { date: "2026-02-01", name: "Maghi Purnima", crowd: "High", wait: "60 Min", category: "purnima" },
  { date: "2026-02-15", name: "Mahashivratri", crowd: "Extreme", wait: "120+ Min", category: "major" },
  { date: "2026-03-02", name: "Holi / Purnima / Holashtak Ends", crowd: "High", wait: "50 Min", category: "purnima" },
  { date: "2026-03-03", name: "Dhuleti / Vasantotsav / Purnima", crowd: "High", wait: "40 Min", category: "cultural" },
  { date: "2026-03-19", name: "Gudi Padwa / Chaitra Starts / Chaitra Navratri Starts", crowd: "Moderate", wait: "30 Min", category: "cultural" },
  { date: "2026-03-26", name: "Ram Navami / Chaitra Navratri Ends", crowd: "High", wait: "75 Min", category: "major" },
  { date: "2026-03-28", name: "Ramnavami Annakut Mahotsav", crowd: "High", wait: "60 Min", category: "fest" },
  { date: "2026-04-02", name: "Shree Hanuman Jayanti / Chaitri Purnima", crowd: "High", wait: "60 Min", category: "purnima" },
  { date: "2026-04-19", name: "Akshaya Tritiya (Akha Trij)", crowd: "High", wait: "45 Min", category: "cultural" },
  { date: "2026-04-25", name: "Sita Navami – Janaki Jayanti", crowd: "Moderate", wait: "35 Min", category: "cultural" },
  { date: "2026-05-01", name: "Buddha (Vaishakhi) Purnima", crowd: "Moderate", wait: "30 Min", category: "purnima" },
  { date: "2026-05-17", name: "Adhik Mas Starts", crowd: "Moderate", wait: "25 Min", category: "cultural" },
  { date: "2026-06-16", name: "Ram Rathotsav - Rath Yatra", crowd: "Extreme", wait: "110 Min", category: "major" },
  { date: "2026-06-27", name: "Vatasavitri Vrata Starts", crowd: "Moderate", wait: "20 Min", category: "vrat" },
  { date: "2026-06-29", name: "Devsnan Purnima / Vatasavitri Vrata Ends", crowd: "High", wait: "55 Min", category: "purnima" },
  { date: "2026-07-25", name: "Devpodhi Ekadashi / Gauri Vrata Starts", crowd: "High", wait: "60 Min", category: "vrat" },
  { date: "2026-07-27", name: "Jayaparvati Vrata Starts", crowd: "Moderate", wait: "30 Min", category: "vrat" },
  { date: "2026-07-29", name: "Guru Purnima / Vyas Purnima / Gauri Vrata Ends", crowd: "High", wait: "90 Min", category: "purnima" },
  { date: "2026-08-01", name: "Jayaparvati Vrata Ends", crowd: "Moderate", wait: "30 Min", category: "vrat" },
  { date: "2026-08-12", name: "Divaso / Hariyali Amavasya / Evrta-Jeevrat", crowd: "High", wait: "45 Min", category: "cultural" },
  { date: "2026-08-17", name: "Nag Panchami", crowd: "Moderate", wait: "35 Min", category: "cultural" },
  { date: "2026-08-18", name: "Randhan Chhath", crowd: "Moderate", wait: "20 Min", category: "cultural" },
  { date: "2026-08-19", name: "Sitala Satam", crowd: "High", wait: "50 Min", category: "cultural" },
  { date: "2026-08-28", name: "Rakshabandhan / Nariyeli Purnima", crowd: "High", wait: "65 Min", category: "purnima" },
  { date: "2026-09-04", name: "Janmashtami – Shree Krishna Jayanti", crowd: "Extreme", wait: "150+ Min", category: "major" },
  { date: "2026-09-05", name: "Krishna Jayanti Annakut Mahotsav", crowd: "High", wait: "80 Min", category: "fest" },
  { date: "2026-09-14", name: "Ganesh Chaturthi / Kevda Trij", crowd: "Extreme", wait: "100 Min", category: "major" },
  { date: "2026-09-15", name: "Rushi Panchami / Sama Pancham", crowd: "Moderate", wait: "40 Min", category: "cultural" },
  { date: "2026-09-19", name: "Dharo Atham", crowd: "Moderate", wait: "30 Min", category: "cultural" },
  { date: "2026-09-26", name: "Bhadarvi Purnima", crowd: "High", wait: "70 Min", category: "purnima" },
  { date: "2026-09-27", name: "Shradh Paksha Starts", crowd: "Moderate", wait: "25 Min", category: "cultural" },
  { date: "2026-10-10", name: "Sarvapitri Amavasya / Shradh Paksha Ends", crowd: "High", wait: "55 Min", category: "cultural" },
  { date: "2026-10-11", name: "Navaratri Starts / Aso Starts", crowd: "High", wait: "60 Min", category: "major" },
  { date: "2026-10-20", name: "Dashera (Victory Day of Shri Rama) / Navaratri Ends", crowd: "High", wait: "85 Min", category: "major" },
  { date: "2026-10-25", name: "Sharad Purnima / Dashera Havan", crowd: "High", wait: "65 Min", category: "purnima" },
  { date: "2026-10-29", name: "Karva Choth - Sankasht Chaturthi", crowd: "Moderate", wait: "40 Min", category: "cultural" },
  { date: "2026-11-05", name: "Vagh Baras / Rama Ekadashi", crowd: "Moderate", wait: "30 Min", category: "cultural" },
  { date: "2026-11-06", name: "Dhanterash", crowd: "High", wait: "70 Min", category: "diwali" },
  { date: "2026-11-07", name: "Kali Chaudash", crowd: "High", wait: "60 Min", category: "diwali" },
  { date: "2026-11-08", name: "Diwali (Shri Rama Back in Ayodhya)", crowd: "Extreme", wait: "180+ Min", category: "diwali" },
  { date: "2026-11-10", name: "New Year (Coronation Day) / Kartik Starts", crowd: "Extreme", wait: "120 Min", category: "diwali" },
  { date: "2026-11-11", name: "Bhai Bij / Bhai Bij", crowd: "High", wait: "75 Min", category: "diwali" },
  { date: "2026-11-14", name: "Labh Pancham / Shree Panchmi", crowd: "High", wait: "60 Min", category: "diwali" },
  { date: "2026-11-14", name: "New Year Annakut Mahotsav", crowd: "High", wait: "80 Min", category: "diwali" },
  { date: "2026-11-24", name: "Dev Diwali / Purnima / Guru Nanak Jayanti", crowd: "High", wait: "90 Min", category: "purnima" },
  { date: "2026-12-16", name: "Dhanarak / Kamuhurta Starts", crowd: "Moderate", wait: "20 Min", category: "cultural" },
  { date: "2026-12-23", name: "Purnima / Shri Dattatrey Jayanti", crowd: "High", wait: "55 Min", category: "purnima" }
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getCategoryIcon = (category, name = "") => {
  const title = name.toLowerCase();
  if (category === "diwali" || title.includes("diwali") || title.includes("dhanterash") || title.includes("kali chaudash")) {
    return <Flame className="text-amber-500 fill-amber-100 animate-pulse" size={20} />;
  }
  if (category === "purnima" || title.includes("purnima")) {
    return <Moon className="text-indigo-500 fill-indigo-100" size={20} />;
  }
  if (category === "solar" || title.includes("uttarayan") || title.includes("sankranti")) {
    return <Sun className="text-orange-500" size={20} />;
  }
  if (title.includes("holi") || title.includes("dhuleti")) {
    return <Palette className="text-pink-500" size={20} />;
  }
  if (category === "vrat" || title.includes("vrata") || title.includes("vrat")) {
    return <Flower2 className="text-emerald-500" size={20} />;
  }
  return <Sparkles className="text-amber-500" size={20} />;
};

const getCrowdStyles = (crowd) => {
  switch (crowd) {
    case "Extreme": return { bg: "bg-red-50 text-red-700 border-red-200/60", dot: "bg-red-500", code: "border-l-red-500" };
    case "High": return { bg: "bg-orange-50 text-orange-700 border-orange-200/60", dot: "bg-orange-500", code: "border-l-orange-500" };
    default: return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60", dot: "bg-emerald-500", code: "border-l-emerald-500" };
  }
};

export default function FestivalCalendarPage() {
  const todayDateStr = "2026-06-30"; 
  const currentYear = 2026;

  // Establish standard initial indices directly from system timelines (June = Index 5)
  const initialMonth = useMemo(() => {
    const parts = todayDateStr.split("-");
    return parseInt(parts[1], 10) - 1; 
  }, [todayDateStr]);

  const [currentMonthIdx, setCurrentMonthIdx] = useState(initialMonth); 
  const [selectedDate, setSelectedDate] = useState("2026-06-16"); 

  // Reset scroll metrics to top on mounting phase 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { startDayOfWeek, monthDaysArray } = useMemo(() => {
    const start = new Date(currentYear, currentMonthIdx, 1).getDay();
    const total = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
    const days = Array.from({ length: total }, (_, i) => i + 1);
    return { startDayOfWeek: start, monthDaysArray: days };
  }, [currentYear, currentMonthIdx]);

  const handlePrevMonth = () => setCurrentMonthIdx(prev => (prev === 0 ? 11 : prev - 1));
  const handleNextMonth = () => setCurrentMonthIdx(prev => (prev === 11 ? 0 : prev + 1));

  const activeMonthFestivals = useMemo(() => {
    return FESTIVAL_DATA.filter(f => {
      const fDate = new Date(f.date);
      return fDate.getFullYear() === currentYear && fDate.getMonth() === currentMonthIdx;
    });
  }, [currentMonthIdx]);

  const activeSelectedDetails = useMemo(() => {
    return FESTIVAL_DATA.filter(f => f.date === selectedDate);
  }, [selectedDate]);

  const handleListCardSelect = (dateString) => {
    setSelectedDate(dateString);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-amber-50/30 p-4 md:p-8 text-slate-800 antialiased selection:bg-orange-100 pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Integrated Navigation Breadcrumb Row */}
        <div className="flex items-center justify-start">
          <Link 
            to="/devotee/dashboard" 
            className="inline-flex items-center gap-2.5 text-sm font-black text-slate-500 hover:text-slate-900 transition bg-white/80 hover:bg-white px-5 py-2.5 rounded-2xl border border-slate-200/60 shadow-xs cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Floating Glass Header Engine */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm tracking-widest uppercase mb-1">
              <Compass size={16} className="animate-spin-slow" />
              Sugam Darshan Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Pilgrim Planner <span className="text-slate-400 font-light font-sans">2026</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900 text-white p-2 rounded-2xl shadow-md">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-800 rounded-xl transition">
              <ChevronLeft size={20} />
            </button>
            <select 
              value={currentMonthIdx} 
              onChange={(e) => setCurrentMonthIdx(parseInt(e.target.value))}
              className="bg-transparent font-black text-white px-3 py-1 text-base focus:outline-none cursor-pointer"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx} className="text-slate-900 font-semibold">{m}</option>
              ))}
            </select>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-800 rounded-xl transition">
              <ChevronRight size={20} />
            </button>
          </div>
        </header>

        {/* Top Control Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          
          {/* Calendar Grid Container */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays size={24} className="text-orange-600" />
                {MONTHS[currentMonthIdx]} Grid View
              </h2>
              <div className="flex gap-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-500 rounded-full"/> Festival</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-600 rounded-full"/> Today</div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-7 gap-1 text-center font-black text-sm text-slate-400 mb-3 uppercase tracking-wider">
                {DAYS_OF_WEEK.map((d, i) => (
                  <div key={d} className={`py-1 ${i === 0 ? "text-rose-500/80" : ""}`}>{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startDayOfWeek || 0 }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="aspect-square bg-slate-50/40 rounded-2xl border border-slate-100" />
                ))}

                {(monthDaysArray || []).map(day => {
                  const dayString = `2026-${String(currentMonthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isToday = dayString === todayDateStr;
                  const targetFestivals = FESTIVAL_DATA.filter(f => f.date === dayString);
                  const isFestival = targetFestivals.length > 0;
                  const isSelected = selectedDate === dayString;

                  return (
                    <motion.button
                      whileHover={{ scale: isFestival ? 1.05 : 1, y: isFestival ? -2 : 0 }}
                      whileTap={{ scale: isFestival ? 0.98 : 1 }}
                      key={day}
                      onClick={() => isFestival && setSelectedDate(dayString)}
                      disabled={!isFestival}
                      className={`relative aspect-square flex flex-col items-center justify-between p-2 rounded-2xl transition-all border text-left font-black ${
                        isSelected 
                          ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10 z-10 scale-105" 
                          : isToday 
                            ? "bg-indigo-50 border-indigo-300 text-indigo-700 ring-2 ring-indigo-600/10" 
                            : isFestival
                              ? "bg-orange-50/70 border-orange-200/80 text-orange-900 hover:bg-orange-100/80 cursor-pointer shadow-xs"
                              : "bg-white border-slate-100 text-slate-400/70 font-semibold cursor-not-allowed"
                      }`}
                    >
                      <span className="text-base">{day}</span>
                      <div className="w-full flex items-center justify-end gap-1">
                        {isFestival && targetFestivals && targetFestivals[0] && (
                          <div className={`p-0.5 rounded-md ${isSelected ? "bg-white/20 text-white" : "text-orange-700"}`}>
                            {getCategoryIcon(targetFestivals[0].category, targetFestivals[0].name)}
                          </div>
                        )}
                        {isToday && <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full absolute top-2 right-2 ring-4 ring-indigo-100" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* In-month sub list section */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Festivals This Month</h3>
              {activeMonthFestivals.length === 0 ? (
                <p className="text-base text-slate-400/80 italic">No scheduled major public festivals listed for this month block.</p>
              ) : (
                <div className="space-y-2">
                  {activeMonthFestivals.map(f => (
                    <div 
                      key={f.name}
                      onClick={() => setSelectedDate(f.date)}
                      className={`p-4 rounded-xl border flex items-center justify-between text-base cursor-pointer transition ${
                        selectedDate === f.date 
                          ? "bg-orange-50 border-orange-300 text-orange-900 font-bold shadow-xs" 
                          : "bg-slate-50/50 border-slate-100 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate max-w-[70%] font-bold text-slate-800">
                        {getCategoryIcon(f.category, f.name)}
                        <span className="truncate">{f.name}</span>
                      </div>
                      <span className="text-sm font-bold font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200/50 text-slate-500 shadow-3xs">
                        {f.date.split("-")[2]} {MONTHS[new Date(f.date).getMonth()].substring(0, 3)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column Inspection Dashboard */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Inspection Panel</h3>
              
              <AnimatePresence mode="wait">
                {activeSelectedDetails.length > 0 ? (
                  activeSelectedDetails.map(item => {
                    const statusTheme = getCrowdStyles(item.crowd);
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-5"
                      >
                        <div className={`border-l-4 ${statusTheme.code} pl-4`}>
                          <span className="text-sm font-mono font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                            {item.date}
                          </span>
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-3 leading-snug">{item.name}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className={`p-4 rounded-2xl border ${statusTheme.bg} space-y-1`}>
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-80">
                              <Users size={16} /> Crowd Metrics
                            </div>
                            <p className="text-2xl font-black">{item.crowd}</p>
                          </div>
                          
                          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                              <Clock3 size={16} /> Peak Wait
                            </div>
                            <p className="text-2xl font-black text-slate-800">{item.wait}</p>
                          </div>
                        </div>

                        <div className="bg-amber-50/50 border border-amber-100/70 rounded-2xl p-4 flex gap-3 text-sm leading-relaxed text-amber-900">
                          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                          <div>
                            <span className="font-bold">Operational Alert:</span> Queue containment bypasses trigger auto-actively on density levels matching this matrix window setup.
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-400 space-y-2">
                    <Info size={36} className="mx-auto text-slate-300 stroke-1" />
                    <p className="text-base font-medium">Select an active festival day block marker flag on the calendar viewport map.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={16} /> Travel Advisory Hub
              </h3>
              <ul className="space-y-3 text-sm leading-relaxed text-slate-300">
                <li className="flex gap-2.5 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-2" />
                  <span>Pre-book slot permissions 72 hours prior for <strong className="text-white">Extreme</strong> congestion markers.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-2" />
                  <span>Expect multi-point pedestrian route block deviations on Purnima cycles.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Master Scrolling List Tracker View Container */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarDays className="text-orange-600" size={24} />
              Annual Spiritual Schedule (Complete Timeline View)
            </h2>
            <p className="text-sm text-slate-400 font-bold mt-0.5">Explore full pilgrimage insights and context notes for all events across the 2026 cycle.</p>
          </div>

          {/* Large Text Scroll Container */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {FESTIVAL_DATA.map((fest) => {
              const isSelected = selectedDate === fest.date;
              const styles = getCrowdStyles(fest.crowd);
              const isPassed = fest.date < todayDateStr;
              
              return (
                <motion.div
                  whileHover={{ x: 2, backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                  key={`${fest.date}-${fest.name}`}
                  onClick={() => handleListCardSelect(fest.date)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected 
                      ? "bg-orange-50/50 border-orange-300/80 shadow-xs ring-1 ring-orange-400/20" 
                      : "bg-white border-slate-100"
                  } ${isPassed ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-4 max-w-[85%]">
                    <div className={`p-3 rounded-xl border shrink-0 mt-0.5 shadow-3xs ${isSelected ? "bg-white border-orange-200" : "bg-slate-50 border-slate-100"}`}>
                      {getCategoryIcon(fest.category, fest.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className={`font-extrabold text-base md:text-lg tracking-tight ${isPassed ? "text-slate-500 line-through font-bold" : "text-slate-900"}`}>
                          {fest.name}
                        </h4>
                        {isPassed && (
                          <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md tracking-wider uppercase">Passed</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 font-bold mt-1 leading-normal">
                        Operational checkpoint metrics indicate an estimated wait time around {fest.wait} near peak congestion thresholds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-sm font-mono font-bold bg-slate-50 text-slate-600 px-3 py-1 rounded-lg border border-slate-100">
                      {fest.date}
                    </span>
                    <span className={`text-xs font-black px-3 py-1 rounded-full border tracking-wide uppercase ${styles.bg}`}>
                      {fest.crowd}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}