import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Users, Receipt, ShieldCheck } from "lucide-react";
import api from "../../services/api";

export default function BookingDetailsPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/booking/${bookingId}`);
      setBooking(response.data.booking);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading details...</div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center text-slate-500">Booking not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-slate-800">Booking Details</h1>
        </div>

        {/* Status Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center">
          <div>
            <p className="text-orange-100 uppercase tracking-wider text-sm font-semibold">Current Status</p>
            <h2 className="text-3xl font-bold mt-1">{booking.status}</h2>
          </div>
          <ShieldCheck size={48} className="text-white/30" />
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-amber-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="text-amber-600" size={20} /> Booking Info
            </h2>
            <div className="space-y-4">
              {[
                { label: "Booking ID", val: booking.booking_id },
                { label: "Type", val: booking.booking_type },
                { label: "Visit Date", val: booking.visit_date },
                { label: "Slot", val: booking.slot },
                { label: "Devotees", val: booking.people_count },
              ].map((item) => (
                <div key={item.label} className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-800">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-amber-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Receipt className="text-amber-600" size={20} /> Transaction
            </h2>
            <div className="space-y-4">
              {[
                { label: "ID", val: booking.transaction?.transaction_id },
                { label: "Amount", val: `₹${booking.transaction?.amount || 0}` },
                { label: "Method", val: booking.transaction?.payment_method },
                { label: "Status", val: booking.transaction?.payment_status },
              ].map((item) => (
                <div key={item.label} className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-800">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Digital Pass Placeholder */}
        <div className="bg-white border border-dashed border-amber-300 rounded-3xl p-8 text-center">
          <Clock className="mx-auto text-amber-500 mb-4" size={32} />
          <h2 className="text-xl font-bold text-slate-800">Digital Darshan Pass</h2>
          <p className="text-slate-500 mt-2 mb-6">Your pass will be generated here closer to your visit date.</p>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4">
          <button onClick={() => navigate("/devotee/my-bookings")} className="flex-1 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition">
            Back to Bookings
          </button>
        </div>
      </div>
    </div>
  );
}