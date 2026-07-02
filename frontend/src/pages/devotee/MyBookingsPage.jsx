import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Safely imported motion to fix the crash
import { 
  Calendar, 
  Trash2, 
  Eye, 
  XCircle, 
  CheckCircle, 
  Clock, 
  ArrowLeft, 
  Compass, 
  Loader2 
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
      console.error("Error grabbing your itinerary stream:", error);
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

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-amber-50/20 p-4 md:p-8 text-slate-800 antialiased selection:bg-orange-100 pb-16">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Native Internal Router Back Action Controller */}
        <div className="flex items-center justify-start">
          <Link 
            to="/devotee/dashboard" 
            className="inline-flex items-center gap-2.5 text-base font-black text-slate-500 hover:text-slate-900 transition bg-white/80 hover:bg-white px-5 py-2.5 rounded-2xl border border-slate-200/60 shadow-xs cursor-pointer group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Premium Floating Header Box */}
        <header className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs tracking-widest uppercase">
            <Compass size={16} className="animate-spin-slow" />
            Sugam Travel Manifest
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-base font-semibold text-slate-500 leading-normal">
            Review your dynamic allocation passes, track live status logs, and manage your active journey itineraries.
          </p>
        </header>

        {/* High-Readability Stats Dashboard Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[
            { label: "Total Bookings", count: bookings.length, color: "text-slate-800", bgStyle: "bg-white border-slate-200/60 shadow-xs" },
            { label: "Active Permits", count: upcomingBookings.length, color: "text-emerald-600 font-black", bgStyle: "bg-emerald-50/30 border-emerald-200/30 shadow-xs" },
            { label: "Cancelled Folders", count: cancelledBookings.length, color: "text-red-600 font-bold", bgStyle: "bg-red-50/40 border-red-200/40 shadow-xs" }
          ].map((item) => (
            <div key={item.label} className={`p-5 rounded-2xl flex items-center justify-between gap-4 border ${item.bgStyle}`}>
              <p className="text-sm uppercase font-extrabold text-slate-400 tracking-wider">{item.label}</p>
              <h2 className={`text-3xl font-black tracking-tight ${item.color}`}>{item.count}</h2>
            </div>
          ))}
        </div>

        {/* Content Streams Block Dynamic Segment Wrapper */}
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500 py-16 font-bold text-base bg-white rounded-3xl border border-slate-200/60 justify-center shadow-xs">
            <Loader2 className="animate-spin text-orange-600" size={20} />
            Loading active permit structures...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
            
            {/* ================= COLUMN A (LEFT): ACTIVE BOOKINGS ================= */}
            <div className="space-y-4 bg-white rounded-3xl border border-slate-200/60 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Active Stream ({upcomingBookings.length})</h2>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirmed Slots</span>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                <AnimatePresence>
                  {upcomingBookings.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-medium text-base">
                      <Calendar size={40} className="mx-auto mb-3 text-slate-300" />
                      No active bookings found.
                    </div>
                  ) : (
                    upcomingBookings.map((b) => (
                      <motion.div 
                        whileHover={{ scale: 1.01 }}
                        key={b.booking_id} 
                        className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/50 border-l-4 border-l-orange-500 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 min-w-0">
                          <p className="text-sm text-slate-400 font-bold font-mono">#{b.booking_id}</p>
                          <h3 className="font-black text-slate-900 text-lg tracking-tight leading-none">{b.booking_type}</h3>
                          <div className="flex gap-4 mt-2.5 text-sm font-bold text-slate-500">
                            <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200/40 shadow-3xs"><Calendar size={14} className="text-indigo-500"/> {b.visit_date}</span>
                            <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200/40 shadow-3xs"><Clock size={14} className="text-emerald-500"/> {b.slot}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 shrink-0 self-end sm:self-center">
                          <button 
                            onClick={() => navigate(`/devotee/booking-details/${b.booking_id}`)} 
                            className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 transition shadow-3xs text-slate-700 cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleCancelBooking(b.booking_id)} 
                            className="p-3 rounded-xl bg-red-50 border border-red-100/40 text-red-600 hover:bg-red-100 transition shadow-3xs cursor-pointer"
                            title="Cancel Booking"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ================= COLUMN B (RIGHT): CANCELLED LOGS ================= */}
            <div className="space-y-4 bg-white rounded-3xl border border-slate-200/60 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <XCircle className="text-slate-400" size={20} />
                  <h2 className="text-xl font-black text-slate-500 tracking-tight">Cancelled Logs ({cancelledBookings.length})</h2>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">History</span>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                <AnimatePresence>
                  {cancelledBookings.length === 0 ? (
                    <div className="py-16 text-center font-bold text-sm text-slate-400/80">
                      No items found in system history records.
                    </div>
                  ) : (
                    cancelledBookings.map((b) => (
                      <div 
                        key={b.booking_id} 
                        className="bg-slate-50/20 p-4 rounded-2xl border border-slate-200/40 border-l-4 border-l-slate-400 shadow-3xs flex items-center justify-between gap-4 opacity-75"
                      >
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-slate-600 text-base line-through decoration-slate-300 truncate">{b.booking_type}</h3>
                          <p className="text-xs text-slate-400 font-semibold mt-1">Cancelled target window date reference: {b.visit_date}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-black border border-slate-200/30 text-slate-500 uppercase tracking-wider shrink-0 shadow-3xs">
                          Cancelled
                        </span>
                      </div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}