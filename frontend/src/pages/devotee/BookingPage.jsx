import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  AlertCircle, 
  FileText, 
  CheckSquare, 
  Info, 
  ArrowLeft, 
  Compass, 
  Users, 
  CalendarDays, 
  Clock3 
} from "lucide-react";
import api from "../../services/api";

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingType, visitDate, slot } = location.state || {};

  const [peopleCount, setPeopleCount] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBooking = async () => {
    if (!acceptedTerms) {
      alert("Please agree to the guidelines to proceed.");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await api.post("/book-slot", {
        user_id: user.id,
        visit_date: visitDate,
        booking_type: bookingType,
        slot: slot,
        people_count: peopleCount,
        special_request: specialRequest,
      });
      navigate("/devotee/booking-success", { state: response.data });
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!slot) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-amber-50/20 flex items-center justify-center p-4 md:p-6 antialiased">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-xl text-center max-w-md w-full space-y-6">
          {/* Warning Badge Icon */}
          <div className="p-4 bg-amber-50 border border-amber-100/50 rounded-2xl w-fit mx-auto shadow-3xs text-amber-500">
            <AlertCircle className="w-12 h-12" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">No Selection Found</h2>
            <p className="text-base text-slate-500 font-semibold leading-relaxed">
              You haven't selected a dynamic travel slot yet. Please configure a time slice from the smart planner or return to your main station hub.
            </p>
          </div>

          {/* Clean Dual-Action Traversal Stack */}
          <div className="space-y-2.5 pt-2">
            <Link 
              to="/devotee/planner" 
              className="block w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-base shadow-lg shadow-orange-600/10 text-center transition cursor-pointer select-none"
            >
              Go to Planner
            </Link>
            
            <Link 
              to="/devotee/dashboard" 
              className="block w-full py-4 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-2xl font-black text-base text-center transition cursor-pointer select-none"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-amber-50/20 p-4 md:p-8 text-slate-800 antialiased selection:bg-orange-100 pb-20">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation Action Link */}
        <div className="flex items-center justify-start">
          <Link 
            to="/devotee/planner" 
            className="inline-flex items-center gap-2.5 text-base font-black text-slate-500 hover:text-slate-900 transition bg-white/80 hover:bg-white px-5 py-2.5 rounded-2xl border border-slate-200/60 shadow-xs cursor-pointer group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Planner
          </Link>
        </div>

        {/* Floating Glass Header */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs tracking-widest uppercase">
            <Compass size={16} className="animate-spin-slow" />
            Sugam Verification Check
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Confirm Your Darshan</h1>
          <p className="text-base text-slate-500 font-semibold">Almost there! Please review your scheduling allocation details below.</p>
        </div>

        {/* Scaled High-Readability Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Booking Type", value: bookingType, icon: <Compass size={16} className="text-orange-600" /> },
            { label: "Visit Date", value: visitDate, icon: <CalendarDays size={16} className="text-indigo-600" /> },
            { label: "Selected Slot", value: slot, icon: <Clock3 size={16} className="text-emerald-600" /> },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-3xs shrink-0">
                {item.icon}
              </div>
              <div className="truncate">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{item.label}</p>
                <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">{item.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Input Control Form Sheet Layout */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-black text-slate-900 text-base md:text-lg tracking-tight">
              <Users size={18} className="text-slate-500" />
              Number of Accompanying Devotees
            </label>
            <input
              type="number" 
              min="1" 
              max="10" 
              value={peopleCount}
              onChange={(e) => setPeopleCount(Math.max(1, Math.min(10, Number(e.target.value))))}
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none font-bold text-slate-800 transition"
            />
            <p className="text-xs text-slate-400 font-semibold">Maximum threshold allowance limit of 10 total members per single digital pass allocation.</p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-black text-slate-900 text-base md:text-lg tracking-tight">
              <FileText size={18} className="text-slate-500" />
              Special Requests / Elderly Care (Optional)
            </label>
            <textarea
              placeholder="e.g., Requesting medical wheelchair logistics assistance or elderly guidance support infrastructure..."
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none font-medium text-slate-800 transition h-28 resize-none leading-relaxed"
            />
          </div>

          {/* Expanded Checkbox hit target space */}
          <label className="flex items-start gap-3.5 cursor-pointer bg-slate-50/50 p-4 rounded-2xl border border-slate-200/40 select-none group hover:bg-slate-50 transition">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 accent-orange-700 cursor-pointer shrink-0 border-slate-300 rounded" 
              checked={acceptedTerms} 
              onChange={() => setAcceptedTerms(!acceptedTerms)} 
            />
            <span className="text-slate-600 font-bold text-sm md:text-base leading-relaxed group-hover:text-slate-900 transition">
              I explicitly verify compliance with active temple queue guidelines and confirm I will carry a legitimate Government ID card for security checkpoint verification clearance.
            </span>
          </label>
        </div>

        {/* Strategic Operational Warning Notice Card */}
        <div className="flex gap-3.5 bg-orange-50/60 border border-orange-200/60 p-4 rounded-2xl text-orange-900 text-sm md:text-base font-bold leading-relaxed shadow-3xs">
          <Info className="flex-shrink-0 text-orange-600 mt-0.5" size={20} />
          <p>Important: Please report to the gate checker gates exactly 15 minutes before your scheduled timeframe to accommodate queue verification indexing procedures.</p>
        </div>

        {/* FIXED: Standard template literal color assignment wrapper */}
        <button
          onClick={handleBooking}
          disabled={loading || !acceptedTerms}
          className={`w-full py-4 rounded-2xl font-black text-lg tracking-wide transition-all cursor-pointer disabled:cursor-not-allowed select-none ${
            acceptedTerms 
              ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/10" 
              : "bg-slate-200 border border-slate-300/40 text-slate-400 opacity-60"
          }`}
        >
          {loading ? "Processing Secure Allocation..." : "Confirm Secure Booking Slot"}
        </button>
      </div>
    </div>
  );
}