import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Calendar, CheckCircle2, 
  CloudSun, Sun, CloudRain, Moon, Cloud,
  ArrowRight, Zap, Thermometer, Droplets, Wind, Info
} from "lucide-react";
import axios from "axios";
import api from "../../services/api";

const FESTIVAL_DATABASE = [
  { date: "2026-01-14", name: "Uttarayan / Makar Sankranti / Dhanurmas Ends" },
  { date: "2026-01-23", name: "Vasant Panchami" },
  { date: "2026-02-01", name: "Maghi Purnima" },
  { date: "2026-02-15", name: "Mahashivratri" },
  { date: "2026-03-02", name: "Holi / Purnima / Holashtak Ends" },
  { date: "2026-03-03", name: "Dhuleti / Vasantotsav / Purnima" },
  { date: "2026-03-19", name: "Gudi Padwa / Chaitra Starts / Chaitra Navratri Starts" },
  { date: "2026-03-26", name: "Ram Navami / Chaitra Navratri Ends" },
  { date: "2026-03-28", name: "Ramnavami Annakut Mahotsav" },
  { date: "2026-04-02", name: "Shree Hanuman Jayanti / Chaitri Purnima" },
  { date: "2026-04-19", name: "Akshay Trutia (Akha Trij)" },
  { date: "2026-04-25", name: "Sita Navami – Janaki Jayanti" },
  { date: "2026-05-01", name: "Buddha (Vaishakhi) Purnima" },
  { date: "2026-05-17", name: "Adhik Mas Starts" },
  { date: "2026-06-16", name: "Ram Rathotsav - Rath Yatra" },
  { date: "2026-06-27", name: "Vatasavitri Vrata Starts" },
  { date: "2026-06-29", name: "Devsnan Purnima / Vatasavitri Vrata Ends" },
  { date: "2026-07-25", name: "Devpodhi Ekadashi / Gauri Vrata Starts" },
  { date: "2026-07-27", name: "Jayaparvati Vrata Starts" },
  { date: "2026-07-29", name: "Guru Purnima / Vyas Purnima / Gauri Vrata Ends" },
  { date: "2026-08-01", name: "Jayaparvati Vrata Ends" },
  { date: "2026-08-12", name: "Divaso / Hariyali Amavasya / Evrta-Jeevrat" },
  { date: "2026-08-17", name: "Nag Panchami" },
  { date: "2026-08-18", name: "Randhan Chhath" },
  { date: "2026-08-19", name: "Sitala Satam" },
  { date: "2026-08-28", name: "Rakshabandhan / Nariyeli Purnima" },
  { date: "2026-09-04", name: "Janmashtami – Shree Krishna Jayanti" },
  { date: "2026-09-05", name: "Krishna Jayanti Annakut Mahotsav" },
  { date: "2026-09-14", name: "Ganesh Chaturthi / Kevda Trij" },
  { date: "2026-09-15", name: "Rushi Panchami / Sama Pancham" },
  { date: "2026-09-19", name: "Dharo Atham" },
  { date: "2026-09-26", name: "Bhadarvi Purnima" },
  { date: "2026-09-27", name: "Shradh Paksha Starts" },
  { date: "2026-10-10", name: "Sarvapitri Amavasya / Shradh Paksha Ends" },
  { date: "2026-10-11", name: "Navaratri Starts / Aso Starts" },
  { date: "2026-10-20", name: "Dashera (Victory Day of Shri Rama) / Navaratri Ends" },
  { date: "2026-10-25", name: "Sharad Purnima / Dashera Havan" },
  { date: "2026-10-29", name: "Karva Choth - Sankasht Chaturthi" },
  { date: "2026-11-05", name: "Vagh Baras / Rama Ekadashi" },
  { date: "2026-11-06", name: "Dhanterash" },
  { date: "2026-11-07", name: "Kali Chaudash" },
  { date: "2026-11-08", name: "Diwali (Shri Rama Back in Ayodhya)" },
  { date: "2026-11-10", name: "New Year (Coronation Day) / Kartik Starts" },
  { date: "2026-11-11", name: "Bhai Bij / Bhai Bij" },
  { date: "2026-11-14", name: "Labh Pancham / Shree Panchmi" },
  { date: "2026-11-14", name: "New Year Annakut Mahotsav" },
  { date: "2026-11-24", name: "Dev Diwali / Purnima / Guru Nanak Jayanti" },
  { date: "2026-12-16", name: "Dhanarak / Kamuhurta Starts" },
  { date: "2026-12-23", name: "Purnima / Shri Dattatrey Jayanti" }
];

