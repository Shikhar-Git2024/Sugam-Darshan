import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Users, Receipt, ShieldCheck, Compass, DollarSign } from "lucide-react";
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
      console.error("Error drawing target reference metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 font-bold text-slate-600 text-lg">
          <Clock className="animate-spin text-orange-600" size={24} />
          Compiling allocation details...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl text-center max-w-md space-y-4">
          <Info className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Booking Not Found</h2>
          <p className="text-base text-slate-500 font-semibold">The requested database reference record could not be found or has expired.</p>
          <Link to="/devotee/my-bookings" className="block w-full py-4 bg-orange-700 text-white rounded-2xl font-extrabold text-base transition hover:bg-orange-800 shadow-md shadow-orange-700/10">
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-amber-50/20 p-4 md:p-8 text-slate-800 antialiased selection:bg-orange-100 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Floating Glass Header */}
        <header className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs tracking-widest uppercase">
            <Compass size={16} className="animate-spin-slow" />
            Sugam Ledger Registry
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Booking Inspection</h1>
          <p className="text-base text-slate-500 font-semibold">Comprehensive verification manifest for your upcoming pilgrimage slot.</p>
        </header>

        {/* Current Status Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950 rounded-3xl p-6 md:p-8 text-white shadow-xl flex justify-between items-center border border-slate-800">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Pass Status Code</p>
            <h2 className="text-3xl md:text-4xl font-black text-orange-400 tracking-tight uppercase">{booking.status || "Confirmed"}</h2>
          </div>
          <ShieldCheck size={56} className="text-orange-500/20 shrink-0" />
        </div>

        {/* Main Info Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column A: Booking Core Parameters */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Calendar className="text-orange-600" size={20} /> 
              Allocation Parameters
            </h2>
            <div className="space-y-4">
              {[
                { label: "Booking Reference ID", val: booking.booking_id },
                { label: "Category Type", val: booking.booking_type },
                { label: "Visit Date Stamp", val: booking.visit_date },
                { label: "Scheduled Slot", val: booking.slot },
                { label: "Registered Devotees", val: `${booking.people_count} Passes` },
              ].map((item) => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                  <span className="text-base font-extrabold text-slate-800 tracking-tight break-all">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Financial Transaction Data */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Receipt className="text-orange-600" size={20} /> 
              Transaction Records
            </h2>
            <div className="space-y-4">
              {[
                { label: "Transaction Token ID", val: booking.transaction?.transaction_id || "N/A (System Direct)" },
                { label: "Amount Remitted", val: `₹${booking.transaction?.amount || 0}`, className: "text-emerald-600" },
                { label: "Payment Channel", val: booking.transaction?.payment_method || "Digital Allocation" },
                { label: "Remittance Status", val: booking.transaction?.payment_status || "Settled", className: "text-indigo-600 font-extrabold" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                  <span className={`text-base font-extrabold tracking-tight break-all ${item.className || "text-slate-800"}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Interactive Digital Pass Area Placeholder */}
        <div className="bg-white border-2 border-dashed border-orange-200 rounded-3xl p-6 md:p-8 text-center space-y-3.5 shadow-3xs max-w-xl mx-auto">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100/50 w-fit mx-auto shadow-3xs">
            <Clock size={28} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Digital Gate Pass Entry</h2>
            <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-sm mx-auto">
              Your secure validation QR code token compiled parameters auto-generate here exactly 24 hours prior to reporting time.
            </p>
          </div>
        </div>

        {/* Global Hub Redirect Actions row */}
        <div className="flex justify-center pt-2">
          <button 
            onClick={() => navigate("/devotee/my-bookings")} 
            className="w-full max-w-md py-4 rounded-2xl bg-orange-700 hover:bg-orange-800 text-white font-extrabold text-base shadow-lg shadow-orange-700/10 transition cursor-pointer text-center"
          >
            Return to My Booking
          </button>
        </div>

      </div>
    </div>
  );
}