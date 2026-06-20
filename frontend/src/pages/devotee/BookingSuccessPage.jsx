import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CheckCircle2, Home, CalendarCheck, Info } from "lucide-react";

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  // If no booking data exists, redirect to dashboard
  if (!bookingData) return <Navigate to="/devotee/dashboard" />;

  const { booking_id, transaction_id, status } = bookingData;

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="bg-white border border-amber-100 rounded-3xl p-8 shadow-sm text-center">
          
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-6 border border-green-100">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-2">Booking Confirmed</h1>
          <p className="text-slate-500 mb-8">Your Darshan slot has been successfully reserved.</p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "Booking ID", value: booking_id },
              { label: "Transaction ID", value: transaction_id || "N/A" },
              { label: "Status", value: status, className: "text-green-600 font-bold" },
            ].map((item, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border border-slate-100 ${idx === 2 ? 'col-span-2' : ''}`}>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{item.label}</p>
                <h3 className={`font-semibold mt-1 break-all ${item.className || "text-slate-800"}`}>
                  {item.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Tips for Devotee */}
          <div className="text-left bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-8 flex gap-3">
            <Info className="text-orange-600 flex-shrink-0" size={20} />
            <p className="text-sm text-amber-900">
              Please keep this Booking ID handy. You can view your confirmed booking anytime in the "My Bookings" section.
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate("/devotee/my-bookings")}
              className="w-full py-4 rounded-2xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
            >
              <CalendarCheck size={18} />
              View My Bookings
            </button>
            <button
              onClick={() => navigate("/devotee/dashboard")}
              className="w-full py-4 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}