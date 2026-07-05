import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, HeartPulse, Flame, PhoneCall, AlertTriangle, UserX, ArrowUpRight, Check, X } from "lucide-react";

const HELPLINES = [
  { name: "Police Assistance", number: "112", display: "Emergency: 112", icon: Shield, bg: "bg-blue-50 text-blue-600 ring-blue-100/50" },
  { name: "Medical Emergency", number: "108", display: "Emergency: 108", icon: HeartPulse, bg: "bg-emerald-50 text-emerald-600 ring-emerald-100/50" },
  { name: "Fire Services", number: "101", display: "Emergency: 101", icon: Flame, bg: "bg-red-50 text-red-600 ring-red-100/50" },
  { name: "Temple Helpdesk", number: "1800-123-4567", display: "Helpline: 1800-123-4567", icon: PhoneCall, bg: "bg-orange-50 text-orange-600 ring-orange-100/50" },
];

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const [activeCallConfirm, setActiveCallConfirm] = useState(null);

  const handleHelplineClick = (e, line) => {
    e.preventDefault();
    setActiveCallConfirm(line);
  };

  const executePhoneCall = (number) => {
    window.location.href = `tel:${number.replace(/[^0-9]/g, "")}`;
    setActiveCallConfirm(null);
  };

  return (
    <div className="w-full space-y-6 text-left">
      
      {/* ==================== ACTION BOX LAYOUT ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        
        {/* HERO SOS CARD (RED ACCENT) */}
        <motion.button 
          whileHover={{ y: -2, scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          onClick={() => navigate("/devotee/emergency-sos")}
          className="md:col-span-3 overflow-hidden flex flex-col justify-between p-6 bg-gradient-to-br from-rose-600 via-red-600 to-orange-600 text-white rounded-2xl shadow-md shadow-red-600/10 cursor-pointer border-0 group relative min-h-[160px]"
        >
          <div className="flex justify-between items-start w-full z-10">
            <div className="p-3 bg-white/15 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
              <AlertTriangle className="animate-pulse text-white" size={24} />
            </div>
            <div className="p-1.5 bg-black/10 rounded-full text-white/80 group-hover:bg-white/20 group-hover:text-white transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </div>
          
          <div className="space-y-1 z-10 text-left">
            <span className="text-[10px] font-black tracking-widest bg-black/15 text-white border border-white/10 px-2.5 py-0.5 rounded-full uppercase">Emergency SOS</span>
            <h3 className="text-xl font-black tracking-wide mt-1 m-0">Emergency SOS</h3>
            <p className="text-xs font-medium text-white/80 leading-normal m-0 pt-0.5">
              Share your location with temple authorities to receive immediate assistance.
            </p>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </motion.button>

        {/* MISSING PERSON CARD (CREAM + ORANGE THEME) */}
        <motion.button 
          whileHover={{ y: -2, scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          onClick={() => navigate("/devotee/missing-person")}
          className="md:col-span-2 overflow-hidden flex flex-col justify-between p-6 bg-gradient-to-br from-[#FFFDF8] via-[#FFF9F2] to-[#FFF6ED] border border-[#f3e3c3] text-slate-900 rounded-2xl shadow-2xs cursor-pointer group relative min-h-[160px]"
        >
          <div className="flex justify-between items-start w-full z-10">
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl shadow-3xs text-[#ea580c]">
              <UserX size={24} />
            </div>
            <div className="p-1.5 bg-amber-100/50 rounded-full text-slate-500 group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </div>

          <div className="space-y-1 z-10 text-left">
            <span className="text-[10px] font-black tracking-widest bg-orange-50 text-amber-800 border border-amber-200/60 px-2.5 py-0.5 rounded-full uppercase">Help Desk</span>
            <h3 className="text-lg font-black tracking-wide mt-1 text-slate-900 m-0">Missing Person</h3>
            <p className="text-xs font-medium text-slate-600 leading-normal m-0 pt-0.5">
              Report or search for a missing family member during your visit.
            </p>
          </div>
        </motion.button>

      </div>

      {/* ==================== LINE CALL CONFIRMATION OVERLAY DRAWER ==================== */}
      <AnimatePresence>
        {activeCallConfirm && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-full bg-[#fffbeb] border border-[#f3e3c3] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-orange-700 border border-[#f3e3c3] shrink-0">
                <PhoneCall size={16} className="animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Call {activeCallConfirm.name}?</span>
                <p className="text-[11px] text-slate-500 font-semibold m-0 mt-0.5">This will launch your system dialer to call {activeCallConfirm.number}.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button 
                onClick={() => setActiveCallConfirm(null)}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <X size={12} /> Cancel
              </button>
              <button 
                onClick={() => executePhoneCall(activeCallConfirm.number)}
                className="flex-1 sm:flex-initial px-4 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-lg text-xs font-black transition flex items-center justify-center gap-1 border-0 cursor-pointer shadow-xs"
              >
                <Check size={12} /> Call Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== HELPLINE CARD PANEL GRID ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {HELPLINES.map((line) => (
          <a
            key={line.name}
            href={`tel:${line.number}`}
            onClick={(e) => handleHelplineClick(e, line)}
            className="group flex items-center gap-4 p-4 bg-white border border-[#f3e3c3] rounded-xl transition-all duration-300 hover:shadow-sm hover:border-orange-200 hover:bg-[#fffaf2] hover:-translate-y-0.5 text-slate-900 decoration-none"
          >
            <div className={`p-3 rounded-full shrink-0 ring-4 ring-transparent transition-transform duration-300 group-hover:scale-105 ${line.bg}`}>
              <line.icon size={18} />
            </div>
            
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{line.name}</span>
              <span className="font-black text-slate-900 text-sm tracking-tight group-hover:text-[#ea580c] transition-colors">{line.display}</span>
            </div>
          </a>
        ))}
      </div>
      
    </div>
  );
}