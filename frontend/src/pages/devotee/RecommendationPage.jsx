import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, CalendarDays, Users, Info } from "lucide-react";
import api from "../../services/api";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const [forecast, setForecast] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookingType, setBookingType] = useState("DARSHAN");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate, bookingType]);

  const fetchForecast = async () => {
    try {
      const res = await api.get("/public/forecast");
      setForecast(res.data);
      if (res.data.length > 0) {
        const bestDay = [...res.data].sort((a, b) => a.crowd - b.crowd)[0];
        setSelectedDate(bestDay.date);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/available-slots?visit_date=${selectedDate}&booking_type=${bookingType}`);
      setSlots(res.data.slots);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const bestDay = forecast.length > 0 ? [...forecast].sort((a, b) => a.crowd - b.crowd)[0] : null;

  const handleContinue = () => {
    if (!selectedSlot) return;
    navigate("/devotee/booking", {
      state: { bookingType, visitDate: selectedDate, slot: selectedSlot.slot },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white border border-amber-100 rounded-3xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-orange-800">Plan Your Darshan</h1>
          <p className="mt-2 text-slate-500">
            AI-powered insights to help you choose the most serene time for your visit.
          </p>
        </div>

        {/* Booking Type Toggle */}
        <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-100 w-fit">
          {["DARSHAN", "AARTI"].map((type) => (
            <button
              key={type}
              onClick={() => { setBookingType(type); setSelectedSlot(null); }}
              className={`px-8 py-2.5 rounded-xl font-semibold transition-all ${
                bookingType === type 
                  ? "bg-amber-100 text-orange-800" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* AI Recommendation Card */}
        {bestDay && (
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-8 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-amber-200" />
              <h2 className="text-xl font-bold">Suggested Time for Peace</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Best Day", value: bestDay.day },
                { label: "Expected Crowd", value: bestDay.crowd },
                { label: "Wait Time", value: `${bestDay.expected_wait} min` },
                { label: "Crowd Level", value: bestDay.crowd_level }
              ].map((item, idx) => (
                <div key={idx}>
                  <p className="text-orange-100 text-sm">{item.label}</p>
                  <p className="text-xl font-semibold mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Slots */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Available Slots</h2>
          {loading ? (
            <div className="text-slate-400 py-10">Loading availability...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all ${
                    selectedSlot?.slot === slot.slot
                      ? "border-amber-400 bg-amber-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-amber-200"
                  }`}
                >
                  <h3 className="font-bold text-slate-800 text-lg">{slot.slot}</h3>
                  <div className="mt-3 text-sm text-slate-600 space-y-1">
                    <p>Status: <span className="font-medium text-orange-700">{slot.crowd_level}</span></p>
                    <p>Remaining: {slot.remaining_capacity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {selectedSlot && (
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-orange-700 hover:bg-orange-800 text-white font-semibold transition-colors shadow-md"
          >
            Confirm and Continue
          </button>
        )}
      </div>
    </div>
  );
}