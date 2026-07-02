import api from "../../services/api";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, MapPin, Ambulance, ShieldAlert, Flame, Users, CheckCircle2
} from "lucide-react";

export default function EmergencySOSPage() {
  const [selectedType, setSelectedType] = useState("");
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("Fetching...");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const emergencyTypes = [
    { name: "Medical Emergency", icon: Ambulance },
    { name: "Lost Child", icon: Users },
    { name: "Lost Elderly", icon: Users },
    { name: "Security Threat", icon: ShieldAlert },
    { name: "Fire Hazard", icon: Flame },
    { name: "Stampede Risk", icon: AlertTriangle },
  ];

  function getLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
            );
            const data = await response.json();
            setLocationName(
                data.display_name
            );
        }
        catch {
            setLocationName("Unknown Location");
        }
        setLocationError(null);
      },
      (error) => {
        console.error(error);
        setLocationError("Please enable location services to send SOS.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  useEffect(() => {
    getLocation();
  }, []);

  async function sendSOS() {
    if (!selectedType || !location) return;

    try {
      setSending(true);

      const response = await api.post("/incident/create", {
        user_id: user?.id,
        type: "SOS",
        category: selectedType,
        description: description || `${selectedType} reported by devotee.`,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        location_name: locationName,
      });

      console.log(response.data);
      setSent(true);
    } catch (error) {
      console.error(error);
      const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Unable to send SOS.";

    alert(message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-serif font-bold text-red-700">Emergency SOS</h1>
          <p className="text-slate-600 mt-2">Immediate assistance for temple visitors.</p>
        </header>

        {!sent ? (
          <div className="space-y-8">
            {/* Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {emergencyTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => setSelectedType(type.name)}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    selectedType === type.name 
                      ? "bg-red-50 border-red-500 shadow-md" 
                      : "bg-white border-slate-200 hover:border-red-200"
                  }`}
                >
                  <type.icon size={32} className={selectedType === type.name ? "text-red-600" : "text-slate-400"} />
                  <span className="font-bold text-sm text-slate-800 text-center">{type.name}</span>
                </button>
              ))}
            </div>

            {/* Description Textarea */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold mb-3 text-slate-800">Describe the Emergency</h3>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional details (e.g. Near Gate No. 2, near Pillar 45)..."
                className="w-full border rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 border-slate-200"
              />
            </div>
            
            {/* Location Module */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">Your Location</h3>
                <p className={`text-sm mt-1 ${locationError ? "text-red-500 font-medium" : "text-slate-500"}`}>
                  {locationError 
                    ? locationError 
                    : location 
                      ? `Lat: ${location.latitude.toFixed(4)}, Long: ${location.longitude.toFixed(4)}` 
                      : "Fetching live coordinates..."}
                </p>
              </div>
              <button 
                onClick={getLocation}
                title="Refresh Location"
                className="bg-slate-100 p-4 rounded-full text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <MapPin size={24} className={!location && !locationError ? "animate-pulse text-red-500" : ""} />
              </button>
            </div>

            {/* SOS Trigger */}
            <button
              onClick={sendSOS}
              disabled={!selectedType || !location || sending}
              className="w-full py-6 rounded-3xl bg-red-600 text-white font-black text-xl shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none hover:bg-red-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              {sending ? "TRANSMITTING..." : "SEND SOS ALERT"}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-green-100 shadow-xl"
          >
            <CheckCircle2 size={80} className="text-green-500 mx-auto animate-bounce" />
            <h2 className="text-3xl font-bold text-slate-800 mt-6">Help is on the way</h2>
            <p className="text-slate-500 mt-2">Security and Medical teams have been alerted.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}