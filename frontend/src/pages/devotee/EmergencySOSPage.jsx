import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, MapPin, Ambulance, ShieldAlert, Flame, Users, Send, CheckCircle2
} from "lucide-react";

export default function EmergencySOSPage() {
  const [selectedType, setSelectedType] = useState("");
  const [location, setLocation] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const emergencyTypes = [
    { name: "Medical Emergency", icon: Ambulance },
    { name: "Lost Child", icon: Users },
    { name: "Lost Elderly", icon: Users },
    { name: "Security Threat", icon: ShieldAlert },
    { name: "Fire Hazard", icon: Flame },
    { name: "Stampede Risk", icon: AlertTriangle },
  ];

  function getLocation() {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    });
  }

  async function sendSOS() {
    if (!selectedType || !location) return;
    setSending(true);
    // Simulate API Call
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
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
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
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

            {/* Location Module */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">Your Location</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {location ? `Lat: ${location.latitude.toFixed(4)}, Long: ${location.longitude.toFixed(4)}` : "Positioning..."}
                </p>
              </div>
              <button 
                onClick={getLocation}
                className="bg-slate-100 p-4 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <MapPin size={24} />
              </button>
            </div>

            {/* SOS Trigger */}
            <button
              onClick={sendSOS}
              disabled={!selectedType || !location || sending}
              className="w-full py-6 rounded-3xl bg-red-600 text-white font-black text-xl shadow-lg shadow-red-200 disabled:opacity-50 hover:bg-red-700 active:scale-95 transition-all"
            >
              {sending ? "TRANSMITTING..." : "SEND SOS ALERT"}
            </button>
          </div>
        ) : (
          /* Success Screen */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-green-100 shadow-xl"
          >
            <CheckCircle2 size={80} className="text-green-500 mx-auto" />
            <h2 className="text-3xl font-bold text-slate-800 mt-6">Help is on the way</h2>
            <p className="text-slate-500 mt-2">Security and Medical teams have been alerted.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}