const SLOT_TIME_MAPPING = {
  "MANGAL AARTI (04:00 AM - 05:00 AM)": { start: "04:00", end: "05:00", weatherHour: 4 },
  "04:00 AM": { start: "04:00", end: "05:00", weatherHour: 4 },
  "07:00 AM - 09:00 AM": { start: "07:00", end: "09:00", weatherHour: 8 },
  "09:00 AM - 11:00 AM": { start: "09:00", end: "10:00", weatherHour: 10 },
  "11:00 AM - 12:00 PM": { start: "11:00", end: "12:00", weatherHour: 11 },
  "01:00 PM - 03:00 PM": { start: "13:00", end: "15:00", weatherHour: 14 },
  "03:00 PM - 05:00 PM": { start: "15:00", end: "17:00", weatherHour: 16 },
  "05:00 PM - 07:00 PM": { start: "17:00", end: "19:00", weatherHour: 18 },
  "07:00 PM - 09:00 PM": { start: "19:00", end: "21:00", weatherHour: 20 },
  "07:00 PM - 09:30 PM": { start: "19:00", end: "21:30", weatherHour: 20 },
  "SHRINGAR AARTI": { start: "05:00", end: "06:00", weatherHour: 5 },
  "SHAYAN AARTI": { start: "22:00", end: "23:00", weatherHour: 22 },
};

const STATUS_CONFIG = {
  AVAILABLE: { label: "✅ Available", className: "bg-green-100 text-green-700" },
  BOOKING_CLOSED: { label: "🟡 Booking Closed", className: "bg-amber-100 text-amber-700" },
  STARTED: { label: "🟠 Started", className: "bg-orange-100 text-orange-700" },
  EXPIRED: { label: "⚫ Expired", className: "bg-gray-200 text-gray-700" },
  FULL: { label: "🔴 Fully Booked", className: "bg-red-100 text-red-700" }
};

const CROWD_CONFIG = {
  LOW: { color: "text-green-700 bg-green-50 border border-green-200", dot: "bg-green-500", label: "LOW" },
  MODERATE: { color: "text-yellow-700 bg-yellow-50 border border-yellow-200", dot: "bg-yellow-500", label: "MODERATE" },
  BUSY: { color: "text-orange-700 bg-orange-50 border border-orange-200", dot: "bg-orange-500", label: "BUSY" },
  HEAVY: { color: "text-red-700 bg-red-50 border border-red-200", dot: "bg-red-500", label: "HEAVY" }
};

const STATUS_SORT_ORDER = { AVAILABLE: 1, BOOKING_CLOSED: 2, STARTED: 3, FULL: 4, EXPIRED: 5 };

function getDynamicWeatherIcon(chanceOfRain, hour = 12, conditionText = "") {
  const isNight = hour < 6 || hour >= 19;
  const condition = (conditionText || "").toLowerCase();

  if (chanceOfRain >= 50 || condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunderstorm")) {
    return <CloudRain size={13} className="text-blue-500 shrink-0 inline" />;
  }
  if ((chanceOfRain > 0 && chanceOfRain < 50) || condition.includes("cloud") || condition.includes("overcast") || condition.includes("mist")) {
    return isNight 
      ? <Cloud size={13} className="text-slate-400 shrink-0 inline" />
      : <CloudSun size={13} className="text-amber-500 shrink-0 inline" />;
  }
  return isNight 
    ? <Moon size={13} className="text-indigo-400 shrink-0 inline" />
    : <Sun size={13} className="text-orange-500 shrink-0 inline" />;
}

function generateSmartAdvisories({ temperature, rainChance, crowdLevel, festival }) {
  const advisories = [];

  if (festival) {
    advisories.push({
      icon: "🙏",
      message: "Festival day range setup active. Plan extra queue check margins."
    });
  }
  if (crowdLevel === "HIGH" || crowdLevel === "VERY HIGH" || crowdLevel === "HEAVY" || crowdLevel === "BUSY") {
    advisories.push({
      icon: "👥",
      message: "Heavy visitor density predicted. Arrive at least 30 minutes early."
    });
  }
  if (temperature >= 36) {
    advisories.push({
      icon: "☀️",
      message: "High midday heat indices forecast. Carry refreshing fluids."
    });
  }
  if (rainChance >= 50) {
    advisories.push({
      icon: "🌧️",
      message: "Precipitation highly probable. Carrying an umbrella is advised."
    });
  }
  if (advisories.length === 0) {
    advisories.push({
      icon: "✅",
      message: "Climatic maps and attendee tracking indices show favorable status."
    });
  }
  return advisories.slice(0, 3);
}

