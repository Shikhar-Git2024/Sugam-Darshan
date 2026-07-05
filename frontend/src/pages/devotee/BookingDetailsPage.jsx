import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Users, Receipt, ShieldCheck, Compass, DollarSign, Info } from "lucide-react";
import api from "../../services/api";

export default function BookingDetailsPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-scroll viewport safely to the top on page initialization
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/booking/${bookingId}`);
      setBooking(response.data.booking);
    } catch (error) {
      console.error("Error loading booking details:", error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-[#fffdf6] p-4 md:p-6 text-slate-900 antialiased selection:bg-orange-100 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <header className="bg-white rounded-2xl border border-[#f3e3c3] p-6 md:p-8 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-[#ea580c] font-bold text-xs tracking-widest uppercase">
            <Compass size={16} />
            Sugam Darshan
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight m-0">Booking Details</h1>
          <p className="text-sm font-semibold text-slate-600 m-0">View your booking and payment information.</p>
        </header>

        {/* ==================== 3. COMPACT SUMMARY ROW ==================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-white border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Booking ID</span>
            <span className="text-sm font-black text-slate-900 truncate">SD{booking.booking_id}</span>
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Booking Status
            </span>

            <span
              className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-wide ${
                booking.status === "CANCELLED"
                  ? "text-rose-700"
                  : booking.status === "WAITLISTED"
                  ? "text-amber-700"
                  : "text-emerald-700"
              }`}
            >
              {booking.status === "CANCELLED"
                ? "✕"
                : booking.status === "WAITLISTED"
                ? "⏳"
                : "✓"}{" "}
              {booking.status || "CONFIRMED"}
            </span>
          </div>
        </div>

        {/* DETAILS COLUMN CORES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* BOOKING DETAILS PASS */}
          <div className="bg-white border border-[#f3e3c3] rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 pb-2.5 border-b border-slate-100 m-0">
              <Calendar className="text-[#ea580c]" size={16} /> 
              Booking Details
            </h2>
            <div className="space-y-4">
              {[
                { label: "Booking ID", val: `SD${booking.booking_id}` },
                { label: "Darshan Type", val: booking.booking_type },
                { label: "Visit Date", val: booking.visit_date },
                { label: "Time Slot", val: booking.slot },
                { label: "Number of Devotees", val: `${booking.people_count} Passes` },
              ].map((item) => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                  <span className="text-sm font-extrabold text-slate-900 tracking-tight break-all">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT DETAILS PASS */}
          <div className="bg-white border border-[#f3e3c3] rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 pb-2.5 border-b border-slate-100 m-0">
              <Receipt className="text-[#ea580c]" size={16} /> 
              Payment Details
            </h2>
            <div className="space-y-4">
              {[
                { label: "Transaction ID", val: booking.transaction?.transaction_id || "System Allocated" },
                { label: "Amount", val: `₹${booking.transaction?.amount || 0}`, className: "text-emerald-700" },
                { label: "Payment Method", val: booking.transaction?.payment_method || "Online Booking" },
                { label: "Payment Status", val: booking.transaction?.payment_status || "Completed", className: "text-emerald-700 font-extrabold" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                  <span className={`text-sm font-extrabold tracking-tight break-all ${item.className || "text-slate-900"}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* DIGITAL PASS VIEW ENTRY CONTAINER */}
        {/* Visit Reminder (Only for Confirmed Bookings) */}
        {booking.status === "CONFIRMED" && (
          <div className="bg-[#fffbeb] border border-[#f3e3c3] rounded-2xl p-5 shadow-3xs space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              Visit Reminder
            </h2>

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
        

        {/* BUTTON ACTION ROUTING GROUP FOOTER */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
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
  );
}