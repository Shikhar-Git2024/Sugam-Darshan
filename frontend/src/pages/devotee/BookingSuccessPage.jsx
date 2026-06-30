import React, { useEffect } from "react";
import { useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { CheckCircle2, Home, CalendarCheck, Info, ArrowLeft, ShieldCheck, Compass } from "lucide-react";

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  // Auto-scroll viewport cleanly to the top on page initialization
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If no booking data exists, safely redirect to dashboard
  if (!bookingData) return <Navigate to="/devotee/dashboard" />;

  const { booking_id, transaction_id, status } = bookingData;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-amber-50/20 p-4 md:p-8 flex items-center justify-center antialiased selection:bg-orange-100">
      <div className="max-w-xl w-full space-y-5">

        {/* Success Card Sheet Panel */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xs text-center space-y-6">
          
          {/* Animated Success Badge Circle */}
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-3xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          {/* Heading Blocks */}
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Booking Confirmed</h1>
            <p className="text-base font-semibold text-slate-500 leading-normal">
              Your Darshan slot has been successfully reserved in our active database registry.
            </p>
          </div>

          {/* Scaled High-Readability Metrics Grid */}
          <div className="grid grid-cols-1 gap-3 text-left">
            {[
              { label: "Booking Reference ID", value: booking_id, icon: <Compass className="text-orange-600" size={16} /> },
              { label: "Secure Transaction Token ID", value: transaction_id || "N/A (System Direct Allocated)", icon: <ShieldCheck className="text-indigo-600" size={16} /> },
              { label: "Verification Status", value: status || "CONFIRMED", className: "text-emerald-700 font-black uppercase tracking-wide", icon: <CheckCircle2 className="text-emerald-600" size={16} /> },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/40 flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-3xs shrink-0">
                  {item.icon}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <h3 className={`text-base md:text-lg font-extrabold tracking-tight mt-0.5 break-all ${item.className || "text-slate-800"}`}>
                    {item.value}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Adaptive Post-Allocation Guidelines Note Block */}
          <div className="text-left bg-orange-50/60 border border-orange-200/60 p-4 rounded-2xl flex gap-3.5 text-sm md:text-base leading-relaxed font-bold text-orange-900 shadow-3xs">
            <Info className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
            <p>
              Please keep this reference token active on your device checkpoint screen. You can review or download your active pass credentials at any moment inside the account logs.
            </p>
          </div>

          {/* Core App Actions Controls Area */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            <button
              onClick={() => navigate("/devotee/my-bookings")}
              className="w-full py-4 rounded-2xl bg-orange-700 hover:bg-orange-800 text-white font-extrabold text-base transition shadow-lg shadow-orange-700/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarCheck size={20} />
              View My Bookings
            </button>
            <button
              onClick={() => navigate("/devotee/dashboard")}
              className="w-full py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 font-extrabold text-base hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home size={20} />
              Return to Dashboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}