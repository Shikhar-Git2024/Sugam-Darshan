import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
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
  ArrowLeft,
  Users
} from "lucide-react";
import festivalBanner from "../../assets/images/festival-banner.png";

const FESTIVAL_DATA = [
  { date: "2026-01-14", name: "Uttarayan / Makar Sankranti", crowd: "High", wait: "45 Min", category: "solar" },
  { date: "2026-01-23", name: "Vasant Panchami", crowd: "Moderate", wait: "30 Min", category: "cultural" },
  { date: "2026-02-01", name: "Maghi Purnima", crowd: "High", wait: "60 Min", category: "purnima" },
  { date: "2026-02-15", name: "Mahashivratri", crowd: "Extreme", wait: "120+ Min", category: "major" },
  { date: "2026-03-02", name: "Holi / Purnima", crowd: "High", wait: "50 Min", category: "purnima" },
  { date: "2026-03-03", name: "Dhuleti / Vasantotsav", crowd: "High", wait: "40 Min", category: "cultural" },
  { date: "2026-03-19", name: "Gudi Padwa / Chaitra Navratri Starts", crowd: "Moderate", wait: "30 Min", category: "cultural" },
  { date: "2026-03-26", name: "Ram Navami", crowd: "High", wait: "75 Min", category: "major" },
  { date: "2026-03-28", name: "Ramnavami Annakut Mahotsav", crowd: "High", wait: "60 Min", category: "fest" },
  { date: "2026-04-02", name: "Shree Hanuman Jayanti", crowd: "High", wait: "60 Min", category: "purnima" },
  { date: "2026-04-19", name: "Akshaya Tritiya", crowd: "High", wait: "45 Min", category: "cultural" },
  { date: "2026-04-25", name: "Sita Navami", crowd: "Moderate", wait: "35 Min", category: "cultural" },
  { date: "2026-05-01", name: "Buddha Purnima", crowd: "Moderate", wait: "30 Min", category: "purnima" },
  { date: "2026-05-17", name: "Adhik Mas Starts", crowd: "Moderate", wait: "25 Min", category: "cultural" },
  { date: "2026-06-16", name: "Ram Rathotsav - Rath Yatra", crowd: "Extreme", wait: "110 Min", category: "major" },
  { date: "2026-06-27", name: "Vatasavitri Vrata Starts", crowd: "Moderate", wait: "20 Min", category: "vrat" },
  { date: "2026-06-29", name: "Devsnan Purnima", crowd: "High", wait: "55 Min", category: "purnima" },
  { date: "2026-07-25", name: "Devpodhi Ekadashi / Gauri Vrata Starts", crowd: "High", wait: "60 Min", category: "vrat" },
  { date: "2026-07-27", name: "Jayaparvati Vrata Starts", crowd: "Moderate", wait: "30 Min", category: "vrat" },
  { date: "2026-07-29", name: "Guru Purnima / Vyas Purnima", crowd: "High", wait: "90 Min", category: "purnima" },
  { date: "2026-08-01", name: "Jayaparvati Vrata Ends", crowd: "Moderate", wait: "30 Min", category: "vrat" },
  { date: "2026-08-12", name: "Divaso / Hariyali Amavasya", crowd: "High", wait: "45 Min", category: "cultural" },
  { date: "2026-08-17", name: "Nag Panchami", crowd: "Moderate", wait: "35 Min", category: "cultural" },
  { date: "2026-08-18", name: "Randhan Chhath", crowd: "Moderate", wait: "20 Min", category: "cultural" },
  { date: "2026-08-19", name: "Sitala Satam", crowd: "High", wait: "50 Min", category: "cultural" },
  { date: "2026-08-28", name: "Rakshabandhan / Nariyeli Purnima", crowd: "High", wait: "65 Min", category: "purnima" },
  { date: "2026-09-04", name: "Janmashtami – Shree Krishna Jayanti", crowd: "Extreme", wait: "150+ Min", category: "major" },
  { date: "2026-09-05", name: "Krishna Jayanti Annakut Mahotsav", crowd: "High", wait: "80 Min", category: "fest" },
  { date: "2026-09-14", name: "Ganesh Chaturthi", crowd: "Extreme", wait: "100 Min", category: "major" },
  { date: "2026-09-15", name: "Rushi Panchami", crowd: "Moderate", wait: "40 Min", category: "cultural" },
  { date: "2026-09-19", name: "Dharo Atham", crowd: "Moderate", wait: "30 Min", category: "cultural" },
  { date: "2026-09-26", name: "Bhadarvi Purnima", crowd: "High", wait: "70 Min", category: "purnima" },
  { date: "2026-09-27", name: "Shradh Paksha Starts", crowd: "Moderate", wait: "25 Min", category: "cultural" },
  { date: "2026-10-10", name: "Sarvapitri Amavasya", crowd: "High", wait: "55 Min", category: "cultural" },
  { date: "2026-10-11", name: "Navaratri Starts", crowd: "High", wait: "60 Min", category: "major" },
  { date: "2026-10-20", name: "Dashera (Victory Day of Shri Rama)", crowd: "High", wait: "85 Min", category: "major" },
  { date: "2026-10-25", name: "Sharad Purnima", crowd: "High", wait: "65 Min", category: "purnima" },
  { date: "2026-10-29", name: "Karva Chouth", crowd: "Moderate", wait: "40 Min", category: "cultural" },
  { date: "2026-11-05", name: "Vagh Baras / Rama Ekadashi", crowd: "Moderate", wait: "30 Min", category: "cultural" },
  { date: "2026-11-06", name: "Dhanterash", crowd: "High", wait: "70 Min", category: "diwali" },
  { date: "2026-11-07", name: "Kali Chaudash", crowd: "High", wait: "60 Min", category: "diwali" },
  { date: "2026-11-08", name: "Diwali (Shri Rama Back in Ayodhya)", crowd: "Extreme", wait: "180+ Min", category: "diwali" },
  { date: "2026-11-10", name: "New Year (Coronation Day)", crowd: "Extreme", wait: "120 Min", category: "diwali" },
  { date: "2026-11-11", name: "Bhai Bij", crowd: "High", wait: "75 Min", category: "diwali" },
  { date: "2026-11-14", name: "Labh Pancham", crowd: "High", wait: "60 Min", category: "diwali" },
  { date: "2026-12-16", name: "Kamuhurta Starts", crowd: "Moderate", wait: "20 Min", category: "cultural" },
  { date: "2026-12-23", name: "Shri Dattatrey Jayanti", crowd: "High", wait: "55 Min", category: "purnima" }
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getCategoryIcon = (category, name = "") => {
  const title = name.toLowerCase();
  if (category === "diwali" || title.includes("diwali") || title.includes("dhanterash")) {
    return <Flame className="text-amber-600 fill-amber-100" size={18} />;
  }
  if (category === "purnima" || title.includes("purnima")) {
    return <Moon className="text-amber-700 fill-amber-50" size={18} />;
  }
  if (category === "solar" || title.includes("uttarayan") || title.includes("sankranti")) {
    return <Sun className="text-[#ea580c]" size={18} />;
  }
  if (title.includes("holi") || title.includes("dhuleti")) {
    return <Palette className="text-amber-600" size={18} />;
  }
  if (category === "vrat" || title.includes("vrata") || title.includes("vrat")) {
    return <Flower2 className="text-emerald-600" size={18} />;
  }
  return <Sparkles className="text-amber-600" size={18} />;
};

const getCrowdStyles = (crowd) => {
    switch (crowd) {
        case "Extreme":
            return {
                bg: "bg-rose-50 text-rose-800 border-rose-200/60",
                dot: "bg-rose-500",
            };

        case "High":
            return {
                bg: "bg-orange-50 text-orange-800 border-orange-200/60",
                dot: "bg-orange-500",
            };

        default:
            return {
                bg: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
                dot: "bg-emerald-500",
            };
    }
};

const getVisitorGuidance = (crowd) => {
  switch (crowd) {
    case "Extreme":
      return "Very heavy crowds are expected. Please pre-book your darshan slot, arrive at least 60 minutes early, and expect longer waiting times throughout the day.";
    case "High":
      return "Higher than usual crowds are expected. Arriving 30–45 minutes early and booking your darshan slot in advance is recommended.";
    default:
      return "A comfortable day to visit. Normal waiting times are expected, making it a good day for a peaceful darshan.";
  }
};

export default function FestivalCalendarPage() {
  const navigate = useNavigate();

  const { todayDateStr, currentYear, initialMonthIdx } = useMemo(() => {
    const liveDate = new Date();
    const y = liveDate.getFullYear();
    const m = String(liveDate.getMonth() + 1).padStart(2, "0");
    const d = String(liveDate.getDate()).padStart(2, "0");
    return {
      todayDateStr: `${y}-${m}-${d}`,
      currentYear: y,
      initialMonthIdx: liveDate.getMonth()
    };
  }, []);

  const [currentMonthIdx, setCurrentMonthIdx] = useState(initialMonthIdx); 
  const [selectedDate, setSelectedDate] = useState(""); 

  useEffect(() => {
    window.scrollTo(0, 0);
    const initialMonthFests = FESTIVAL_DATA.filter(f => {
      const fDate = new Date(f.date);
      return fDate.getMonth() === initialMonthIdx;
    });
    if (initialMonthFests.length > 0) {
      setSelectedDate(initialMonthFests[0].date);
    }
  }, [initialMonthIdx]);

  const { startDayOfWeek, monthDaysArray } = useMemo(() => {
    const start = new Date(currentYear, currentMonthIdx, 1).getDay();
    const total = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
    const days = Array.from({ length: total }, (_, i) => i + 1);
    return { startDayOfWeek: start, monthDaysArray: days };
  }, [currentYear, currentMonthIdx]);

  const handlePrevMonth = () => setCurrentMonthIdx(prev => (prev === 0 ? 11 : prev - 1));
  const handleNextMonth = () => setCurrentMonthIdx(prev => (prev === 11 ? 0 : prev + 1));

  // Defined here inside the component function scope to fix the Uncaught ReferenceError
  const handleListCardSelect = (dateString) => {
    setSelectedDate(dateString);
  };

  const activeMonthFestivals = useMemo(() => {
    return FESTIVAL_DATA.filter(f => {
      const fDate = new Date(f.date);
      return fDate.getFullYear() === currentYear && fDate.getMonth() === currentMonthIdx;
    });
  }, [currentMonthIdx, currentYear]);

  const activeSelectedDetails = useMemo(() => {
    return FESTIVAL_DATA.filter(f => f.date === selectedDate);
  }, [selectedDate]);

  const upcomingFestivals = useMemo(() => {
    return FESTIVAL_DATA.filter(
        festival => festival.date >= todayDateStr
    );
  }, [todayDateStr]);

  return (
    <div className="min-h-screen bg-[#fffdf6]">
        {/* HEADER BLOCK */}
        <section className="relative h-[200px] overflow-hidden">

          {/* Background */}
          <img
              src={festivalBanner}
              alt="Festival Calendar"
              className="absolute inset-0 w-full h-full object-cover object-[center_72%]"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Content */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
              <div className="max-w-2xl">

                  <h1 className="mt-3 text-4xl md:text-5xl font-black text-white" style={{textShadow: "0 2px 10px rgba(0,0,0,0.25)"}}>
                      Festival Calendar
                  </h1>

                  <p className="mt-4 text-[#FFF7EA] text-lg leading-relaxed">
                      Plan your temple visit around important festivals,
                      expected crowds and special celebrations.
                  </p>
              </div>
          </div>
        </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#f3e3c3] p-5 shadow-xs space-y-6">
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl hover:bg-orange-50 transition"
                >
                    <ChevronLeft size={18}/>
                </button>

                <div className="text-center">
                    <h2 className="text-xl font-black text-slate-900">
                        {MONTHS[currentMonthIdx]} {currentYear}
                    </h2>
                </div>

                <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl hover:bg-orange-50 transition"
                >
                    <ChevronRight size={18}/>
                </button>
            </div>

            {/* Legend placed below navigation */}
            <div className="flex justify-center gap-6 mt-3 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full border-2 border-orange-500"/>
                    Selected
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full border-2 border-sky-500"/>
                    Today
                </div>
            </div>

            {/* Calendar Grid View */}
            <div>
              <div className="grid grid-cols-7 gap-1 text-center font-black text-xs text-slate-500 mb-3 uppercase tracking-wider">
                {DAYS_OF_WEEK.map((d, i) => (
                  <div key={d} className={`py-1 ${i === 0 ? "text-rose-600" : ""}`}>{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startDayOfWeek || 0 }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="aspect-square bg-[#fffdf6]/40 rounded-xl border border-slate-50" />
                ))}

                {(monthDaysArray || []).map(day => {
                  const dayString = `2026-${String(currentMonthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isToday = dayString === todayDateStr;
                  const targetFestivals = FESTIVAL_DATA.filter(f => f.date === dayString);
                  const isFestival = targetFestivals.length > 0;
                  const isSelected = selectedDate === dayString;

                  return (
                    <motion.button
                      whileHover={{ scale: isFestival ? 1.02 : 1, y: isFestival ? -1 : 0 }}
                      whileTap={{ scale: isFestival ? 0.98 : 1 }}
                      key={day}
                      onClick={() => setSelectedDate(dayString)}
                      className={`relative aspect-square flex flex-col items-center justify-between p-2 rounded-xl transition-all border text-left font-black border-0 ${
                        isSelected
                          ? "bg-[#fffbeb] border-[#ea580c] ring-2 ring-[#ea580c] scale-105 z-10"
                          : isToday
                              ? "bg-sky-50 border-sky-500 ring-2 ring-sky-300 text-sky-700"
                              : isFestival
                                  ? "bg-orange-50 border-orange-200 text-slate-800 hover:bg-orange-100 hover:border-orange-300 cursor-pointer"
                                  : "bg-[#fffdf6] border-[#f3e3c3] text-slate-700 hover:bg-[#fffbeb] hover:border-[#ea580c] cursor-pointer"
                      }`}
                    >
                      <span className="text-sm">{day}</span>
                      <div className="w-full flex items-center justify-end">
                        {isFestival && targetFestivals && targetFestivals[0] && (
                          <div className="p-0.5 rounded text-[#ea580c] scale-110">
                            {getCategoryIcon(targetFestivals[0].category, targetFestivals[0].name)}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* List Selection Sync Layer */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Festivals This Month</h3>
              {activeMonthFestivals.length === 0 ? (
                <p className="text-xs font-semibold text-slate-500 italic m-0 py-2">No major public festivals scheduled for this month.</p>
              ) : (
                <div className="space-y-2">
                  {activeMonthFestivals.map(f => (
                    <div 
                      key={f.name}
                      onClick={() => setSelectedDate(f.date)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between text-sm cursor-pointer transition-all ${
                        selectedDate === f.date 
                          ? "bg-[#fffbeb] border-[#ea580c] text-slate-900 font-bold shadow-3xs" 
                          : "bg-white border-[#f3e3c3] text-slate-700 hover:bg-[#fffbeb]/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate max-w-[75%] font-bold text-slate-800">
                        {getCategoryIcon(f.category, f.name)}
                        <span className="truncate">{f.name}</span>
                      </div>
                      <span className="text-xs font-bold font-mono bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 shadow-3xs">
                        {f.date.split("-")[2]} {MONTHS[new Date(f.date).getMonth()].substring(0, 3)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CONTAINER: SELECTED PANEL & LOGISTICS HUB */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* INFORMATION TRAY */}
            <div className="bg-white rounded-2xl border border-[#f3e3c3] p-5 shadow-xs">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Selected Festival</h3>
              
              <AnimatePresence mode="wait">
                {activeSelectedDetails.length > 0 ? (
                  activeSelectedDetails.map(item => {
                    const statusTheme = getCrowdStyles(item.crowd);
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 text-slate-600">
                            {item.date}
                          </span>
                          <h4 className="text-xl font-black text-slate-900 tracking-tight mt-2 leading-tight">{item.name}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className={`p-4 rounded-xl border ${statusTheme.bg} space-y-1`}>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-80">
                              <Users size={14} /> Expected Crowd
                            </div>
                            <p className="text-xl font-black m-0 leading-none pt-1">{item.crowd}</p>
                          </div>
                          
                          <div className="p-4 rounded-xl border border-[#f3e3c3] bg-white space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              <Clock3 size={14} /> Estimated Wait
                            </div>
                            <p className="text-xl font-black text-slate-900 m-0 leading-none pt-1">{item.wait}</p>
                          </div>
                        </div>

                        <div className="bg-[#fffbeb] border border-[#f3e3c3] p-4 rounded-xl flex gap-3 text-xs leading-relaxed text-slate-700 font-semibold shadow-3xs">
                          <AlertTriangle className="text-[#ea580c] shrink-0 mt-0.5" size={16} />
                          <p className="m-0">
                            <strong className="text-amber-950 font-bold">Visitor Guidance:</strong>{" "}
                            {getVisitorGuidance(item.crowd)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                    <motion.div
                        key={selectedDate || "empty"}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-center py-8"
                    >
                        <CalendarDays
                            size={38}
                            className="mx-auto text-slate-300 mb-4"
                        />

                        {selectedDate && (
                            <p className="text-sm font-bold text-slate-700">
                                {new Date(selectedDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        )}

                        <h3 className="mt-3 text-lg font-black text-slate-800">
                            No Festival Scheduled
                        </h3>

                        <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                            No major festival is scheduled on this date.
                            This is generally a good day for a peaceful darshan with shorter waiting times.
                        </p>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>

            {/* TRAVEL ADVISORIES */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-md space-y-4 border border-slate-950">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 m-0">
                <Sparkles size={14} /> Visitor Tips
              </h3>
              <ul className="space-y-3 text-xs font-medium text-slate-300 pl-0 m-0 list-none">
                <li className="flex gap-2 items-start">
                  <span className="text-[#ea580c] font-black">•</span>
                  <span>Book your darshan slot in advance for festivals with Extreme crowd levels.<strong className="text-white">Extreme</strong> crowd volume markers.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-[#ea580c] font-black">•</span>
                  <span>Arrive early and follow on-site guidance during major festivals for a smoother visit.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CHRONOLOGICAL BACKLOG COMPONENT VIEW */}
        <div className="bg-white rounded-2xl border border-[#f3e3c3] p-5 shadow-xs space-y-4">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 m-0">
              <CalendarDays className="text-[#ea580c]" size={16} />
              Upcoming Festivals
              <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-100 text-[#ea580c] text-[10px] font-black">
                  {upcomingFestivals.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold m-0">
              View upcoming festivals to help plan your temple visit and avoid peak crowds.
            </p>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {FmrListLayout(upcomingFestivals, selectedDate, todayDateStr, handleListCardSelect, MONTHS)}
          </div>
        </div>

      </div>
    </div>
  );
}

// Extracted chronological timeline frame block layer
function FmrListLayout(data, selectedDate, todayDateStr, handleListCardSelect, MONTHS) {
  // Check if data is empty
  if (!data || data.length === 0) {
    return (
      <div className="py-10 text-center">
        <CalendarDays className="mx-auto text-slate-300 mb-3" size={32} />
        <h3 className="font-bold text-slate-700">No Upcoming Festivals</h3>
        <p className="text-sm text-slate-500 mt-1">
          New festival dates will appear here once they are available.
        </p>
      </div>
    );
  }

  return data.map((fest) => {
    const isSelected = selectedDate === fest.date;
    const styles = getCrowdStyles(fest.crowd);
    
    return (
      <motion.div
        whileHover={{ x: 1, backgroundColor: "#fffbeb" }}
        key={`${fest.date}-${fest.name}`}
        onClick={() => handleListCardSelect(fest.date)}
        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isSelected 
            ? "bg-[#fffbeb] border-[#ea580c] shadow-3xs ring-1 ring-[#ea580c]/10" 
            : "bg-white border-[#f3e3c3]"
        }`}
      >
        {/* ... rest of your list card code ... */}
        <div className="flex items-start gap-3.5 max-w-[85%]">
          <div className={`p-2.5 rounded-lg border shrink-0 mt-0.5 shadow-3xs bg-white ${isSelected ? "border-orange-200" : "border-slate-100"}`}>
            {getCategoryIcon(fest.category, fest.name)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-sm md:text-base tracking-tight m-0 text-slate-900">
                {fest.name}
              </h4>
              {fest.date === todayDateStr && (
                <span className="text-[9px] font-black px-1.5 py-0.5 bg-[#ea580c] text-white rounded uppercase tracking-wider animate-pulse shadow-2xs">
                  Today
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1 leading-normal m-0">
              Estimated wait times hover around {fest.wait} during peak hours on this celebration day window.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <span className="text-xs font-mono font-bold bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded border border-slate-200 shadow-3xs">
            {fest.date}
          </span>
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border tracking-wide uppercase ${styles.bg}`}>
            {fest.crowd}
          </span>
        </div>
      </motion.div>
    );
  });
}