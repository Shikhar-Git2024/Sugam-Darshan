import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, Eye, Pencil, Loader2, Search, Info, CalendarDays 
} from "lucide-react";
import api from "../../services/api";

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [activeFilter, setActiveFilter] = useState(() => 
    localStorage.getItem("booking_filter") || "ALL"
  );

  // Cancellation Modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookings();
  }, []);

  useEffect(() => {
    localStorage.setItem("booking_filter", activeFilter);
  }, [activeFilter]);

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

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    setIsCancelling(true);
    try {
      await api.post(`/cancel-booking/${selectedBooking.booking_id}`);
      fetchBookings();
      closeCancelModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCancelling(false);
    }
  };

  const formatStatus = (status = "") => {
    const formatted = status.toLowerCase().replace("_", " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const getStatusBadge = (status = "") => {
    const styles = {
      CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
      WAITLISTED: "bg-amber-50 text-amber-700 border-amber-200",
      CANCELLED: "bg-rose-50 text-rose-700 border-rose-200"
    };
    const style = styles[status] || "bg-slate-100 text-slate-700 border-slate-200";
    return <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase ${style}`}>{formatStatus(status)}</span>;
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = activeFilter === "ALL" || b.status === activeFilter;
    const matchesSearch = b.booking_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "NEWEST") return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    if (sortBy === "OLDEST") return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    if (sortBy === "DATE") return new Date(a.visit_date) - new Date(b.visit_date);
    if (sortBy === "STATUS") return a.status.localeCompare(b.status);
    return 0;
  });

  const filterOptions = [
    { label: "All", value: "ALL", count: bookings.length },
    { label: "Confirmed", value: "CONFIRMED", count: bookings.filter(b => b.status === "CONFIRMED").length },
    { label: "Completed", value: "COMPLETED", count: bookings.filter(b => b.status === "COMPLETED").length },
    { label: "Cancelled", value: "CANCELLED", count: bookings.filter(b => b.status === "CANCELLED").length },
    { label: "Waitlisted", value: "WAITLISTED", count: bookings.filter(b => b.status === "WAITLISTED").length },
  ];

  return (
    <div className="min-h-screen bg-[#fffdf6] p-4 md:p-6 text-slate-900 pb-16">
      <div className="max-w-6xl mx-auto space-y-5">
        
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight m-0">My Bookings</h1>
          <p className="text-sm font-medium text-slate-700 m-0 pt-0.5">Manage, track and review all your temple bookings.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search by Booking ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#f3e3c3] rounded-xl text-xs font-bold text-slate-700 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 bg-white border border-[#f3e3c3] rounded-xl text-xs font-black text-slate-700 cursor-pointer outline-none">
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="DATE">Visit Date</option>
            <option value="STATUS">Status</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button key={opt.value} onClick={() => setActiveFilter(opt.value)} className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${activeFilter === opt.value ? "bg-[#ea580c] text-white border-[#ea580c]" : "bg-white border-[#f3e3c3] text-slate-600"}`}>
              {opt.label} ({opt.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-xs font-bold text-slate-500"><Loader2 className="animate-spin mr-2" size={16} /> Loading...</div>
        ) : sortedBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#f3e3c3] py-16 text-center text-slate-500 text-xs font-bold px-4">
            <CalendarDays size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-900 mb-1">No bookings found</p>
            <p className="font-medium text-slate-400">Try another search or filter, or book your first Darshan to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBookings.map((b) => (
              <motion.div 
                key={b.booking_id} 
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#f3e3c3] rounded-xl p-5 shadow-xs"
              >
                <div className="flex justify-between items-start mb-1">
                  <h2 className="text-base font-black uppercase">{b.booking_type}</h2>
                  {getStatusBadge(b.status)}
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-3 select-all">
                  Booking ID: {b.booking_id}
                </div>
                <div className="text-xs font-bold text-slate-600 mb-4">📅 {b.visit_date} • 🕒 {b.slot}</div>
                <div className="flex flex-wrap md:flex-nowrap gap-2">
                  <button onClick={() => navigate(`/devotee/booking-details/${b.booking_id}`)} className="px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-[#ea580c] text-xs font-black uppercase flex items-center gap-1 hover:bg-orange-100 transition">
                    <Eye size={13} className="text-[#ea580c]" /> View Details
                  </button>
                  {b.can_cancel && (
                    <button onClick={() => { setSelectedBooking(b); setShowCancelModal(true); }} className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-black uppercase flex items-center gap-1 hover:bg-rose-100 transition">
                      <Trash2 size={13} /> Cancel Pass
                    </button>
                  )}
                  {b.can_edit && (
                  <button
                    onClick={() =>
                      navigate("/devotee/planner", {
                        state: {
                          mode: "edit",
                          bookingId: b.booking_id,
                          bookingType: b.booking_type,
                          visitDate: b.visit_date,
                          slot: b.slot,
                          peopleCount: b.people_count,
                          bookingStatus: b.status,
                          originalBooking: b,
                        },
                      })
                    }
                    className="px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs font-black uppercase flex items-center gap-1 hover:bg-amber-100 transition"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                )}
              </div>
              </motion.div>
            ))}
            
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 w-full max-w-sm border shadow-xl space-y-4">
              <h2 className="text-lg font-black">Cancel Booking</h2>
              <div className="bg-slate-50 p-4 rounded-xl text-xs font-semibold text-slate-600 space-y-2">
                <p>Booking ID: {selectedBooking.booking_id}</p>
                <p>Visit Date: {selectedBooking.visit_date}</p>
                <p>Slot: {selectedBooking.slot}</p>
                <p>Booking Type: {selectedBooking.booking_type}</p>
              </div>
              <p className="text-[11px] text-slate-500 text-center flex items-center gap-1.5">
                <Info size={14} className="text-amber-600 shrink-0" /> 
                ⚠ Once cancelled, this booking cannot be restored. Your reserved slot may immediately become available to another devotee.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={closeCancelModal} className="px-4 py-2.5 rounded-xl border text-xs font-black uppercase">Keep</button>
                <button onClick={handleCancelBooking} disabled={isCancelling} className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black uppercase flex items-center justify-center gap-2">
                  {isCancelling ? <><Loader2 className="animate-spin" size={14} /> Cancelling...</> : "Confirm Cancel"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}