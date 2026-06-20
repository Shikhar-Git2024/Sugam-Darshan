import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AlertCircle, FileText, CheckSquare, Info } from "lucide-react";
import api from "../../services/api";

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingType, visitDate, slot } = location.state || {};

  const [peopleCount, setPeopleCount] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!acceptedTerms) {
      alert("Please agree to the guidelines to proceed.");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await api.post("/book-slot", {
        user_id: user.id,
        visit_date: visitDate,
        booking_type: bookingType,
        slot: slot,
        people_count: peopleCount,
        special_request: specialRequest,
      });
      navigate("/devotee/booking-success", { state: response.data });
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!slot) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-xl text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">No Selection Found</h2>
          <p className="text-slate-500 mt-2 mb-6">Please select a date and slot from the planner first.</p>
          <Link to="/devotee/planner" className="block w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700">Go to Planner</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6 pb-20">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-amber-100 rounded-3xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-orange-800">Confirm Your Darshan</h1>
          <p className="text-slate-500 mt-1">Almost there! Please review your details.</p>
        </div>

        {/* Summary Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Type", value: bookingType },
            { label: "Date", value: visitDate },
            { label: "Slot", value: slot },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm">
              <p className="text-slate-400 text-xs uppercase tracking-wider">{item.label}</p>
              <h3 className="font-semibold text-slate-800 mt-1">{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Form Fields */}
        <div className="bg-white border border-amber-100 rounded-3xl p-8 shadow-sm space-y-6">
          <div>
            <label className="block font-semibold text-slate-800 mb-2">Number of Devotees</label>
            <input
              type="number" min="1" max="10" value={peopleCount}
              onChange={(e) => setPeopleCount(Math.max(1, Math.min(10, Number(e.target.value))))}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-200 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-2">Special Requests (Optional)</label>
            <textarea
              placeholder="e.g., Wheelchair assistance, elderly care needed..."
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-200 outline-none h-24"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1.5 w-5 h-5 accent-orange-600" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />
            <span className="text-slate-600 text-sm">I agree to the temple guidelines and will carry a valid ID for verification during my visit.</span>
          </label>
        </div>

        {/* Important Info */}
        <div className="flex gap-3 bg-orange-50 border border-orange-100 p-4 rounded-2xl text-orange-800 text-sm">
          <Info className="flex-shrink-0" />
          <p>Please arrive 15 minutes before your scheduled slot to ensure a smooth Darshan experience.</p>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading || !acceptedTerms}
          className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-bold text-lg shadow-lg shadow-orange-100 transition-all"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}