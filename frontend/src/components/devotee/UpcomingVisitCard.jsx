import { motion } from "framer-motion";
import { CalendarDays, Clock3, Users, ArrowRight, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpcomingVisitCard() {
  const navigate = useNavigate();
  const booking = JSON.parse(localStorage.getItem("latestBooking") || "null");

  return (
    <section className="px-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[2rem] border border-amber-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-amber-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-800">
              <CalendarDays size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your Next Darshan</h2>
          </div>
        </div>

        <div className="p-8">
          {!booking ? (
            <div className="text-center py-4">
              <p className="text-slate-600 mb-6">No upcoming bookings found. Begin your journey today.</p>
              <button
                onClick={() => navigate("/devotee/planner")}
                className="px-6 py-3 rounded-xl bg-orange-700 text-white font-medium hover:bg-orange-800 transition"
              >
                Plan My Visit
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Date", value: booking.visit_date, icon: CalendarDays, color: "text-amber-700", bg: "bg-amber-50" },
                { label: "Time Slot", value: booking.slot_time, icon: Clock3, color: "text-blue-700", bg: "bg-blue-50" },
                { label: "Status", value: booking.status, icon: Users, color: "text-emerald-700", bg: "bg-emerald-50" },
                { label: "Booking ID", value: booking.id || "N/A", icon: Ticket, color: "text-purple-700", bg: "bg-purple-50" },
              ].map((item, idx) => (
                <div key={idx} className={`${item.bg} rounded-2xl p-4`}>
                  <item.icon className={`${item.color} mb-2`} size={20} />
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{item.label}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{item.value}</h3>
                </div>
              ))}
            </div>
          )}

          {booking && (
            <button
              onClick={() => navigate("/devotee/booking")}
              className="mt-8 flex items-center gap-2 text-orange-800 font-semibold hover:underline"
            >
              View Booking Details <ArrowRight size={18} />
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}