export default function RecommendationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const editMode = location.state?.mode === "edit";
  const editBooking = location.state || {};
  const bookingId = editBooking.bookingId;

  const slotsSectionRef = useRef(null);

  const [bookingType, setBookingType] = useState("DARSHAN");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [customSelectedDate, setCustomSelectedDate] = useState("");
  const [isFutureBookingDate, setIsFutureBookingDate] = useState(false);
  
  const [weatherForecastMap, setWeatherForecastMap] = useState({});
  const [backendSlots, setBackendSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const forecastData = recommendation?.forecast || [];

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
        dayName: i === 0 ? "Today" : weekdays[targetDate.getDay()],
        rawDayIndex: targetDate.getDay(),
        formattedLabel: targetDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
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
          params: { key: "e925dc04f434469e90c42358260307", q: "Ayodhya, Uttar Pradesh", days: 30, aqi: "no" }
        });

        const apiForecastDays = weatherRes.data?.forecast?.forecastday || [];
        const freshWeatherMap = {};

        dynamicSevenDays.forEach((day) => {
          const matchingApiData = apiForecastDays.find(fd => fd.date === day.date);
          if (matchingApiData) {
            freshWeatherMap[day.date] = {
              avgTemp: matchingApiData.day.avgtemp_c,
              maxTemp: matchingApiData.day.maxtemp_c,
              minTemp: matchingApiData.day.mintemp_c,
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

        const recommendRes = await api.post("/recommend", {
            visit_date: selectedDate,
            people_count: 1,
            preferred_time: null,
        });

        if (recommendRes.data.success) {
            setRecommendation(recommendRes.data);
        }
      } catch (err) {
        console.error("Database connection fault:", err);
      } finally {
        setLoading(false);
      }
    }
    if (selectedDate) fetchDatabaseCapacityMetrics();
  }, [selectedDate, bookingType]);

  useEffect(() => {
    if (!editMode) return;

    setSelectedDate(editBooking.visitDate || "");
    const today = new Date();
    const visit = new Date(editBooking.visitDate);
    const diff =
        Math.ceil((visit - today)/(1000*60*60*24));
    setIsFutureBookingDate(diff >= 7);
    setSelectedSlot(null);
    setBookingType(editBooking.bookingType || "DARSHAN");
  }, [editMode, editBooking]);

  const activeDayFestivalContext = useMemo(() => {
    return FESTIVAL_DATABASE.find(f => f.date === selectedDate) || null;
  }, [selectedDate]);

  const integratedSlotsList = useMemo(() => {
    const activeWeatherDay = weatherForecastMap[selectedDate];

    const mapped = backendSlots.map((dbSlot) => {
      const slotInfo = SLOT_TIME_MAPPING[dbSlot.slot];
      const hourIndex = slotInfo?.weatherHour ?? 12;
      let liveTemp = 24;
      let liveRainChance = 0;
      let liveCondition = "Clear";

      if (activeWeatherDay?.hourlyArray) {
        const hourData = activeWeatherDay.hourlyArray[hourIndex];
        if (hourData) {
          liveTemp = Math.round(hourData.temp_c);
          liveRainChance = hourData.chance_of_rain || 0;
          liveCondition = hourData.condition?.text || "Clear";
        }
      }

      return {
        ...dbSlot,
        temp: liveTemp,
        rainChance: liveRainChance,
        condition: liveCondition,
        weatherHour: hourIndex
      };
    });

    return mapped.sort((a, b) => {
      const orderA = STATUS_SORT_ORDER[a.status] || 99;
      const orderB = STATUS_SORT_ORDER[b.status] || 99;
      return orderA - orderB;
    });
  }, [backendSlots, selectedDate, weatherForecastMap]);

  
  const activeDaySummary = useMemo(() => {
    const match = forecastData.find(
        (c) => c.date === selectedDate
    );

    const dateObj = new Date(selectedDate);

    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    return {
        dayName:
            isNaN(dateObj.getDay())
                ? "---"
                : weekdays[dateObj.getDay()],

        timeSlot:
            selectedSlot?.slot || "Not Selected",

        expectedVisitors:
            match?.expected_visitors ?? null,

        expectedWait:
            match?.expected_wait ?? null,
            
        crowdLevel:
            match?.crowd_level ?? null,
    };
  }, [selectedDate, selectedSlot, forecastData]);

  const smartAdvisories = useMemo(() => {
    return generateSmartAdvisories({
      temperature: selectedSlot?.temp ?? 24,
      rainChance: selectedSlot?.rainChance ?? 0,
      crowdLevel: selectedSlot?.crowd_level ?? "LOW",
      festival: activeDayFestivalContext !== null
    });
  }, [selectedSlot, activeDayFestivalContext]);

  const handleContinueSelection = () => {
    if (!selectedSlot || !selectedSlot.available) return;
    navigate("/devotee/booking", {
      state: {
        visitDate: selectedDate,
        selectedSlot,
        recommendation: recommendation?.ai_recommendation,
        bookingType,
        mode: editMode ? "edit" : "create",
        bookingId,
        originalBooking: editBooking,
      },
    });
  };

  const handleApplyAIRecommendation = async () => {
    if (!recommendation) return;
    
      setBackendSlots([]);
      setSelectedDate(recommendation.ai_recommendation.date);
      setSelectedSlot(null);

      slotsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
      });
  };

  const handleCustomDateSelection = async (date) => {
    setCustomSelectedDate(date);
    setSelectedDate(date);
    setSelectedSlot(null);
    setShowCalendarPicker(false);

    const today = new Date();
    const selected = new Date(date);

    const difference =
      Math.ceil((selected - today) / (1000 * 60 * 60 * 24));

    setIsFutureBookingDate(difference >= 7);

    try {
      const slotsRes = await api.get(
        `/available-slots?visit_date=${date}&booking_type=${bookingType}`
      );

      if (slotsRes.data?.success) {
        setBackendSlots(slotsRes.data.slots || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getMaximumBookingDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 30);

    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-gradient-to-b from-[#FFFDF8] via-[#FFF9F2] to-[#F8FAFC] w-full font-sans">
      <main className="p-4 md:p-6 space-y-8 flex-1 max-w-5xl w-full mx-auto text-left text-slate-900 antialiased">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
              {editMode ? "Update Your Booking" : "Plan Your Darshan"}
            </h1>
            <p className="text-sm font-medium text-slate-700">
              {editMode 
                ? "Review your details below and make any necessary adjustments to your existing booking." 
                : "Choose your preferred date and time. Recommendations are based on crowd levels, weather, and slot availability."
              }
            </p>
          </div>

          <div className="inline-flex gap-1.5 rounded-xl border border-[#fde7c2] bg-gradient-to-br from-[#fffdf8] to-[#fff7ed] p-1.5 shadow-sm shadow-orange-100/40">
            {["DARSHAN", "AARTI"].map((type) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setBookingType(type);
                  setSelectedSlot(null);
                }}
                className={`relative overflow-hidden px-5 py-2.5 rounded-lg font-bold text-xs tracking-[0.18em] uppercase transition-all duration-300 ${
                  bookingType === type
                    ? "bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#c2410c] text-white shadow-md shadow-orange-300/40"
                    : "bg-transparent text-[#9a6b2d] hover:bg-[#fff4df] hover:text-[#c2410c]"
                }`}
              >
                {bookingType === type && (
                  <motion.div
                    layoutId="bookingTypeIndicator"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#c2410c] -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}

                <span className="relative z-10">{type}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
                ✏️
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-black text-amber-900">
                  Edit Existing Booking
                </h2>
                <p className="text-sm text-amber-800 mt-1">
                  Update your visit date, time slot or number of devotees.
                </p>
                <div className="mt-4 grid md:grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-amber-100">
                    <p className="text-xs text-slate-500 font-semibold">Current Date</p>
                    <p className="font-bold">{editBooking.visitDate}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-amber-100">
                    <p className="text-xs text-slate-500 font-semibold">Current Slot</p>
                    <p className="font-bold">{editBooking.selectedSlot?.slot || "N/A"}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-amber-100">
                    <p className="text-xs text-slate-500 font-semibold">Booking Type</p>
                    <p className="font-bold">{editBooking.bookingType}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* BOOKING JOURNEY PROGRESS INDICATOR */}
        <div className="w-full max-w-3xl mx-auto rounded-2xl border border-[#fde7c2] bg-gradient-to-br from-[#fffdf8] to-[#fff7ed] p-5 shadow-md shadow-orange-100/40">
          <div className="relative flex items-center justify-between px-6 md:px-12">
            {/* Background Line */}
            <div className="absolute left-12 right-12 top-5 h-[3px] rounded-full bg-[#fde7c2] z-0 overflow-hidden">
              {/* Active Progress */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "0%" }} // 0% -> Step 1, 50% -> Step 2, 100% -> Step 3
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c]"
              />
            </div>

            {/* ================= STEP 1 ================= */}
            <div className="flex flex-col items-center relative z-10">
              <motion.div
                animate={{
                  y: [0, -2, 0],
                  scale: [1, 1.04, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(249,115,22,0.35)",
                    "0 0 0 12px rgba(249,115,22,0)",
                  ],
                }}
                transition={{
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  },
                }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fb923c] via-[#ea580c] to-[#c2410c] text-white flex items-center justify-center font-black text-[15px] ring-[5px] ring-[#fff8e8]"
              >
                1
              </motion.div>
              <span className="mt-2 text-xs font-bold tracking-wide text-[#c2410c]">
                {editMode ? "Edit Booking" : "Plan Visit"}
              </span>
            </div>

            {/* ================= STEP 2 ================= */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#fffaf2] border-2 border-[#f3d5a4] text-[#c48a35] flex items-center justify-center font-bold text-[15px] transition-all duration-300 hover:bg-[#fff4df] hover:border-[#f59e0b]">
                2
              </div>
              <span className="mt-2 text-xs font-medium tracking-wide text-[#b78a3d]">
                {editMode ? "Review" : "Booking"}
              </span>
            </div>

            {/* ================= STEP 3 ================= */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#fffaf2] border-2 border-[#f3d5a4] text-[#c48a35] flex items-center justify-center font-bold text-[15px] transition-all duration-300 hover:bg-[#fff4df] hover:border-[#f59e0b]">
                3
              </div>
              <span className="mt-2 text-xs font-medium tracking-wide text-[#b78a3d]">
                {editMode ? "Update" : "Confirmation"}
              </span>
            </div>

          </div>
        </div>

        {/* HERO: AI RECOMMENDED PLAN */}
        {!isFutureBookingDate && (
        <AnimatePresence mode="wait">
          {recommendation && (
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
                
                <div className="flex items-center gap-4 self-start sm:self-center bg-white px-4 py-2 rounded-lg border border-amber-200 shadow-3xs shrink-0 text-xs">
                  <div className="text-center">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Recommendation Score</span>
                    <span className="font-black text-slate-900 text-sm">{recommendation.ai_recommendation.recommendation_score}/100</span>
                  </div>
                  <div className="w-[1px] h-7 bg-slate-200" />
                  <div className="text-center">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Confidence</span>
                    <span className="font-black text-[#ea580c] text-sm">{recommendation.ai_recommendation.confidence}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2 flex-1">
                    {recommendation.ai_recommendation.reasons.map((reason) => (
                        <span
                            key={reason}
                            className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold"
                        >
                            {reason}
                        </span>
                    ))}
                </div>
                <button
                  type="button"
                  onClick={handleApplyAIRecommendation}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs uppercase tracking-wider border-0 shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  <Zap size={13} fill="currentColor" />
                  Auto-Apply Plan
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs font-semibold">
                <div className="bg-white p-3 rounded-lg border border-[#f3e3c3]">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-wider font-bold">Recommended Date</span>
                  <span className="font-extrabold text-[#ea580c] text-sm mt-0.5 block">{`${recommendation.ai_recommendation.day}, ${recommendation.ai_recommendation.date}`}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#f3e3c3]">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-wider font-bold">Recommended Time</span>
                  <span className="font-extrabold text-amber-700 text-sm mt-0.5 block">Choose Preferred Slot</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#f3e3c3]">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-wider font-bold">Expected Crowd</span>
                  <span className={`font-extrabold text-sm mt-1 block ${
                      recommendation.ai_recommendation.crowd_level === "LOW"
                          ? "text-green-600"
                          : recommendation.ai_recommendation.crowd_level === "MODERATE"
                          ? "text-yellow-600"
                          : recommendation.ai_recommendation.crowd_level === "BUSY"
                          ? "text-orange-600"
                          : "text-red-600"
                  }`}>{recommendation.ai_recommendation.crowd_level}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}

        {/* CHOOSE DATE (7-DAY FORECAST CARDS) */}
        <div className="space-y-4 pt-2">
          <div className="px-1 space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 m-0">
              <span className="text-[#ea580c] font-extrabold">1.</span> Choose Date
            </h2>
            <p className="text-sm text-slate-600 m-0">Select your preferred visit date.</p>
          </div>
          
          {forecastData.length === 0 && !loading ? (
            <div className="text-center py-10 text-slate-500 font-bold text-xs bg-white rounded-xl border border-[#f3e3c3] shadow-3xs space-y-2">
              <span className="text-2xl block">📅</span>
              <p className="m-0 tracking-wide">Forecast is currently unavailable. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {dynamicSevenDays.map((d) => {
                const isSelected = selectedDate === d.date;
                const match = forecastData.find(c => c.date === d.date);
                const weatherMatch = weatherForecastMap[d.date];
                
                const crowdLevelStr = match ? match.crowd_level?.toUpperCase() : "LOW";
                const crowdConfig = CROWD_CONFIG[crowdLevelStr] || CROWD_CONFIG.LOW;
                const visitorCount = match ? match.expected_visitors : null;

                const dynamicIcon = weatherMatch 
                  ? getDynamicWeatherIcon(weatherMatch.chanceOfRain, 12, weatherMatch.conditionText)
                  : <Sun size={13} className="text-orange-500" />;

                return (
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    key={d.date}
                    onClick={() => { setSelectedDate(d.date); setSelectedSlot(null); }}
                    className={`p-3 rounded-xl border-2 flex flex-col justify-between items-center h-40 cursor-pointer transition-all duration-200 relative overflow-hidden select-none ${
                      isSelected 
                        ? "border-[#ea580c] bg-[#fff7ed] shadow-md scale-[1.02]" 
                        : "border-[#f3e3c3] bg-white hover:border-[#ea580c]"
                    }`}
                  >
                    
                    <div className="flex flex-col items-center w-full text-center">
                      <h4 className="text-sm font-bold text-slate-900 leading-none">{d.dayName}</h4>
                      <p className="text-[11px] text-slate-400 font-bold leading-none mt-0.5">{d.formattedLabel}</p>
                      {recommendation?.ai_recommendation?.date === d.date && (
                          <span className="mt-1 px-1.5 py-0 rounded-full bg-orange-500 text-white text-[8px] font-black uppercase tracking-tight truncate max-w-full">
                              ⭐ AI Pick
                          </span>
                      )}
                    </div>

                    <div className="flex flex-col items-center space-y-1 w-full my-1.5">
                      <span className={`inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded-md font-bold text-[9px] tracking-wide uppercase max-w-[95px] w-full truncate border ${crowdConfig.color}`}>
                        <span className={`w-1 h-1 rounded-full shrink-0 ${crowdConfig.dot}`} />
                        <span className="truncate">{crowdConfig.label}</span>
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-0.5 justify-center">
                        <div className="flex flex-col items-center">
                            <span className="text-[11px] font-extrabold text-slate-700">
                                👥 {visitorCount !== null ? visitorCount.toLocaleString() : "--"}
                            </span>

                            <span className="text-[10px] text-slate-500 font-bold">
                                🕒 {match?.expected_wait ?? "--"} min
                            </span>
                        </div>
                      </span>
                    </div>

                    <div className="w-full border-t border-slate-100 my-0.5" />

                    <div className="w-full flex items-center justify-between text-[9px] font-black tracking-tight text-slate-500 mt-auto whitespace-nowrap gap-1">
                      <div className="flex flex-col items-center bg-slate-50 border border-slate-100 px-1 py-0.5 rounded grow text-center">
                        <span className="text-[8px] text-slate-400 font-bold uppercase block leading-none mb-0.5">Range</span>
                        <span className="text-slate-800 leading-none">{weatherMatch ? `${Math.round(weatherMatch.maxTemp)}°/${Math.round(weatherMatch.minTemp)}°` : "--"}</span>
                      </div>
                      <div className="flex flex-col items-center bg-slate-50 border border-slate-100 px-1 py-0.5 rounded grow text-center">
                        <span className="text-[8px] text-slate-400 font-bold uppercase block leading-none mb-0.5">Rain</span>
                        <span className="text-slate-800 leading-none flex items-center gap-0.5 justify-center">
                          {dynamicIcon}
                          <span>{weatherMatch ? `${weatherMatch.chanceOfRain}%` : "--"}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-[#f3e3c3] rounded-xl p-5 shadow-sm"
        >
          <button
            onClick={() => setShowCalendarPicker(!showCalendarPicker)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-[#ea580c] text-[#ea580c] font-bold hover:bg-orange-50 transition"
          >
            <Calendar size={18} />
            Select Another Date
          </button>

          {customSelectedDate && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <div>
              <p className="text-xs text-slate-500 font-semibold">
                Future Booking Date
              </p>
              <p className="font-bold text-slate-900">
                {new Date(customSelectedDate).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <button
              onClick={() => {
                setCustomSelectedDate("");
                setIsFutureBookingDate(false);
                setSelectedDate(dynamicSevenDays[0].date);
              }}
              className="text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Clear
            </button>
          </div>
        )}

          <AnimatePresence>
            {showCalendarPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <input
                  type="date"
                  value={customSelectedDate}
                  min={dynamicSevenDays[0]?.date}
                  max={getMaximumBookingDate()}
                  onChange={(e) => handleCustomDateSelection(e.target.value)}
                  className="w-full rounded-lg border border-orange-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                />

                <p className="mt-2 text-xs text-slate-500">
                  You can select any date within the next 30 days.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {isFutureBookingDate && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Info className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <h3 className="text-base font-bold text-blue-900">
                  Future Booking Selected
                </h3>

                <div className="mt-2 space-y-1 text-sm text-blue-800">
                  <p>• Booking is available up to <strong>30 days</strong> in advance.</p>
                  <p>• AI Forecast & Weather are shown only for the next <strong>7 days</strong>.</p>
                  <p>• Predictions will appear automatically when your visit date enters the 7-day window.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </motion.div>

        {/* FESTIVAL ALERT PANEL */}
        {!isFutureBookingDate && (
        <AnimatePresence>
          {activeDayFestivalContext && (
            <motion.div 
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              className="bg-[#fff7ed] border border-amber-200 rounded-xl p-4 flex items-center gap-3.5 shadow-3xs"
            >
              <Sparkles size={16} className="text-[#ea580c] shrink-0" />
              <span className="text-xs font-semibold text-amber-990 leading-relaxed">
                <strong className="text-amber-950 font-bold">Festival Notice:</strong> {selectedDate} lines up with <strong className="text-amber-950 font-black">{activeDayFestivalContext.name}</strong>. Higher visitor traffic is expected due to the festival.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        )}

        {/* AVAILABLE SLOTS ALLOCATION */}
        <div ref={slotsSectionRef} className="space-y-4 pt-2">
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
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {integratedSlotsList.map((slot) => {
                const isSelected = selectedSlot?.slot === slot.slot;
                const status = STATUS_CONFIG[slot.status] || STATUS_CONFIG.AVAILABLE;
                const crowdConfig = CROWD_CONFIG[slot.crowd_level?.toUpperCase()] || CROWD_CONFIG.LOW;

                const totalCap = slot.total_capacity;
                const bookedCount = slot.booked ?? 0;
                const occupancyPercentage = Math.round((bookedCount / totalCap) * 100);

                let progressColor = "bg-green-500";
                if (occupancyPercentage >= 40) progressColor = "bg-yellow-500";
                if (occupancyPercentage >= 70) progressColor = "bg-orange-500";
                if (occupancyPercentage >= 90) progressColor = "bg-red-500";

                const isBlocked = !slot.available;
                const runtimeSlotIcon = getDynamicWeatherIcon(slot.rainChance, slot.weatherHour, slot.condition);

                return (
                  <motion.div
                    whileHover={!isBlocked ? { y: -4 } : {}}
                    whileTap={!isBlocked ? { scale: 0.99 } : {}}
                    key={slot.slot}
                    onClick={() => !isBlocked && setSelectedSlot(slot)}
                    className={`p-5 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between h-auto relative text-left ${
                      isBlocked
                        ? "border-[#e7d8b2] bg-[#faf7f2] opacity-60 cursor-not-allowed shadow-none"
                        : isSelected 
                          ? "border-[#ea580c] bg-[#fff7ed] shadow-lg ring-2 ring-[#ea580c]/10" 
                          : "border-[#f3e3c3] bg-white hover:shadow-lg"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2 w-full">
                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight m-0 leading-tight">{slot.slot}</h3>
                        {isSelected && (
                          <span className="px-2 py-0.5 bg-[#ea580c] text-white font-bold text-[10px] rounded uppercase tracking-wider shrink-0 shadow-3xs">
                            ✓ Selected
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-3xs ${status.className}`}>
                          {status.label}
                        </span>
                        
                      </div>
                    </div>

                    <div className="w-full border-t border-slate-100 my-3.5" />

                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-500 font-bold text-[11px]">🎟 Devotees Booked</span>
                        <span className="font-black text-slate-900">
                          {bookedCount.toLocaleString()} <span className="text-slate-400 font-semibold">/ {totalCap.toLocaleString()} Max</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-600 pt-0.5 whitespace-nowrap gap-2">
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${crowdConfig.dot}`} />
                          <span>{crowdConfig.label} Crowd</span>
                        </div>
                        
                        <div className="flex items-center gap-1 font-black text-slate-700 text-[10px]">
                          <div className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded flex flex-col items-center">
                            <span className="text-[7.5px] uppercase font-bold text-slate-400 leading-none mb-0.5">Temp</span>
                            <span className="leading-none">{slot.temp}°C</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded flex flex-col items-center">
                            <span className="text-[7.5px] uppercase font-bold text-slate-400 leading-none mb-0.5">Rain</span>
                            <span className="leading-none flex items-center gap-0.5">
                              {runtimeSlotIcon}
                              <span>{slot.rainChance}%</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-50 flex items-center gap-3 w-full">
                      <div className="flex-1 h-2 bg-[#f3e3c3] rounded-full overflow-hidden">
                        <div className={`h-full ${progressColor} transition-all duration-300`} style={{ width: `${Math.min(100, occupancyPercentage)}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-700 shrink-0 whitespace-nowrap bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                        {occupancyPercentage}% Filled
                      </span>
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* SMART ADVISORY BLOCK */}
        {!isFutureBookingDate && (
        <div className="bg-white border border-[#f3e3c3] rounded-xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">Smart Advisory</h4>
          </div>
          <div className="space-y-2">
            {smartAdvisories.map((item, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-slate-700">{item.message}</span>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* YOUR VISIT SUMMARY HUD */}
        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md border border-slate-950">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5 shrink-0">
              <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400 m-0">Your Visit Summary</h4>
              <p className="text-xs font-semibold text-slate-300 m-0">Review your selected visit details.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700/60 w-full md:w-auto">
              <div className="shrink-0">
                <span className="text-slate-400 text-[10px] uppercase block tracking-wider mb-0.5">Visit Date</span>
                <span className="text-white text-sm block font-black whitespace-nowrap">{selectedDate} ({activeDaySummary.dayName})</span>
              </div>
              <div className="shrink-0">
                <span className="text-slate-400 text-[10px] uppercase block tracking-wider mb-0.5">Time Slot</span>
                <span className="text-amber-400 text-sm font-black leading-snug break-words max-w-[240px] block">{activeDaySummary.timeSlot}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block tracking-wider mb-0.5">
                    Expected Visitors
                </span>

                {activeDaySummary.expectedVisitors !== null ? (
                    <span className="text-white text-sm font-black">
                        {activeDaySummary.expectedVisitors.toLocaleString()}
                    </span>
                ) : (
                    <span className="text-slate-400 text-xs font-semibold">
                        Prediction Pending
                    </span>
                )}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block tracking-wider mb-0.5">
                    Expected Wait
                </span>

                {activeDaySummary.expectedWait !== null ? (
                    <span className="text-orange-400 text-sm font-black">
                        {activeDaySummary.expectedWait} min
                    </span>
                ) : (
                    <span className="text-slate-400 text-xs font-semibold">
                        Prediction Pending
                    </span>
                )}
              </div>
              <div className="shrink-0">
                <span className="text-slate-400 text-[10px] uppercase block tracking-wider mb-0.5">Crowd Level</span>
                {activeDaySummary.crowdLevel ? (
                  <span
                      className={`text-sm block font-black whitespace-nowrap ${
                          activeDaySummary.crowdLevel === "LOW"
                              ? "text-green-400"
                              : activeDaySummary.crowdLevel === "MODERATE"
                              ? "text-yellow-400"
                              : activeDaySummary.crowdLevel === "BUSY"
                              ? "text-orange-400"
                              : "text-red-400"
                      }`}
                  >
                      {activeDaySummary.crowdLevel}
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs font-semibold">
                      Prediction Pending
                  </span>
                )}
              </div>
              <div className="shrink-0">
                <span className="text-slate-400 text-[10px] uppercase block tracking-wider mb-0.5">Booking Type</span>
                <span className="text-amber-400 text-sm block font-black capitalize whitespace-nowrap">{bookingType.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* WEATHER INFORMATION SYSTEM */}
        {!isFutureBookingDate && (
        <div className="bg-white border border-orange-200 rounded-xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center gap-3">
            <CloudSun size={20} className="text-[#ea580c]" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">Weather Information</h4>
              <p className="text-sm font-bold text-slate-900 m-0">{weatherForecastMap[selectedDate]?.conditionText || "Loading..."}</p>
            </div>
          </div>

          {weatherForecastMap[selectedDate] ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#fffbeb] border border-orange-200 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 m-0">Temperature</p>
                  <p className="text-lg font-black text-slate-900 m-0">{Math.round(weatherForecastMap[selectedDate].avgTemp)}°C</p>
                </div>
                <Thermometer size={20} className="text-[#ea580c] opacity-80" />
              </div>
              <div className="bg-[#fffbeb] border border-orange-200 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 m-0">Humidity</p>
                  <p className="text-lg font-black text-slate-900 m-0">{weatherForecastMap[selectedDate].humidity}%</p>
                </div>
                <Droplets size={20} className="text-blue-500 opacity-80" />
              </div>
              <div className="bg-[#fffbeb] border border-orange-200 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 m-0">Wind Speed</p>
                  <p className="text-lg font-black text-slate-900 m-0">{weatherForecastMap[selectedDate].windSpeed || "N/A"} km/h</p>
                </div>
                <Wind size={20} className="text-teal-600 opacity-80" />
              </div>
              <div className="bg-[#fffbeb] border border-orange-200 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 m-0">UV Index</p>
                  <p className="text-lg font-black text-slate-900 m-0">{weatherForecastMap[selectedDate].uv || "--"}</p>
                </div>
                <Sun size={20} className="text-amber-500 opacity-80" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Weather information is loading...</p>
          )}
        </div>
        )}

      </main>

      {/* STICKY FOOTER ACTION TRAY */}
      <div className="w-full bg-white/95 backdrop-blur-xs border-t border-orange-200 px-4 py-4 mt-8 sticky bottom-0 z-10 shadow-lg">
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
              disabled={!selectedSlot || !selectedSlot.available}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-black text-xs tracking-widest transition-all uppercase border-0 flex items-center justify-center gap-1.5 cursor-pointer ${
                (selectedSlot && selectedSlot.available)
                  ? "bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm active:scale-[0.995]" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              {editMode ? "Review & Update Booking" : "Continue to Booking"}
              <ArrowRight size={13} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}