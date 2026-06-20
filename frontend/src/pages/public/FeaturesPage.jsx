import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  Shield,
  MapPinned,
  Bell,
  BarChart3,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const detailedFeatures = [
  {
    id: "ai-recommendations",
    icon: Brain,
    title: "Best Time to Visit",
    tagline: "FAMILY PLANNING HELPER",
    extendedDesc: "We look at previous temple crowd trends to suggest the best times for your family to visit. This helps elders and children avoid waiting in long queues for too many hours.",
    points: [
      "Shows green hours when crowds are low",
      "Helps you plan morning or evening travel nicely",
      "Saves waiting time for family groups"
    ],
    accentColor: "from-violet-500/20 to-purple-500/5 text-violet-400 border-violet-500/20"
  },
  {
    id: "smart-booking",
    icon: Calendar,
    title: "Easy Slot Booking",
    tagline: "QUICK PHONE TICKETS",
    extendedDesc: "Book your entry passes online directly from your phone. You can pick an available time slot that matches your travel schedule perfectly before arriving at the temple gates.",
    points: [
      "Simple step-by-step phone booking",
      "Shows real-time available time slots",
      "Get digital tokens instantly on your mobile"
    ],
    accentColor: "from-blue-500/20 to-cyan-500/5 text-blue-400 border-blue-500/20"
  },
  {
    id: "crowd-forecasting",
    icon: BarChart3,
    title: "Crowd Updates",
    tagline: "LIVE STATUS COUNTERS",
    extendedDesc: "Check live crowd counters before you start your journey. This system tells you exactly how many devotees are waiting in line so you can adjust your plans accordingly.",
    points: [
      "Check live crowd levels anytime",
      "See estimated waiting time in lines",
      "Avoid traveling during unexpected heavy rush hours"
    ],
    accentColor: "from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20"
  },
  {
    id: "emergency-support",
    icon: Shield,
    title: "Emergency Support",
    tagline: "24/7 MEDICAL & HELP DESK",
    extendedDesc: "Your safety is our top priority. If you or your family members feel unwell or get lost inside the temple complex, use this tool to connect immediately with the nearest medical booth or help desk.",
    points: [
      "One-click help button on your phone",
      "Quick contact with temple medical staff",
      "Helps find lost family members easily"
    ],
    accentColor: "from-red-500/20 to-orange-500/5 text-red-400 border-red-500/20"
  },
  {
    id: "temple-navigation",
    icon: MapPinned,
    title: "Temple Route Guide",
    tagline: "EASY LOCATION PATHWAYS",
    extendedDesc: "Large temples can be confusing to navigate. Our simple map layout helps you find entry lines, prasad counters, washrooms, shoe stalls, and drinking water taps without getting lost.",
    points: [
      "Clear, easy-to-understand layout maps",
      "Directions to drinking water and seating rests",
      "Shows exact locations for prasad counters and shoe racks"
    ],
    accentColor: "from-amber-500/20 to-yellow-500/5 text-amber-400 border-amber-500/20"
  },
  {
    id: "live-notifications",
    icon: Bell,
    title: "Mobile Notifications",
    tagline: "TEXT ALERTS ON YOUR PHONE",
    extendedDesc: "Get simple text alert updates sent directly to your screen. If there is a change in darshan timings, line movements, or weather warnings, you will know immediately.",
    points: [
      "Instant updates about your line status",
      "Important announcements from temple authorities",
      "Alerts for unexpected changes or delays"
    ],
    accentColor: "from-pink-500/20 to-rose-500/5 text-pink-400 border-pink-500/20"
  }
];

export default function FeaturesPage() {
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(hash.replace("#", ""));
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-violet-500/30 py-32 relative overflow-hidden">
      {/* Mesh Configuration Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />
      
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6">
        
        {/* Return Button */}
        <button 
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 hover:text-white uppercase transition-colors duration-200 mb-12 font-mono"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
          Go back to Dashboard
        </button>

        {/* Section Technical Header */}
        <div className="border-b border-slate-800/60 pb-10 mb-24">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Detailed <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Information</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-2xl text-sm md:text-base">
            Read carefully to see how these online features make your pilgrimage completely safe and comfortable.
          </p>
        </div>

        {/* Detailed Exploded Column Matrix Layout */}
        <div className="flex flex-col gap-12">
          {detailedFeatures.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                id={item.id}
                className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 hover:border-slate-700/80 transition-all duration-300 target:border-violet-500 target:bg-violet-500/10"
              >
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Responsive Node Frame Component */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accentColor} border flex items-center justify-center shrink-0 shadow-md`} >
                    <Icon size={22} />
                  </div>

                  {/* Metrics Copy Group */}
                  <div className="flex-1">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-violet-400 bg-violet-500/5 border border-violet-500/10 px-2 py-0.5 rounded">
                      {item.tagline}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-3 tracking-tight">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-slate-400 text-xs md:text-sm leading-relaxed max-w-3xl">
                      {item.extendedDesc}
                    </p>

                    {/* Feature Checklist */}
                    <div className="grid sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-800/60">
                      {item.points.map((point, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                          <span className="font-medium">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}