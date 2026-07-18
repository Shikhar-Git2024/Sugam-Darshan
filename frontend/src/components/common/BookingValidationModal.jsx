import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CalendarX,
  Users,
  Clock3,
  XCircle,
  X
} from "lucide-react";

const CONFIG = {
  DUPLICATE_BOOKING: {
    icon: CalendarX,
    title: "Booking Not Allowed",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    primary: "View My Bookings",
    secondary: "Choose Another Date"
  },

  FUTURE_BOOKING_LIMIT: {
    icon: Users,
    title: "Booking Limit Reached",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    primary: "View My Bookings",
    secondary: null
  },

  SLOT_FULL: {
    icon: XCircle,
    title: "Selected Slot Full",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    primary: "Choose Another Slot",
    secondary: null
  },

  BOOKING_CLOSED: {
    icon: Clock3,
    title: "Booking Closed",
    color: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-300",
    primary: "Choose Another Slot",
    secondary: null
  },

  MAX_PEOPLE_EXCEEDED: {
    icon: Users,
    title: "Maximum Devotees Exceeded",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    primary: "Okay",
    secondary: null
  },

  INVALID_PEOPLE_COUNT: {
    icon: AlertTriangle,
    title: "Invalid Number of Devotees",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    primary: "Okay",
    secondary: null
  },

  UNKNOWN: {
    icon: AlertTriangle,
    title: "Booking Failed",
    color: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-300",
    primary: "Close",
    secondary: null
  }
};

export default function BookingValidationModal({
  open,
  errorCode = "UNKNOWN",
  message = "",
  onClose,
  onPrimary,
  onSecondary
}) {
  if (!open) return null;

  const config = CONFIG[errorCode] || CONFIG.UNKNOWN;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-white rounded-3xl border border-[#f3e3c3] shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${config.bg}`}
              >
                <Icon className={`w-6 h-6 ${config.color}`} />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {config.title}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            <div
              className={`rounded-xl border ${config.border} ${config.bg} p-4`}
            >
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {message}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={onPrimary}
                className="w-full py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-sm transition"
              >
                {config.primary}
              </button>

              {config.secondary && (
                <button
                  onClick={onSecondary}
                  className="w-full py-3 rounded-xl border border-[#f3e3c3] bg-white hover:bg-[#fff7ed] font-bold text-slate-700 transition"
                >
                  {config.secondary}
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl text-slate-500 font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}