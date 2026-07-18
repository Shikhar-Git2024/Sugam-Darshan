import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CheckCircle2, Home, CalendarCheck, Info, ShieldCheck, Compass, Eye, AlertCircle, FileText } from "lucide-react";

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!bookingData) return <Navigate to="/devotee/dashboard" />;

  const { 
    booking_id, 
    transaction_id, 
    status, 
    visitDate, 
    slot, 
    booking_type, 
    bookingType, 
    people_count, 
    peopleCount 
  } = bookingData;

  const finalBookingType = bookingType || booking_type || "Darshan";
  const finalPeopleCount = peopleCount || people_count || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF8] via-[#FFF9F2] to-[#F8FAFC] w-full p-4 md:p-6 flex items-center justify-center antialiased selection:bg-orange-100 text-slate-800 text-left pb-16">
      <div className="max-w-3xl w-full space-y-5">

        {/* BOOKING JOURNEY PROGRESS INDICATOR */}
        <div className="w-full max-w-3xl mx-auto rounded-2xl border border-[#fde7c2] bg-gradient-to-br from-[#fffdf8] to-[#fff7ed] p-5 shadow-md shadow-orange-100/40">
          <div className="relative flex items-center justify-between px-6 md:px-12">
            {/* Background Line */}
            <div className="absolute left-12 right-12 top-5 h-[3px] rounded-full bg-[#fde7c2] z-0 overflow-hidden">
              {/* Completed Progress: 100% */}
              <div className="h-full w-full rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c]" />
            </div>

            {/* STEP 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-black text-[15px] ring-[5px] ring-[#fff8e8]">
                ✓
              </div>
              <span className="mt-2 text-xs font-bold tracking-wide text-[#c2410c]">Plan Visit</span>
            </div>

            {/* STEP 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-black text-[15px] ring-[5px] ring-[#fff8e8]">
                ✓
              </div>
              <span className="mt-2 text-xs font-bold tracking-wide text-[#c2410c]">Booking</span>
            </div>

            {/* STEP 3 (ACTIVE) */}
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
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeOut" },
                }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fb923c] via-[#ea580c] to-[#c2410c] text-white flex items-center justify-center font-black text-[15px] ring-[5px] ring-[#fff8e8]"
              >
                3
              </motion.div>
              <span className="mt-2 text-xs font-bold tracking-wide text-[#c2410c]">Confirmation</span>
            </div>
          </div>
        </div>

        {/* MAIN DISPLAY CARD */}
        <div className="bg-white border border-[#f3e3c3] rounded-2xl p-5 md:p-7 shadow-xs space-y-5">
          
          {/* Success Badge */}
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-3xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          {/* Title & Subtitle */}
          <div className="text-center space-y-1.5">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight m-0">Booking Confirmed!</h1>
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-bold text-slate-800 m-0">
                Your entry token has been registered successfully.
              </p>
              <p className="text-[11px] font-medium text-slate-500 m-0 max-w-md mx-auto leading-relaxed">
                Your digital entry pass and QR code gate scan will turn active exactly 1 hour before your chosen time.
              </p>
            </div>
          </div>

          {/* SUMMARY GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#fffdf9] border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Booking ID</span>
              <span className="text-sm font-black text-slate-900 truncate">{booking_id || "N/A"}</span>
            </div>
            
            <div className="p-3 bg-[#fffdf9] border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visit Date</span>
              <span className="text-sm font-black text-slate-900">{visitDate || "N/A"}</span>
            </div>

            <div className="p-3 bg-[#fffdf9] border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">Time Slot</span>
              <span className="text-xs font-black text-amber-700 leading-snug break-words line-clamp-2">{slot || "N/A"}</span>
            </div>

            <div className="p-3 bg-[#fffdf9] border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
              <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
              <span className="inline-flex items-center text-[11px] font-black tracking-wide text-emerald-700 uppercase mt-auto">
                ✓ {status || "CONFIRMED"}
              </span>
            </div>
          </div>

          {/* Receipt Metadata Log Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 truncate">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-3xs shrink-0 text-slate-500">
                <ShieldCheck size={14} />
              </div>
              <div className="truncate">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px] mb-0.5">Receipt Number</span>
                <span className="font-extrabold text-slate-700 truncate block max-w-xs">{transaction_id || "Assigned at Gate"}</span>
              </div>
            </div>
            
            <div className="shrink-0 text-right">
              <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px] mb-0.5">Pass Cost</span>
              <span className="font-black text-emerald-700 tracking-wide uppercase text-[11px]">FREE</span>
            </div>
          </div>

          {/* BOOKING DETAILS CARD */}
          <div className="bg-white border border-[#f3e3c3] rounded-xl p-4 shadow-3xs space-y-3">
            <h2 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-2 pb-1.5 border-b border-slate-100 m-0 uppercase">
              <FileText className="text-[#ea580c]" size={14} /> 
              Booking Details
            </h2>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Booking Type</span>
                <span className="font-extrabold text-slate-900 capitalize">{finalBookingType.toLowerCase()}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Number of Devotees</span>
                <span className="font-extrabold text-slate-900">{finalPeopleCount} Person{Number(finalPeopleCount) > 1 ? "s" : ""}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Payment Mode</span>
                <span className="font-extrabold text-slate-900">Online Selection</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Verification Requirement</span>
                <span className="font-extrabold text-slate-900">Bring Valid ID Card</span>
              </div>
            </div>
          </div>

          {/* DIGITAL ENTRY PASS WORKFLOW INFO */}
          <div className="bg-[#f0fdf4] border border-emerald-200 p-4 rounded-xl space-y-1.5 shadow-3xs">
            <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-xs uppercase tracking-wider">
              <Compass size={14} className="text-emerald-600" />
              Digital Entry Pass Reminder
            </div>
            <p className="text-[11px] font-bold text-emerald-900 m-0">
              Your active gate entry QR Code will populate here and via updates 6 hour prior to your visit.
            </p>
            <div className="text-[10px] font-semibold text-emerald-700 space-y-0.5 pt-0.5">
              <p className="m-0 flex items-center gap-1">✓ Dashboard notice will pop up when QR becomes live.</p>
              <p className="m-0 flex items-center gap-1">✓ SMS alert will dispatch when pass becomes live.</p>
            </div>
          </div>

          {/* TWO COLUMN INSTRUCTIONS GRIDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* BEFORE YOUR VISIT */}
            <div className="bg-[#fffbeb] border border-[#f3e3c3] p-4 rounded-xl space-y-2 shadow-3xs">
              <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs uppercase tracking-wider border-b border-[#f3e3c3]/60 pb-1">
                <Info size={13} className="text-[#ea580c]" />
                Before You Arrive
              </div>
              <ul className="text-[11px] font-semibold text-slate-600 space-y-1.5 pl-0 m-0 list-none">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ea580c] font-black">✓</span>
                  <span>Reach entry line 15 mins before your time.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ea580c] font-black">✓</span>
                  <span>Carry any original Government ID card.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ea580c] font-black">✓</span>
                  <span>Keep your device battery charged for scans.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ea580c] font-black">✓</span>
                  <span>Follow security team lane instructions.</span>
                </li>
              </ul>
            </div>

            {/* HELPFUL RULES */}
            <div className="bg-[#faf6ee] border border-[#eadabe]/60 p-4 rounded-xl space-y-2 shadow-3xs">
              <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs uppercase tracking-wider border-b border-[#eadabe]/50 pb-1">
                <AlertCircle size={13} className="text-slate-500" />
                Helpful Rules
              </div>
              <ul className="text-[11px] font-semibold text-slate-600 space-y-1.5 pl-0 m-0 list-none">
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-black">•</span>
                  <span>Changes are allowed up to 6 hours before.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-black">•</span>
                  <span>Cancellations are free within the cutoff.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-black">•</span>
                  <span>Tickets are valid only for this booked slot.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* ACTIONS AREA CONTROL */}
          <div className="space-y-2 pt-1 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate(`/devotee/booking-details/${booking_id}`)}
                className="w-full py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs tracking-widest transition uppercase border-0 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-[0.995]"
              >
                <Eye size={14} />
                View Ticket
              </button>
              
              <button
                onClick={() => navigate("/devotee/my-bookings")}
                className="w-full py-3 rounded-xl border-2 border-[#ea580c] bg-transparent text-[#ea580c] hover:bg-[#fffbeb] font-black text-xs tracking-widest transition uppercase flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-[0.995]"
              >
                <CalendarCheck size={14} />
                My Bookings
              </button>
            </div>

            <button
              onClick={() => navigate("/devotee/dashboard")}
              className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-extrabold text-xs tracking-widest hover:bg-slate-100 hover:text-slate-900 transition uppercase flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-[0.995]"
            >
              <Home size={13} />
              Return to Dashboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}