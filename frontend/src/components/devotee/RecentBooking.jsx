import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, ArrowRight, CheckCircle, XCircle, AlertCircle, Ticket, Layers, FileText } from "lucide-react";

export default function RecentBooking({
  booking = null,
  isLoading = false,
  onPlanVisit
}) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full bg-white border border-amber-100/60 p-6 rounded-2xl shadow-xs animate-pulse min-h-[160px] flex flex-col justify-between">
        <div className="space-y-4">
          <div className="h-5 w-1/4 bg-slate-100 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-12 bg-slate-50 rounded-xl col-span-2" />
            <div className="h-12 bg-slate-50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const normalized = String(status || "").toUpperCase();
    if (normalized === "CONFIRMED") {
      return {
        style: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
        icon: <CheckCircle size={11} />,
        label: "Confirmed"
      };
    }
    if (normalized === "CANCELLED") {
      return {
        style: "bg-rose-50 text-rose-600 border-rose-200/60",
        icon: <XCircle size={11} />,
        label: "Cancelled"
      };
    }
    return {
      style: "bg-amber-50 text-amber-700 border-amber-200/60",
      icon: <AlertCircle size={11} />,
      label: "Pending"
    };
  };

  const formatCreationDate = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    try {
      const date = new Date(dateTimeStr);
      const day = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return "";
    }
  };

  const getUrgencyBadge = () => {
    if (!booking?.visit_date) return null;
    try {
      const today = new Date();
      const visitDate = new Date(booking.visit_date);
      
      // Normalize times for date comparison
      today.setHours(0, 0, 0, 0);
      visitDate.setHours(0, 0, 0, 0);
      
      const diffTime = visitDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-tight px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 uppercase animate-pulse">
            ● Today
          </span>
        );
      }
      if (diffDays === 1) {
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-tight px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 uppercase">
            📅 Tomorrow
          </span>
        );
      }
      if (diffDays > 1 && diffDays <= 3) {
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-tight px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-800 uppercase">
            🟢 Upcoming Visit
          </span>
        );
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const statusConfig = getStatusConfig(booking?.status);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full bg-gradient-to-br from-white via-amber-50/10 to-orange-50/5 border border-amber-100/60 p-6 rounded-2xl shadow-2xs relative hover:shadow-md transition-all duration-300 text-left"
    >
      {booking ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Left Side Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-1.5 bg-gradient-to-tr from-[#ea580c] to-amber-600 text-white rounded-lg shadow-3xs">
                <Ticket size={15} />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm md:text-base tracking-tight m-0">
                  Recent Booking
                </h2>
                {getUrgencyBadge()}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xl md:text-2xl font-black text-orange-800 tracking-tight flex items-center gap-2">
                <Clock size={22} className="text-[#ea580c] shrink-0" />
                <span>{booking.slot || "Timing Window Unavailable"}</span>
              </div>
              <div className="text-xs font-semibold text-slate-500 tracking-tight">
                Please arrive at least <span className="text-slate-900 font-bold">15 minutes early</span> before your selected time slot.
              </div>
            </div>
          </div>

          {/* Right Side Section */}
          <div className="w-full flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-6 min-h-[145px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded shadow-3xs">
                  {booking.booking_id || "NOT_ASSIGNED"}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black tracking-wider border uppercase ${statusConfig.style}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Calendar size={13} className="text-slate-400" />
                  <span>Visit Date: <strong className="text-slate-900 font-bold">{booking.visit_date}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users size={13} className="text-slate-400" />
                  <span>Devotees: <strong className="text-slate-900 font-bold">{booking.people_count ?? 1}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Layers size={13} className="text-slate-400" />
                  <span>Booking Type: <strong className="text-slate-900 font-bold">{booking.booking_type || "Standard Entry"}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/devotee/booking-details/${booking.booking_id}`)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-lg shadow-3xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-0"
            >
              <FileText size={13} />
              <span>View Booking Details</span>
            </button>
          </div>

        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-slate-900 text-sm md:text-base m-0">
              No Recent Bookings
            </h3>
            <p className="text-xs font-medium text-slate-500 max-w-lg leading-normal m-0 pt-0.5">
              You haven't booked a Darshan yet. Plan your visit to reserve a convenient time slot.
            </p>
          </div>
          <button
            onClick={onPlanVisit}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-lg shadow-3xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0 border-0"
          >
            <span>Plan Your Visit</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {booking?.created_at && (
        <div className="w-full mt-4 border-t border-slate-100 pt-3 text-right">
          <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
            Booked on {formatCreationDate(booking.created_at)}
          </span>
        </div>
      )}
    </motion.div>
  );
}