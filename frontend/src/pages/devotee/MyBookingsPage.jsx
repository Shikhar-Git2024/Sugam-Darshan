import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Trash2, Eye, XCircle, CheckCircle, Clock } from "lucide-react";
import api from "../../services/api";

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.get(`/my-bookings/${user.id}`);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.post(`/cancel-booking/${bookingId}`);
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error(error);
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">My Bookings</h1>
          <p className="text-slate-500 mt-2">Manage your Darshan and Aarti schedules.</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total", val: bookings.length, color: "text-slate-800" },
            { label: "Active", val: upcomingBookings.length, color: "text-green-600" },
            { label: "Cancelled", val: cancelledBookings.length, color: "text-red-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
              <p className="text-slate-500 text-sm uppercase tracking-wider">{stat.label}</p>
              <h2 className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.val}</h2>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading your journey...</div>
        ) : (
          <div className="space-y-10">
            {/* Active Section */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                <CheckCircle className="text-green-500" size={20} /> Active Bookings
              </h2>
              <div className="grid gap-4">
                {upcomingBookings.length > 0 ? upcomingBookings.map((b) => (
                  <div key={b.booking_id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 font-medium">#{b.booking_id}</p>
                      <h3 className="font-bold text-lg">{b.booking_type}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {b.visit_date}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {b.slot}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/devotee/booking-details/${b.booking_id}`)} className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200"><Eye size={18} /></button>
                      <button onClick={() => handleCancelBooking(b.booking_id)} className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )) : <div className="p-8 text-center bg-white rounded-3xl border border-dashed text-slate-400">No active bookings found.</div>}
              </div>
            </section>

            {/* Cancelled Section */}
            <section className="opacity-75">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                <XCircle className="text-slate-400" size={20} /> Cancelled
              </h2>
              <div className="grid gap-4">
                {cancelledBookings.map((b) => (
                  <div key={b.booking_id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-500 line-through">{b.booking_type}</h3>
                      <p className="text-xs text-slate-400">Cancelled on {b.visit_date}</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">CANCELLED</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}