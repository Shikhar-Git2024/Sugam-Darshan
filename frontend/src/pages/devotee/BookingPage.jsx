import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, 
  FileText, 
  Info,
  Compass, 
  Users, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scale,
  ClipboardCheck
} from "lucide-react";
import api from "../../services/api";
import BookingValidationModal from "../../components/common/BookingValidationModal";

const MAX_BOOKING_LIMIT = 10;

const CROWD_CONFIG = {
  LOW: { color: "text-green-700 bg-green-50 border border-green-200", dot: "bg-green-500", label: "LOW" },
  MODERATE: { color: "text-yellow-700 bg-yellow-50 border border-yellow-200", dot: "bg-yellow-500", label: "MODERATE" },
  BUSY: { color: "text-orange-700 bg-orange-50 border border-orange-200", dot: "bg-orange-500", label: "BUSY" },
  HEAVY: { color: "text-red-700 bg-red-50 border border-red-200", dot: "bg-red-500", label: "HEAVY" }
};

const STATUS_COLOR_MAPPING = {
  AVAILABLE: "bg-green-100 text-green-700 border-green-200",
  BOOKING_CLOSED: "bg-amber-100 text-amber-700 border-amber-200",
  STARTED: "bg-orange-100 text-orange-700 border-orange-200",
  EXPIRED: "bg-gray-200 text-gray-700 border-gray-300",
  FULL: "bg-red-100 text-red-700 border-red-200"
};

