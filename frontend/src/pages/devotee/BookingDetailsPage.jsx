import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Users, Receipt, ShieldCheck, Compass, DollarSign, Info, QrCode, Loader2 } from "lucide-react";
import api from "../../services/api";

export default function BookingDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
      fetchBookingDetails();
      if (location.state?.refresh) {
          setShowUpdateBanner(true);

          navigate(location.pathname, {
              replace: true,
              state: {}
          });
      }
  }, [bookingId]);

  useEffect(() => {
      if (!showUpdateBanner) return;

      const timer = setTimeout(() => {
          setShowUpdateBanner(false);
      }, 4000);

      return () => clearTimeout(timer);
  }, [showUpdateBanner]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/booking/${bookingId}`);
      setBooking(response.data.booking);

      if (response.data.booking.qr_available) {
        const baseURL = api.defaults.baseURL || "http://localhost:8000";
        setQrUrl(`${baseURL}/booking/${bookingId}/qr`);
      }
    } catch (error) {
      console.error("Error loading booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      await api.post(`/cancel-booking/${bookingId}`);
      await fetchBookingDetails();
      setShowCancelModal(false);
    } catch (error) {
      console.error("Error cancelling:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf6]">
        <div className="flex items-center gap-3 font-bold text-slate-600 text-lg">
          <Clock className="animate-spin text-[#ea580c]" size={24} />
          Loading booking details...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf6] p-6">
        <div className="bg-white p-8 rounded-3xl border border-[#f3e3c3] shadow-xs text-center max-w-md space-y-4">
          <Info className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Booking Not Found</h2>
          <p className="text-sm text-slate-600 font-medium">The requested booking could not be found.</p>
          <Link to="/devotee/my-bookings" className="block w-full py-3.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl font-black text-xs tracking-widest transition uppercase no-underline">
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    CONFIRMED: { icon: "✓", color: "text-emerald-700" },
    CHECKED_IN: { icon: "📍", color: "text-blue-700" },
    COMPLETED: { icon: "🎉", color: "text-green-700" },
    WAITLISTED: { icon: "⏳", color: "text-amber-700" },
    EXPIRED: { icon: "⌛", color: "text-slate-500" },
    CANCELLED: { icon: "✕", color: "text-rose-700" }
  };
  const currentStatus = statusConfig[booking.status] || statusConfig.CONFIRMED;

  return (
    <div className="min-h-screen bg-[#fffdf6] p-4 md:p-6 text-slate-900 antialiased selection:bg-orange-100 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight m-0">Booking Details</h1>
          <p className="text-sm font-medium text-slate-700 m-0 pt-0.5">View your booking and payment information.</p>
        </div>

        {showUpdateBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-green-200 bg-green-50 p-4"
          >
            <p className="font-bold text-green-800">
              ✅ Booking updated successfully.
            </p>
          </motion.div>
        )}

        {/* COMPACT SUMMARY ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-white border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Booking ID</span>
            <span className="text-sm font-black text-slate-900 truncate">{booking.booking_id}</span>
          </div>
          <div className="p-3.5 bg-white border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Visit Date</span>
            <span className="text-sm font-black text-slate-900">{booking.visit_date}</span>
          </div>
          <div className="p-3.5 bg-white border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Time Slot</span>
            <span className="text-sm font-black text-amber-700 truncate">{booking.slot}</span>
          </div>
          <div className="p-3.5 bg-[#fffbeb] border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Booking Status</span>
            <span className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-wide ${currentStatus.color}`}>
              {currentStatus.icon} {booking.status || "CONFIRMED"}
            </span>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#f3e3c3] rounded-2xl p-6 md:p-8 shadow-xs space-y-1">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 pb-2.5 border-b border-slate-100 mb-2">
              <Calendar className="text-[#ea580c]" size={16} /> 
              Booking Details
            </h2>
            <div className="space-y-0">
              {[
                { label: "Booking ID", val: booking.booking_id },
                { label: "Darshan Type", val: booking.booking_type },
                { label: "Visit Date", val: booking.visit_date },
                { label: "Time Slot", val: booking.slot },
                { label: "Number of Devotees", val: `${booking.people_count} Passes` },
                { label: "Check-in Status", val: booking.checked_in ? "Checked In" : "Not Checked In", className: booking.checked_in ? "text-blue-700 font-extrabold" : "text-slate-500" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center border-b border-slate-50 py-1.5 last:border-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                  <span className={`text-sm font-extrabold tracking-tight break-all ${item.className || "text-slate-900"}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#f3e3c3] rounded-2xl p-6 md:p-8 shadow-xs space-y-1">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 pb-2.5 border-b border-slate-100 mb-2">
              <Receipt className="text-[#ea580c]" size={16} /> 
              Payment Details
            </h2>
            <div className="space-y-0">
              {[
                { label: "Transaction ID", val: booking.transaction?.transaction_id || "System Allocated" },
                { label: "Amount", val: `₹${booking.transaction?.amount || 0}`, className: "text-emerald-700" },
                { label: "Payment Method", val: booking.transaction?.payment_method || "Online Booking" },
                { label: "Payment Status", val: booking.transaction?.payment_status || "Completed", className: "text-emerald-700 font-extrabold" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center border-b border-slate-50 py-1.5 last:border-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                  <span className={`text-sm font-extrabold tracking-tight break-all ${item.className || "text-slate-900"}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DIGITAL ENTRY PASS CARD */}
        <div className="bg-white border border-[#f3e3c3] rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 pb-2.5 border-b border-slate-100 m-0">
            <QrCode className="text-[#ea580c]" size={16} />
            Digital Entry Pass
          </h2>
          {booking.qr_available ? (
            <div className="flex flex-col items-center gap-4 bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
              <img src={qrUrl} alt="Booking QR" className="w-52 h-52 rounded-lg border border-slate-200 bg-white p-2 object-contain" />
              <a href={qrUrl} download={`Booking_${booking.booking_id}_QR.png`} className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs tracking-wider uppercase transition text-center no-underline cursor-pointer border-0">
                Download QR
              </a>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center">
              <p className="font-bold text-slate-700 m-0">QR not available yet</p>
              <p className="text-sm text-slate-500 mt-1 m-0">{booking.qr_message}</p>
            </div>
          )}
        </div>

        {/* VISIT REMINDER */}
        {booking.status === "CONFIRMED" && (
          <div className="bg-[#fffbeb] border border-[#f3e3c3] rounded-2xl p-5 shadow-3xs space-y-3">
            <h2 className="text-base font-bold text-slate-900">Visit Reminder</h2>
            <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] font-bold">•</span>
                Arrive at the temple at least <strong>15 minutes before</strong> your selected time slot.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] font-bold">•</span>
                Carry a valid Government ID for verification at the entrance.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] font-bold">•</span>
                Keep your booking details ready for a smooth entry.
              </li>
            </ul>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3 max-w-md mx-auto pt-2">
          <div className="flex gap-3">
            {booking.can_edit && (
              <button
                onClick={() =>
                  navigate("/devotee/planner", {
                    state: {
                      mode: "edit",
                      bookingId: booking.booking_id,
                      bookingType: booking.booking_type,
                      visitDate: booking.visit_date,
                      slot: booking.slot,
                      peopleCount: booking.people_count,
                      bookingStatus: booking.status,
                      originalBooking: booking
                    }
                  })
                }
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs tracking-widest uppercase transition active:scale-[0.99]"
              >
                Edit Booking
              </button>
            )}
            {booking.can_cancel && (
              <button 
                onClick={() => setShowCancelModal(true)}
                className="flex-1 py-3 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 font-black text-xs tracking-widest hover:bg-rose-100 transition uppercase cursor-pointer active:scale-[0.99]"
              >
                Cancel Booking
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
            <button 
              onClick={() => navigate("/devotee/my-bookings")} 
              className="w-full py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs tracking-widest transition cursor-pointer text-center border-0 uppercase active:scale-[0.99]"
            >
              Back to My Bookings
            </button>
            <button 
              onClick={() => navigate("/devotee/dashboard")} 
              className="w-full py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-extrabold text-xs tracking-widest hover:bg-slate-100 hover:text-slate-900 transition uppercase flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-[0.99]"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

      </div>

      {/* CANCELLATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border shadow-xl space-y-4">
            <h2 className="text-lg font-black">Cancel Booking</h2>
            <p className="text-xs font-semibold text-slate-600">Are you sure you want to cancel booking {booking.booking_id}? This action cannot be undone.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowCancelModal(false)} className="px-4 py-2.5 rounded-xl border text-xs font-black uppercase">Keep</button>
              <button onClick={handleCancelBooking} disabled={isCancelling} className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black uppercase flex items-center justify-center gap-2">
                {isCancelling ? <><Loader2 className="animate-spin" size={14} /> Cancelling...</> : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}