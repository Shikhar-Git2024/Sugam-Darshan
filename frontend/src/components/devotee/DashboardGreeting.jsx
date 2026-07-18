import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, Compass } from "lucide-react";
import heroBanner from "../../assets/images/header-banner.png";

const FESTIVAL_REGISTRY = {
  "2026-01-14": "Uttarayan / Makar Sankranti / Dhanurmas Ends",
  "2026-01-23": "Vasant Panchami",
  "2026-02-01": "Maghi Purnima",
  "2026-02-15": "Mahashivratri",
  "2026-03-02": "Holi / Purnima / Holashtak Ends",
  "2026-03-03": "Dhuleti / Vasantotsav / Purnima",
  "2026-03-19": "Gudi Padwa / Chaitra Starts / Chaitra Navratri Starts",
  "2026-03-26": "Ram Navami / Chaitra Navratri Ends",
  "2026-03-28": "Ramnavami Annakut Mahotsav",
  "2026-04-02": "Shree Hanuman Jayanti / Chaitri Purnima",
  "2026-04-19": "Akshay Trutia (Akha Trij)",
  "2026-04-25": "Sita Navami – Janaki Jayanti",
  "2026-05-01": "Buddha (Vaishakhi) Purnima",
  "2026-05-17": "Adhik Mas Starts",
  "2026-06-16": "Ram Rathotsav - Rath Yatra",
  "2026-06-27": "Vatasavitri Vrata Starts",
  "2026-06-29": "Devsnan Purnima / Vatasavitri Vrata Ends",
  "2026-07-25": "Devpodhi Ekadashi / Gauri Vrata Starts",
  "2026-07-27": "Jayaparvati Vrata Starts",
  "2026-07-29": "Guru Purnima / Vyas Purnima / Gauri Vrata Ends",
  "2026-08-01": "Jayaparvati Vrata Ends",
  "2026-08-12": "Divaso / Hariyali Amavasya / Evrta-Jeevrat",
  "2026-08-17": "Nag Panchami",
  "2026-08-18": "Randhan Chhath",
  "2026-08-19": "Sitala Satam",
  "2026-08-28": "Rakshabandhan / Nariyeli Purnima",
  "2026-09-04": "Janmashtami – Shree Krishna Jayanti",
  "2026-09-05": "Krishna Jayanti Annakut Mahotsav",
  "2026-09-14": "Ganesh Chaturthi / Kevda Trij",
  "2026-09-15": "Rushi Panchami / Sama Pancham",
  "2026-09-19": "Dharo Atham",
  "2026-09-26": "Bhadarvi Purnima",
  "2026-09-27": "Shradh Paksha Starts",
  "2026-10-10": "Sarvapitri Amavasya / Shradh Paksha Ends",
  "2026-10-11": "Navaratri Starts / Aso Starts",
  "2026-10-20": "Dashera (Victory Day of Shri Rama) / Navaratri Ends",
  "2026-10-25": "Sharad Purnima / Dashera Havan",
  "2026-10-29": "Karva Choth - Sankasht Chaturthi",
  "2026-11-05": "Vagh Baras / Rama Ekadashi",
  "2026-11-06": "Dhanterash",
  "2026-11-07": "Kali Chaudash",
  "2026-11-08": "Diwali (Shri Rama Back in Ayodhya)",
  "2026-11-10": "New Year (Coronation Day) / Kartik Starts",
  "2026-11-11": "Bhai Bij / Bhai Bij",
  "2026-11-14": "Labh Pancham / Shree Panchmi / New Year Annakut Mahotsav",
  "2026-11-24": "Dev Diwali / Purnima / Guru Nanak Jayanti",
  "2026-12-16": "Dhanarak / Kamuhurta Starts",
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
      return { title: "Good Morning", subtitle: "Plan your Darshan with live crowd intelligence, weather insights, and AI-powered recommendations for a smooth pilgrimage." };
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
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative w-full h-[260px] lg:h-[280px] overflow-hidden border-b border-white/20 shadow-[inset_0_-20px_100px_rgba(0,0,0,0.5)]"
    style={{
      backgroundImage: `url(${heroBanner})`,
      backgroundSize: "100% 100%",
      backgroundPosition: "center",
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent"></div>
    
    <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-center">
      <div className="max-w-2xl">
        <h1 className="text-xl md:text-2xl font-medium text-white/90 tracking-wide drop-shadow-md">
          {greetingConfig.title},
        </h1>
        <h2 className="text-4xl md:text-5xl font-black text-orange-300 drop-shadow-[0_2px_10px_rgba(253,186,116,0.5)]">
          {directDevoteeName}
        </h2>
        <p className="text-white/70 font-medium text-sm md:text-base mt-1 mb-4 drop-shadow-sm">
          {greetingConfig.subtitle}
        </p>

        {/* Info Container */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 text-white/90 text-sm">
              <Clock size={16} /> {timeString}
            </span>
            <span className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 text-white/90 text-sm">
              <Calendar size={16} /> {dateString}
            </span>
          </div>

          {/* Darshan Status moved to the left and color updated to Amber */}
          <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm bg-black/30 px-3 py-1 rounded-full w-fit border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
            <span>Darshan Available</span>
          </div>
        </div>
      </div>
    </div>
  </motion.section>
);
}