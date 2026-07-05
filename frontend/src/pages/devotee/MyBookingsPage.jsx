import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Trash2, 
  Eye, 
  Clock, 
  Compass, 
  Loader2,
  CalendarDays
} from "lucide-react";
import api from "../../services/api";

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-scroll viewport safely to the top on page initialization
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.id) {
        const response = await api.get(`/my-bookings/${user.id}`);
        setBookings(response.data.bookings || []);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.post(`/cancel-booking/${bookingId}`);
      fetchBookings(); // Refresh list cleanly
    } catch (error) {
      console.error("Error executing cancellation:", error);
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

  // Helper template for standard user-friendly status badge styling
  const getStatusBadge = (status = "") => {
    const norm = status.toUpperCase();
    if (norm === "CONFIRMED" || norm === "SUCCESS") {
      return (
        <span className="inline-flex items-center text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase">
          Confirmed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 uppercase">
        Cancelled
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#fffdf6] p-4 md:p-6 text-slate-900 antialiased selection:bg-orange-100 pb-16">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* PLANNER HEADER */}
        <header className="bg-white rounded-2xl border border-[#f3e3c3] p-6 md:p-8 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-[#ea580c] font-bold text-xs tracking-widest uppercase">
            <Compass size={16} />
            Sugam Darshan
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight m-0">My Bookings</h1>
          <p className="text-sm font-semibold text-slate-600 leading-normal m-0">
            View, manage, and track all your temple bookings in one place.
          </p>
        </header>

        {/* STATS SUMMARY DISPLAY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Bookings", count: bookings.length, color: "text-slate-900", bgStyle: "bg-white border-[#f3e3c3] shadow-xs" },
            { label: "Active Bookings", count: upcomingBookings.length, color: "text-emerald-700", bgStyle: "bg-white border-[#f3e3c3] border-t-4 border-t-emerald-500 shadow-xs" },
            { label: "Cancelled Bookings", count: cancelledBookings.length, color: "text-rose-700", bgStyle: "bg-white border-[#f3e3c3] border-t-4 border-t-rose-500 shadow-xs" }
          ].map((item) => (
            <div key={item.label} className={`p-4 rounded-xl flex items-center justify-between gap-4 border ${item.bgStyle}`}>
              <p className="text-xs uppercase font-black text-slate-500 tracking-wider m-0">{item.label}</p>
              <h2 className={`text-xl md:text-2xl font-black tracking-tight m-0 ${item.color}`}>{item.count}</h2>
            </div>
          ))}
        </div>

        {/* DATA FETCH LOADING HANDLER */}
        {loading ? (
          <div className="flex items-center gap-2 text-slate-700 py-16 font-bold text-sm bg-white rounded-2xl border border-[#f3e3c3] justify-center shadow-xs">
            <Loader2 className="animate-spin text-[#ea580c]" size={18} />
            Loading your bookings...
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* UNIFIED CHRONOLOGICAL CHANNELS STREAM FEED */}
            <AnimatePresence>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#f3e3c3] py-16 text-center text-slate-500 font-semibold text-sm space-y-2 shadow-xs">
                  <CalendarDays size={40} className="mx-auto text-slate-300" />
                  <p className="m-0 text-slate-900 font-bold">You don't have any bookings registered yet.</p>
                  <p className="m-0 text-xs text-slate-500 font-medium">Once you secure a Darshan timeframe window, it will list here.</p>
                </div>
              ) : (
                bookings.map((b) => {
                  const isCancelled = b.status === "CANCELLED";
                  
                  return (
                    <motion.div
                      whileHover={{ y: -1 }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      key={b.booking_id}
                      className={`bg-white border border-[#f3e3c3] rounded-xl shadow-xs overflow-hidden transition-all duration-200 ${
                        isCancelled ? "opacity-70" : ""
                      }`}
                    >
                      {/* CARD CONTENT BODY AREA (HIGHLY READABLE SCAN PATTERN) */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <h2 className="text-lg font-black text-slate-900 tracking-tight m-0 uppercase">
                            {b.booking_type}
                          </h2>
                          {getStatusBadge(b.status)}
                        </div>

                        <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-600">
                          <span className="flex items-center gap-1">📅 {b.visit_date}</span>
                          <span className="text-slate-300 font-normal">•</span>
                          <span className="flex items-center gap-1 text-slate-700">🕒 {b.slot}</span>
                        </div>

                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-0.5">
                          Booking ID: <span className="text-slate-700 font-mono font-extrabold select-all">SD{b.booking_id}</span>
                        </div>
                      </div>

                      {/* ACTIONS ROW PANEL BLOCK CONTAINER */}
                      <div className="border-t border-slate-100 bg-[#fffdf6]/40 px-6 py-3 flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/devotee/booking-details/${b.booking_id}`)}
                          className="px-4 py-2 rounded-lg bg-white border border-[#f3e3c3] hover:bg-[#fffbeb] text-slate-700 font-black text-xs uppercase tracking-wider transition shadow-3xs cursor-pointer select-none active:scale-[0.98] flex items-center gap-1.5"
                        >
                          <Eye size={14} className="text-[#ea580c]" />
                          View Details
                        </button>

                        {!isCancelled && (
                          <button
                            onClick={() => handleCancelBooking(b.booking_id)}
                            className="px-4 py-2 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-black text-xs uppercase tracking-wider transition shadow-3xs cursor-pointer select-none active:scale-[0.98] flex items-center gap-1.5"
                          >
                            <Trash2 size={14} />
                            Cancel
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
            
          </div>
        )}

      </div>
    </div>
  );
}