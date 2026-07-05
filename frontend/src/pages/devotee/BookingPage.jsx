import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, 
  FileText, 
  Info, 
  Compass, 
  Users, 
  CalendarDays, 
  Clock3,
  CheckCircle2,
  ArrowRight
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
    if (!acceptedTerms) return;

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Execute booking request and store the database response mapping
      const response = await api.post("/book-slot", {
        user_id: user.id,
        visit_date: visitDate,
        booking_type: bookingType,
        slot: slot,
        people_count: peopleCount,
        special_request: specialRequest,
      });
      
      // FIX 1: Passing explicit database parameters down to the success page routing state
      navigate("/devotee/booking-success", {
        state: {
          booking_id: response.data?.booking_id,
          transaction_id: response.data?.transaction_id,
          status: response.data?.booking_status || response.data?.status || "CONFIRMED",
          
          visitDate,
          slot,
          bookingType,
          peopleCount
        }
      });
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Welcoming empty state fallback if no slot selection is active
  if (!slot) {
    return (
      <div className="min-h-screen bg-[#fffdf6] flex items-center justify-center p-6 antialiased text-left">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 md:p-8 rounded-2xl border border-[#f3e3c3] max-w-md w-full space-y-6 shadow-sm"
        >
          <div className="p-3.5 rounded-xl w-fit text-[#ea580c] bg-[#fffbeb] border border-[#f3e3c3]">
            <AlertCircle className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 m-0">
              No Selection Found
            </h2>
            <p className="text-sm font-medium text-slate-600 leading-relaxed m-0">
              Please go back to the planner page and choose your preferred date and time slot for your visit.
            </p>
          </div>

          <div className="pt-2">
            <Link 
              to="/devotee/planner" 
              className="block w-full py-3 rounded-xl font-black text-xs tracking-widest text-center transition-all uppercase no-underline bg-[#ea580c] text-white hover:bg-[#c2410c] shadow-sm active:scale-[0.995]"
            >
              Go Back to Planner
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf6] p-4 md:p-6 antialiased text-left pb-24 text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* WARM TRADITIONAL HEADER */}
        <div className="bg-white rounded-xl p-6 border border-[#f3e3c3] shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs tracking-wider uppercase text-[#ea580c]">
            <Compass size={14} />
            Sugam Darshan
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight m-0 text-slate-900">
            Confirm Your Visit
          </h1>
          <p className="text-xs font-semibold text-slate-600 m-0">
            Please review your details below before completing your booking.
          </p>
        </div>

        {/* BOOKING JOURNEY PROGRESS INDICATOR */}
        <div className="w-full bg-white rounded-xl border border-[#f3e3c3] p-4 shadow-xs max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative px-6 md:px-12">
            <div className="absolute left-12 right-12 top-4 h-[2px] bg-[#f3e3c3] z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-[#ea580c] text-white flex items-center justify-center shadow-sm ring-4 ring-[#fffbeb]">
                <CheckCircle2 size={16} className="stroke-[3]" />
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-600">
                Plan Visit
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-black text-sm shadow-sm ring-4 ring-[#fffbeb]">
                2
              </div>
              <span className="mt-2 text-xs font-bold text-slate-900">
                Booking
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-[#d6d3d1] text-slate-500 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="mt-2 text-xs font-medium text-slate-500">
                Confirmation
              </span>
            </div>

          </div>
        </div>

        {/* COMPACT BOOKING SUMMARY HUD */}
        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm border border-slate-950">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-400 m-0">Live Selection Summary</h4>
              <p className="text-xs text-slate-300 m-0 font-medium">Review your layout parameters before saving</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs bg-slate-800 p-2.5 rounded-lg border border-slate-700/60 text-center sm:text-left">
              <div className="px-1">
                <span className="text-slate-400 text-[9px] uppercase block font-bold tracking-wider">Type</span>
                <span className="font-extrabold text-white text-xs mt-0.5 block">{bookingType}</span>
              </div>
              <div className="border-l border-slate-700/60 pl-3">
                <span className="text-slate-400 text-[9px] uppercase block font-bold tracking-wider">Date</span>
                <span className="font-extrabold text-white text-xs mt-0.5 block">{visitDate}</span>
              </div>
              <div className="border-l border-slate-700/60 pl-3">
                <span className="text-slate-400 text-[9px] uppercase block font-bold tracking-wider">Time</span>
                <span className="font-extrabold text-amber-400 text-xs mt-0.5 block truncate max-w-[100px]">{slot}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN SPLIT GRID BLOCK */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
          
          {/* LEFT SIDE COLUMN: SELECTIONS DISPLAY */}
          <div className="md:col-span-2 space-y-4">
            <div className="px-1">
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider m-0">
                Your Selections
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3">
              {[
                { label: "Darshan Type", value: bookingType, icon: <Compass size={15} className="text-[#ea580c]" /> },
                { label: "Date of Visit", value: visitDate, icon: <CalendarDays size={15} className="text-[#ea580c]" /> },
                { label: "Time Slot", value: slot, icon: <Clock3 size={15} className="text-[#ea580c]" /> },
              ].map((item) => (
                <motion.div 
                  whileHover={{ y: -1, scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                  key={item.label} 
                  className="bg-white border border-[#f3e3c3] rounded-xl p-4 flex items-center gap-3 shadow-xs"
                >
                  <div className="p-2.5 bg-[#fffbeb] border border-[#f3e3c3]/40 rounded-xl shrink-0 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-[10px] uppercase tracking-wider text-slate-500 m-0">{item.label}</p>
                    <h3 className="text-sm font-extrabold mt-0.5 m-0 text-slate-900 truncate">
                      {item.value}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Advisory Container Banner */}
            <div className="flex gap-3 bg-[#fffbeb] border border-[#f3e3c3] p-4 rounded-xl text-amber-900 text-xs font-semibold leading-relaxed shadow-xs">
              <Info className="flex-shrink-0 text-[#ea580c] mt-0.5" size={15} />
              <p className="m-0 text-slate-700 font-medium">
                <strong className="text-amber-950 font-bold">Important Notice:</strong> Please reach the temple entry gate 15 minutes before your selected time slot for a smooth entry experience.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE COLUMN: FORM COMPONENT DATA */}
          <div className="md:col-span-3 space-y-4">
            <div className="px-1">
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider m-0">
                Devotee Details
              </h2>
            </div>

            <div className="bg-white border border-[#f3e3c3] rounded-xl p-6 space-y-6 shadow-xs">
              
              {/* Devotees Counter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-bold text-slate-900 text-xs md:text-sm">
                  <Users size={15} className="text-slate-500" />
                  Total Number of Persons (Devotees)
                </label>
                <input
                  type="number" 
                  min="1" 
                  max="10" 
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Math.max(1, Math.min(10, Number(e.target.value))))}
                  className="w-full p-3 rounded-xl font-bold text-sm border border-[#f3e3c3] bg-[#fffdf6] text-slate-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all duration-200"
                />
                <p className="text-[11px] font-medium text-slate-500 m-0">
                  You can book for up to 10 family members or friends at one time.
                </p>
              </div>

              {/* Special Support Support Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-bold text-slate-900 text-xs md:text-sm">
                  <FileText size={15} className="text-slate-500" />
                  Do you need any special help? (Wheelchair, Elderly support) — Optional
                </label>
                <textarea
                  placeholder="Example: Need wheelchair assistance for an elderly citizen..."
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs font-medium border border-[#f3e3c3] bg-[#fffdf6] text-slate-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all duration-200 h-24 resize-none leading-relaxed"
                />
              </div>

              {/* Terms Agreement Checkbox Element */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-[#f3e3c3] bg-[#fffbeb]/40 select-none group hover:bg-[#fffbeb]/70 transition-all duration-200">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 w-4.5 h-4.5 cursor-pointer shrink-0 rounded accent-[#ea580c]"
                    checked={acceptedTerms} 
                    onChange={() => setAcceptedTerms(!acceptedTerms)} 
                  />
                  <span className="font-semibold text-xs leading-relaxed text-slate-600 group-hover:text-slate-900 transition-colors duration-200">
                    I agree to follow the temple lane rules and will bring a valid identification card for verification at the gate.
                  </span>
                </label>
                
                {/* Visual Verification Status Indication Badge */}
                <AnimatePresence>
                  {acceptedTerms && (
                    <motion.p 
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -2 }}
                      className="text-[11px] text-emerald-700 font-bold mx-1 my-0 flex items-center gap-1"
                    >
                      ✓ Temple guidelines accepted
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submission Execution Control Triggers */}
              <button
                onClick={handleBooking}
                disabled={loading || !acceptedTerms}
                className={`w-full py-3.5 rounded-xl font-black text-xs tracking-widest transition-all uppercase border-0 flex items-center justify-center gap-1.5 ${
                  acceptedTerms 
                    ? "bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm active:scale-[0.995] cursor-pointer" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                {loading ? "Booking your slot..." : "Confirm and Book Slot"}
                {!loading && <ArrowRight size={14} />}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}