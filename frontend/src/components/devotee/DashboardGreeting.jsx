import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, Compass } from "lucide-react";

const FESTIVAL_REGISTRY = {
  "2026-01-14": "Uttarayan / Makar Sankranti",
  "2026-01-23": "Vasant Panchami",
  "2026-02-01": "Maghi Purnima",
  "2026-02-15": "Mahashivratri",
  "2026-03-02": "Holi / Purnima",
  "2026-03-03": "Dhuleti / Vasantotsav",
  "2026-03-19": "Gudi Padwa / Chaitra Navratri Starts",
  "2026-03-26": "Ram Navami / Chaitra Navratri Ends",
  "2026-03-28": "Ramnavami Annakut Mahotsav",
  "2026-04-02": "Shree Hanuman Jayanti",
  "2026-04-19": "Akshay Trutia (Akha Trij)",
  "2026-04-25": "Sita Navami – Janaki Jayanti",
  "2026-05-01": "Buddha Purnima",
  "2026-05-17": "Adhik Mas Starts",
  "2026-06-16": "Ram Rathotsav - Rath Yatra",
  "2026-06-27": "Vatasavitri Vrata Starts",
  "2026-06-29": "Devsnan Purnima",
  "2026-07-25": "Devpodhi Ekadashi / Gauri Vrata Starts",
  "2026-07-27": "Jayaparvati Vrata Starts",
  "2026-07-29": "Guru Purnima / Vyas Purnima",
  "2026-08-01": "Jayaparvati Vrata Ends",
  "2026-08-12": "Divaso / Hariyali Amavasya",
  "2026-08-17": "Nag Panchami",
  "2026-08-18": "Randhan Chhath",
  "2026-08-19": "Sitala Satam",
  "2026-08-28": "Rakshabandhan / Nariyeli Purnima",
  "2026-09-04": "Janmashtami – Shree Krishna Jayanti",
  "2026-09-05": "Krishna Jayanti Annakut Mahotsav",
  "2026-09-14": "Ganesh Chaturthi",
  "2026-09-15": "Rushi Panchami",
  "2026-09-19": "Dharo Atham",
  "2026-09-26": "Bhadarvi Purnima",
  "2026-09-27": "Shradh Paksha Starts",
  "2026-10-10": "Sarvapitri Amavasya",
  "2026-10-11": "Navaratri Starts",
  "2026-10-20": "Dashera (Victory Day of Shri Rama)",
  "2026-10-25": "Sharad Purnima / Dashera Havan",
  "2026-10-29": "Karva Choth",
  "2026-11-05": "Vagh Baras / Rama Ekadashi",
  "2026-11-06": "Dhanterash",
  "2026-11-07": "Kali Chaudash",
  "2026-11-08": "Diwali (Shri Rama Back in Ayodhya)",
  "2026-11-10": "New Year (Coronation Day)",
  "2026-11-11": "Bhai Bij",
  "2026-11-14": "Labh Pancham / Shree Panchmi",
  "2026-11-24": "Dev Diwali / Purnima",
  "2026-12-16": "Dhanarak Starts",
  "2026-12-23": "Purnima / Shri Dattatrey Jayanti"
};

export default function DashboardGreeting({ user = {} }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const clockTimer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const currentHour = time.getHours();

  const greetingConfig = useMemo(() => {
    if (currentHour >= 5 && currentHour < 12) {
      return { title: "Good Morning", subtitle: "Plan your temple visit with live crowd updates and weather information." };
    } else if (currentHour >= 12 && currentHour < 17) {
      return { title: "Good Afternoon", subtitle: "Check today's crowd levels and enjoy a smooth Darshan experience." };
    } else {
      return { title: "Good Evening", subtitle: "May your visit be peaceful and spiritually fulfilling." };
    }
  }, [currentHour]);

  const timeString = useMemo(() => {
    return time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  }, [time]);

  const dateString = useMemo(() => {
    const weekday = time.toLocaleDateString("en-US", { weekday: "long" });
    const day = time.getDate();
    const month = time.toLocaleDateString("en-US", { month: "long" });
    const year = time.getFullYear();
    return `${weekday} • ${day} ${month} ${year}`;
  }, [time.getDate(), time.getMonth(), time.getFullYear()]);

  const activeFestival = useMemo(() => {
    try {
      const localizedKey = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(time);
      
      return FESTIVAL_REGISTRY[localizedKey] || null;
    } catch (e) {
      const year = time.getFullYear();
      const month = String(time.getMonth() + 1).padStart(2, "0");
      const day = String(time.getDate()).padStart(2, "0");
      return FESTIVAL_REGISTRY[`${year}-${month}-${day}`] || null;
    }
  }, [time.getDate()]); 

  const directDevoteeName = user.name || "Devotee";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-gradient-to-br from-[#FFFDF8] via-[#FFF9F2] to-[#FFF6ED] border border-amber-100/60 p-6 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left"
    >
      <div className="md:col-span-2 space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight m-0">
            {greetingConfig.title},
            <span className="block text-2xl md:text-3xl bg-gradient-to-r from-orange-700 to-amber-600 bg-clip-text text-transparent font-black mt-1">
              {directDevoteeName}
            </span>
          </h1>

          {activeFestival && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200/60 text-xs font-bold tracking-wide shadow-2xs self-center"
            >
              <span className="text-xs animate-pulse">🪔</span>
              <span>Today: {activeFestival}</span>
            </motion.div>
          )}
        </div>

        <p className="text-slate-600 font-medium text-xs md:text-sm tracking-tight leading-relaxed max-w-xl m-0">
          {greetingConfig.subtitle}
        </p>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 pt-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 absolute" />
          <span className="pl-1 text-slate-500 font-medium">Today's Darshan • <strong className="text-emerald-700 font-bold">Available</strong></span>
        </div>
      </div>

      <div className="w-full flex md:justify-end">
        <div className="w-full sm:w-auto min-w-[240px] flex items-center gap-4 bg-white border border-amber-100/60 p-3.5 rounded-xl shadow-2xs hover:border-orange-200 hover:shadow-xs transition-all duration-300 group">
          <div className="p-2.5 bg-amber-50/60 rounded-lg text-[#ea580c] border border-amber-100/30 shrink-0 group-hover:bg-orange-50 group-hover:rotate-12 transition-all duration-300">
            <Compass size={18} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-900 tracking-tight">
              <Clock size={13} className="text-slate-400 group-hover:text-orange-600 transition-colors duration-300" />
              <span>{timeString}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 tracking-tight">
              <Calendar size={12} className="text-slate-400" />
              <span>{dateString}</span>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}