const ASSISTANCE_OPTIONS = [
  "Senior Citizen",
  "Wheelchair",
  "Medical Assistance",
  "Infant"
];

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    bookingType,
    visitDate,
    selectedSlot: initialSlot,

    mode = "create",
    bookingId,
    originalBooking,
  } = location.state || {};
  const editMode = mode === "edit";

  const [selectedSlot, setSelectedSlot] = useState(initialSlot);

  // set state type flexibility to gracefully support typing strings or clear-outs
  const [peopleCount, setPeopleCount] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  useEffect(() => {
    if (!editMode || !originalBooking) return;
    setSpecialRequest(originalBooking.specialRequest || "");
  }, [editMode, originalBooking]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [capacityWarning, setCapacityWarning] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  useEffect(() => {
    if (!editMode || !originalBooking) return;
    setPeopleCount(originalBooking.peopleCount || 1);
  }, [editMode, originalBooking]);
  const [validationModal, setValidationModal] = useState({
    open: false,
    errorCode: "UNKNOWN",
    message: ""
  });

  const maximumPeopleAllowed = useMemo(() => {
    if (!selectedSlot) return 0;
    return Math.min(MAX_BOOKING_LIMIT, selectedSlot.remaining_capacity ?? 0);
  }, [selectedSlot]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (maximumPeopleAllowed > 0 && peopleCount > maximumPeopleAllowed) {
      setPeopleCount(maximumPeopleAllowed);
    }
  }, [maximumPeopleAllowed]);

  const handleChipClick = (option) => {
    setSpecialRequest((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return option;
      if (trimmed.toLowerCase().includes(option.toLowerCase())) return prev;
      return `${trimmed}, ${option}`;
    });
  };

  // Keyboard input evaluation routine with smart constraints mapping
  const handlePeopleCountChange = (e) => {
    const rawValue = e.target.value;

    // 1. Allow the user to fully clear out the input field to type a brand new number
    if (rawValue === "") {
      setPeopleCount("");
      return;
    }

    const numericValue = Number(rawValue);

    // 2. Ensure it is a valid number entry configuration
    if (!isNaN(numericValue)) {
      // 3. If they type something past the boundary (like 15), instantly cap it to maximumPeopleAllowed
      if (numericValue > maximumPeopleAllowed) {
        setPeopleCount(maximumPeopleAllowed);
      } else {
        setPeopleCount(numericValue);
      }
    }
  };

  // Safety fallback guard ensuring field doesn't remain empty on focus lose
  const handlePeopleCountBlur = () => {
    if (peopleCount === "" || Number(peopleCount) < 1) {
      setPeopleCount(1);
    }
  };

  const validateLatestSlot = async () => {
    setCheckingAvailability(true);
    try {
      const response = await api.get("/available-slots", {
        params: { visit_date: visitDate, booking_type: bookingType }
      });
      const slotsList = response.data?.slots || [];
      return slotsList.find(s => s.slot === selectedSlot.slot);
    } catch (err) {
      console.error("HEADROOM REVALIDATION FAULT:", err);
      return null;
    } finally {
      setCheckingAvailability(false);
    }
  };

  const showValidationModal = (errorCode, message) => {
    setValidationModal({
      open: true,
      errorCode: errorCode || "UNKNOWN",
      message: message || "Something went wrong."
    });
  };

  const handleBooking = async () => {
    if (!acceptedTerms || !selectedSlot) return;
    setValidationError("");
    setCapacityWarning("");

    const standardizedCount = Number(peopleCount) || 1;

    if (standardizedCount > maximumPeopleAllowed) {
      setValidationError(`Only ${maximumPeopleAllowed} seats are currently available.`);
      return;
    }

    const latestSlot = await validateLatestSlot();

    if (!latestSlot) {
      showValidationModal("UNKNOWN", "Unable to verify seat availability. Please check your internet connection.");
      return;
    }

    if (latestSlot.status === "BOOKING_CLOSED" || latestSlot.status === "EXPIRED" || latestSlot.status === "FULL" || latestSlot.remaining_capacity <= 0) {
      showValidationModal("SLOT_FULL", "This slot is no longer available. Please select another slot.");
      return;
    }

    if (standardizedCount > latestSlot.remaining_capacity) {
      showValidationModal("SLOT_FULL", `Only ${latestSlot.remaining_capacity} seats are now available.`);
      setSelectedSlot(prev => ({ ...prev, ...latestSlot }));
      return;
    }

    if (selectedSlot.remaining_capacity !== latestSlot.remaining_capacity) {
      setCapacityWarning(`Seat availability updated. Remaining seats changed from ${selectedSlot.remaining_capacity} to ${latestSlot.remaining_capacity}.`);
      setSelectedSlot(prev => ({ ...prev, ...latestSlot }));
      return;
    }

    try {
      setLoading(true);
      
      let response;
      if (editMode) {
        response = await api.put(`/booking/${bookingId}`, {
          visit_date: visitDate,
          slot: selectedSlot.slot,
          people_count: standardizedCount,
        });
      } else {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        response = await api.post("/book-slot", {
          user_id: user.id,
          visit_date: visitDate,
          booking_type: bookingType,
          slot: selectedSlot.slot,
          people_count: standardizedCount,
          special_request: specialRequest,
        });
      }
      
      setShowConfirmationModal(false);
      if (editMode) {
        navigate(`/devotee/booking-details/${bookingId}`, {
          replace: true,
          state: {
              refresh: true,
          },
      });
      } else {
        navigate("/devotee/booking-success", {
          state: {
            booking_id: response.data?.booking_id,
            transaction_id: response.data?.transaction_id,
            status: response.data?.booking_status || response.data?.status || "CONFIRMED",
            visitDate,
            slot: selectedSlot.slot,
            bookingType,
            peopleCount: standardizedCount,
          },
        });
      }
    } catch (error) {
      console.error(error);
      const data = error?.response?.data?.detail || {};
      showValidationModal(
        data.error_code,
        data.message || "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSlot) {
    return (
      <div className="min-h-screen bg-[#fffdf6] flex items-center justify-center p-6 antialiased text-left">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 md:p-8 rounded-2xl border border-[#f3e3c3] max-w-md w-full space-y-6 shadow-sm">
          <div className="p-3.5 rounded-xl w-fit text-[#ea580c] bg-[#fffbeb] border border-[#f3e3c3]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 m-0">No Selection Found</h2>
            <p className="text-sm font-medium text-slate-600 leading-relaxed m-0">Please go back to the planner page and choose your preferred date and time slot.</p>
          </div>
          <div className="pt-2">
            <Link to="/devotee/planner" className="block w-full py-3 rounded-xl font-black text-xs tracking-widest text-center transition-all uppercase no-underline bg-[#ea580c] text-white hover:bg-[#c2410c] shadow-sm">
              Go Back to Planner
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const crowdConfig = CROWD_CONFIG[selectedSlot.crowd_level?.toUpperCase()] || CROWD_CONFIG.LOW;
  const statusClassName = STATUS_COLOR_MAPPING[selectedSlot.status?.toUpperCase()] || "bg-green-100 text-green-700 border-green-200";
  const isSlotExhausted = maximumPeopleAllowed === 0;

  return (
    <div className="min-h-screen bg-[#fffdf6] p-4 md:p-6 antialiased text-left pb-16 text-slate-900 flex flex-col justify-start">
      <div className="max-w-5xl w-full mx-auto space-y-5">
        
        {/* WARM TRADITIONAL HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-2">
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
        </div>

        {/* BOOKING JOURNEY PROGRESS INDICATOR */}
        <div className="w-full max-w-3xl mx-auto rounded-2xl border border-[#fde7c2] bg-gradient-to-br from-[#fffdf8] to-[#fff7ed] p-5 shadow-md shadow-orange-100/40">
          <div className="relative flex items-center justify-between px-6 md:px-12">
            {/* Background Line */}
            <div className="absolute left-12 right-12 top-5 h-[3px] rounded-full bg-[#fde7c2] z-0 overflow-hidden">
              {/* Active Progress: 50% for Step 2 */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "50%" }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c]"
              />
            </div>

            {/* STEP 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-black text-[15px] ring-[5px] ring-[#fff8e8]">
                ✓
              </div>
              <span className="mt-2 text-xs font-bold tracking-wide text-[#c2410c]">
                {editMode ? "Edit Booking" : "Plan Visit"}
              </span>
            </div>

            {/* STEP 2 (ACTIVE) */}
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
                2
              </motion.div>
              <span className="mt-2 text-xs font-bold tracking-wide text-[#c2410c]">
                {editMode ? "Review" : "Booking"}
              </span>
            </div>

            {/* STEP 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#fffaf2] border-2 border-[#f3d5a4] text-[#c48a35] flex items-center justify-center font-bold text-[15px] transition-all duration-300">
                3
              </div>
              <span className="mt-2 text-xs font-medium tracking-wide text-[#b78a3d]">
                {editMode ? "Update" : "Confirmation"}
              </span>
            </div>
          </div>
        </div>

        {/* MASTER CONTAINER GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-stretch">
          
          {/* LEFT COLUMN: SEPARATE BOARDS SIDEBAR */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 items-stretch">
            
            {/* CARD 1: SEPARATE BOOKING SUMMARY BOX */}
            <div className="space-y-2 flex flex-col justify-between">
              <div className="px-1 flex items-center gap-1.5 shrink-0">
                <ClipboardCheck size={14} className="text-[#ea580c]" />
                <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider m-0">Booking Summary</h2>
              </div>
              
              <div className="bg-[#fffdf9] border border-[#f3e3c3] rounded-xl p-4 shadow-xs flex-1 flex flex-col justify-center space-y-2.5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Booking Type</span>
                    <span className="font-black text-slate-900 capitalize bg-white px-2 py-0.5 rounded border border-[#f3e3c3]/40">{bookingType?.toLowerCase()}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visit Date</span>
                    <span className="font-black text-slate-900">{visitDate}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time Slot</span>
                    <span className="font-black text-amber-600">{selectedSlot?.slot}</span>
                  </div>
                </div>

                <div className="w-full border-t border-dashed border-slate-200" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expected Crowd</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[9px] border uppercase ${crowdConfig.color}`}>
                      <span className={`w-1 h-1 rounded-full ${crowdConfig.dot}`} />
                      {crowdConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Remaining Seats</span>
                    <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-[#f3e3c3]/40">
                      {selectedSlot?.remaining_capacity?.toLocaleString()} / {selectedSlot?.total_capacity?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</span>
                    <span className={`px-2 py-0.5 border rounded text-[9px] font-extrabold uppercase tracking-wide ${statusClassName}`}>
                      {selectedSlot?.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: SEPARATE DEDICATED GUIDELINES CARD */}
            <div className="space-y-2 flex flex-col justify-between">
              <div className="px-1 flex items-center gap-1.5 shrink-0">
                <Scale size={14} className="text-[#ea580c]" />
                <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider m-0">Guidelines & Policies</h2>
              </div>
              
              <div className="bg-[#fdfaf2] border border-[#f3e3c3] rounded-xl p-4 shadow-xs flex-1 flex flex-col justify-between space-y-3">
                <ul className="text-slate-700 font-medium text-[11px] space-y-1.5 pl-3.5 list-disc leading-relaxed">
                  <li><strong className="text-slate-900 font-bold">Arrival Time:</strong> Please reach the entry line 15 minutes before your selected time.</li>
                  <li>You can book for a maximum of 10 people at one time.</li>
                  <li>Online booking closes exactly 6 hours before the slot time starts.</li>
                  <li>Please bring a valid photo ID card (like Aadhar) for verification at the gate.</li>
                  <li>Your entry QR code will be generated inside your profile before your visit.</li>
                </ul>
                <div className="pt-2 border-t border-[#eadabe]/40 text-[9px] font-bold text-amber-800 flex items-start gap-1 leading-snug shrink-0">
                  <Info size={12} className="text-[#ea580c] shrink-0 mt-0.5" />
                  <span>Following the rules helps maintain smooth and fast entry lines for everyone.</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DEVOTEE DATA ENTRY COMPONENT PANEL */}
          <div className="md:col-span-3 flex flex-col space-y-2">
            <div className="px-1 shrink-0">
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider m-0">Devotee Details</h2>
            </div>

            <div className="bg-white border border-[#f3e3c3] rounded-xl p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {isSlotExhausted && (
                  <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs font-bold flex items-center gap-2.5">
                    <AlertCircle size={15} className="shrink-0 text-red-600" />
                    <span>This slot is full or closed. Please go back to the planner page and choose another time.</span>
                  </div>
                )}

                {/* Devotees Counter Element */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-bold text-slate-900 text-xs md:text-sm">
                    <Users size={14} className="text-slate-500" /> Total Number of Persons (Devotees)
                  </label>
                  <input
                    type="number" 
                    min="1" 
                    max={maximumPeopleAllowed} 
                    disabled={isSlotExhausted || loading}
                    value={peopleCount}
                    onChange={handlePeopleCountChange} // Remapped optimized keyboard typing event handler
                    onBlur={handlePeopleCountBlur}     // Secure empty blur guard attachment
                    className="w-full p-2.5 rounded-xl font-black text-sm border border-[#f3e3c3] bg-[#fffdf6] text-slate-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all duration-150 disabled:opacity-40"
                  />
                  
                  <div className="flex justify-between items-center px-1 text-[11px] font-bold text-slate-500 gap-1.5 flex-wrap">
                    <span>You can select up to {maximumPeopleAllowed} persons for this booking.</span>
                    <span className="text-slate-600 bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded text-[10px] font-black">
                      Available Seats: {selectedSlot?.remaining_capacity?.toLocaleString()} of {selectedSlot?.total_capacity?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Special Help Support Input Field */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-bold text-slate-900 text-xs md:text-sm">
                    <FileText size={14} className="text-slate-500" /> Do you need any special assistance? (Optional)
                  </label>
                  
                  <div className="flex flex-wrap gap-1">
                    {ASSISTANCE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        disabled={isSlotExhausted || loading}
                        onClick={() => handleChipClick(option)}
                        className="px-2 py-0.5 text-[10px] font-extrabold rounded-lg border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 text-slate-600 hover:text-[#ea580c] cursor-pointer transition-colors duration-150 disabled:opacity-40"
                      >
                        + {option}
                      </button>
                    ))}
                  </div>

                  <textarea
                    placeholder="Click the buttons above or type any special needs here (like wheelchair or elderly help)..."
                    disabled={isSlotExhausted || loading}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs font-medium border border-[#f3e3c3] bg-[#fffdf6] text-slate-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all duration-150 h-20 resize-none leading-relaxed disabled:opacity-40"
                  />
                </div>

                {/* Terms Agreement Checkbox Element */}
                <div className="space-y-1.5">
                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border border-[#f3e3c3] bg-[#fffbeb]/40 select-none group hover:bg-[#fffbeb]/70 transition-all duration-150 ${isSlotExhausted ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"}`}>
                    <input 
                      type="checkbox" 
                      disabled={isSlotExhausted || loading}
                      className="mt-0.5 w-4 h-4 cursor-pointer shrink-0 rounded accent-[#ea580c]"
                      checked={acceptedTerms} 
                      onChange={() => setAcceptedTerms(!acceptedTerms)} 
                    />
                    <span className="font-semibold text-xs leading-normal text-slate-600 group-hover:text-slate-900 transition-colors">
                      I agree to follow the temple rules and will bring a valid ID card for verification at the gate.
                    </span>
                  </label>
                  
                  <AnimatePresence>
                    {acceptedTerms && !isSlotExhausted && (
                      <motion.p initial={{ opacity: 0, y: -1 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[11px] text-emerald-700 font-bold mx-1 my-0 flex items-center gap-1">
                        ✓ Rules accepted
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(validationError || capacityWarning) && (
                      <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className={`p-2.5 border text-xs font-bold rounded-xl flex items-center gap-2 ${validationError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{validationError || capacityWarning}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowConfirmationModal(true)}
                disabled={loading || !acceptedTerms || isSlotExhausted || checkingAvailability}
                className={`w-full py-3 rounded-xl font-black text-xs tracking-widest transition-all uppercase border-0 flex items-center justify-center gap-1.5 mt-2 ${
                  (acceptedTerms && !isSlotExhausted)
                    ? "bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm active:scale-[0.995] cursor-pointer" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                {editMode ? "Review Booking Update"  : "Confirm and Book Slot"}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ==================== RECONFIRMATION DIALOG MODAL ==================== */}
      <AnimatePresence>
        {showConfirmationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="bg-white rounded-2xl border border-[#f3e3c3] shadow-xl max-w-lg w-full overflow-hidden text-slate-900"
            >
              {/* Modal Header */}
              <div className="bg-slate-50 py-3 px-4 border-b border-slate-100 flex items-center gap-2">
                <ShieldCheck className="text-[#ea580c]" size={16} />
                <h3 className="text-sm font-black tracking-tight text-slate-900 m-0">{editMode ? "Confirm Booking Update" : "Confirm Your Booking"}</h3>
              </div>

              {/* Modal Body Spacing */}
              <div className="p-4 space-y-2.5 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block mb-0.5">Booking Type</span>
                    <span className="text-slate-900 font-extrabold text-xs capitalize">{bookingType?.toLowerCase()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block mb-0.5">Visit Date</span>
                    <span className="text-slate-900 font-extrabold text-xs">{visitDate}</span>
                  </div>
                  <div className="col-span-2 border-t border-slate-200/60 pt-1.5">
                    <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block mb-0.5">Selected Time Slot</span>
                    <span className="text-amber-700 font-black text-xs">{selectedSlot?.slot}</span>
                  </div>
                  <div className="border-t border-slate-200/60 pt-1.5">
                    <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block mb-0.5">Total Persons</span>
                    <span className="text-slate-900 font-black text-xs">{peopleCount} Devotee{Number(peopleCount) > 1 ? "s" : ""}</span>
                  </div>
                  <div className="border-t border-slate-200/60 pt-1.5">
                    <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block mb-0.5">Crowd Forecast</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${crowdConfig.color}`}>
                      {crowdConfig.label}
                    </span>
                  </div>
                </div>

                {specialRequest && (
                  <div className="bg-amber-50/50 border border-amber-200/60 p-2.5 rounded-lg">
                    <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block mb-0.5">Special Assistance</span>
                    <p className="text-slate-800 m-0 font-medium italic leading-normal">"{specialRequest}"</p>
                  </div>
                )}

                <div className="flex items-center justify-between px-1 border-t border-b border-slate-100 py-1.5">
                  <span className="text-slate-500 text-[10px]">Current Seat Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 font-black text-xs">🎟 {selectedSlot?.remaining_capacity} Seats Left</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border uppercase tracking-wide ${statusClassName}`}>
                      {selectedSlot?.status}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900 text-[10px] leading-normal">
                  <AlertCircle size={13} className="shrink-0 text-[#ea580c] mt-0.5" />
                  <span>
                    {editMode
                      ? "Please verify your updated booking details before saving the changes."
                      : "Please verify all details above. After confirming, your seats will be locked inside the system."}
                  </span>
                </div>
              </div>

              {/* Action Footer Row */}
              <div className="bg-slate-50 py-2.5 px-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={loading || checkingAvailability}
                  onClick={() => setShowConfirmationModal(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading || checkingAvailability}
                  onClick={handleBooking}
                  className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl border-0 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs uppercase tracking-widest shadow-sm transition-all active:scale-95"
                >
                  {checkingAvailability ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Checking...
                    </>
                  ) : loading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {editMode ? "Updating..." : "Booking..."}
                    </>
                  ) : (
                    editMode ? "Update Booking" : "Confirm Booking"
                  )}
                </button>
              </div>

              <div className="bg-slate-900 text-center py-1.5 px-4 text-[9px] font-medium text-slate-400 border-t border-slate-950">
                By confirming, you agree to the temple booking guidelines and cancellation policy.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BookingValidationModal
        open={validationModal.open}
        errorCode={validationModal.errorCode}
        message={validationModal.message}
        onClose={() =>
          setValidationModal((prev) => ({
            ...prev,
            open: false
          }))
        }
        onPrimary={() => {
          switch (validationModal.errorCode) {
            case "DUPLICATE_BOOKING":
            case "FUTURE_BOOKING_LIMIT":
              navigate("/devotee/my-bookings");
              break;

            case "SLOT_FULL":
            case "BOOKING_CLOSED":
              navigate("/devotee/planner");
              break;

            default:
              setValidationModal((prev) => ({
                ...prev,
                open: false
              }));
          }
        }}
        onSecondary={() => {
          navigate("/devotee/planner");
        }}
      />
    </div>
  );
}