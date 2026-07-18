import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, MapPin, Ambulance, ShieldAlert, Flame, 
  HelpCircle, Heart, CheckCircle2, Phone, X, AlertOctagon
} from "lucide-react";
import api from "../../services/api";

const STATIC_HELPLINES = [
  { label: "Security / Helpdesk", phone: "1800-123-4567" },
  { label: "Police Assistance", phone: "112" },
  { label: "Medical / Ambulance", phone: "108" }
];

export default function EmergencySOSPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("Fetching location name...");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [incidentId, setIncidentId] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const emergencyTypes = [
    { name: "Medical Emergency", icon: Ambulance, text: "Requires immediate medical team assistance." },
    { name: "Stampede Risk", icon: AlertTriangle, text: "Dangerous crowd compression or gate blocks." },
    { name: "Injury / Health Care", icon: Heart, text: "Unconsciousness, sudden illnesses, or falls." },
    { name: "Security Threat", icon: ShieldAlert, text: "Harassment, theft, or suspicious activities." },
    { name: "Fire Hazard", icon: Flame, text: "Visible smoke, open sparks, or fire outbreak." },
    { name: "Other Emergency", icon: HelpCircle, text: "Any critical situation not listed above." },
  ];

  function getLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          const data = await response.json();
          setLocationName(data.display_name || "Temple Premises");
        } catch {
          setLocationName("Temple Compound, Ayodhya");
        }
      },
      (error) => {
        console.error(error);
        setLocationError("Please enable device location services to proceed.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  useEffect(() => {
    getLocation();
  }, []);

  async function triggerAlertSubmission() {
    setShowConfirmModal(false);
    if (!selectedType || !location) return;

    try {
      setSending(true);
      const generatedId = `SOS-${Date.now().toString().slice(-6)}`;
      setIncidentId(generatedId);

      await api.post("/incident/create", {
        user_id: user?.id,
        type: "SOS",
        category: selectedType,
        description: description || `${selectedType} reported near check-in.`,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        location_name: locationName,
        incident_ticket: generatedId
      });

      setSent(true);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to broadcast SOS. Please call the emergency numbers directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdf8] text-slate-900 px-4 py-6 md:p-6 text-left antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Block*/}
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight m-0">Emergency Assistance</h1>
          <p className="text-sm font-medium text-slate-700 m-0 pt-0.5">Request immediate help from temple security and response teams.</p>
        </div>

        {!sent ? (
          <div className="space-y-6">
            
            {/* Prominent High-Contrast Warning Alert */}
            <div className="bg-[#fef3c7] border border-[#f59e0b] rounded-2xl p-4 flex gap-3 shadow-3xs">
              <AlertOctagon size={20} className="text-amber-700 shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-amber-900 leading-relaxed m-0">
                <strong className="text-amber-950 font-black">Important Notice:</strong> Use Emergency SOS only for genuine, active emergencies. False alerts compromise dispatch times for devotees in critical need.
              </p>
            </div>

            {/* Selection Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-1">1. Select Emergency Category</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyTypes.map((type) => {
                  const isSelected = selectedType === type.name;
                  return (
                    <button
                      key={type.name}
                      onClick={() => setSelectedType(type.name)}
                      className={`p-4 rounded-xl border-2 transition-all flex items-start gap-4 text-left cursor-pointer focus:outline-hidden ${
                        isSelected 
                          ? "bg-rose-50/60 border-rose-500 ring-4 ring-rose-500/10 shadow-3xs" 
                          : "bg-white border-[#f3e3c3] hover:border-rose-300 hover:bg-[#fffdf8]/50"
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg border shrink-0 transition ${isSelected ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 border-[#f3e3c3] text-slate-500'}`}>
                        <type.icon size={20} />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="text-base font-bold text-slate-950 block truncate">{type.name}</span>
                        <p className="text-sm font-medium text-slate-700 leading-snug m-0">{type.text}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-1">2. Additional Details (Optional)</span>
              <div className="bg-white rounded-2xl p-4 border border-[#f3e3c3] shadow-3xs">
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide landmarks if possible (e.g., Near Corridor Gate 2, beside Pillar 45)..."
                  className="w-full border-0 rounded-none p-0 resize-none text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>
            </div>
            
            {/* Location Module */}
            <div className="bg-white p-4 rounded-2xl border border-[#f3e3c3] shadow-3xs flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Your Broadcast Location</span>
                <span className="font-extrabold text-sm text-slate-950 block truncate max-w-[20rem] sm:max-w-md pt-0.5">{locationName}</span>
                {location && (
                  <p className="text-xs text-slate-700 font-mono m-0 pt-0.5">
                    Coordinates: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)} • <span className="text-emerald-700 font-bold">Verified GPS</span>
                  </p>
                )}
                {locationError && <p className="text-sm font-bold text-rose-700 m-0 pt-0.5">{locationError}</p>}
              </div>
              <button 
                onClick={getLocation}
                type="button"
                className="bg-slate-50 p-3 rounded-xl text-slate-700 border border-[#f3e3c3] hover:bg-orange-50 hover:text-[#ea580c] transition shrink-0 cursor-pointer"
              >
                <MapPin size={18} className={!location && !locationError ? "animate-bounce text-rose-500" : ""} />
              </button>
            </div>

            {/* SOS Dispatch Trigger Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!selectedType || !location || sending}
              className="w-full py-4.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm tracking-widest shadow-md shadow-rose-200 uppercase border-0 disabled:opacity-40 disabled:shadow-none transition-all cursor-pointer active:scale-[0.995]"
            >
              {sending ? "Transmitting Signal..." : "Request Immediate Help"}
            </button>

            {/* Quick Dial Fallbacks */}
            <div className="bg-white p-4 rounded-2xl border border-[#f3e3c3] shadow-3xs space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">Alternative Voice Helplines</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {STATIC_HELPLINES.map((line) => (
                  <a 
                    key={line.phone}
                    href={`tel:${line.phone}`}
                    className="flex items-center justify-between px-3 py-2 bg-[#fffdf8] border border-[#f3e3c3] rounded-xl hover:bg-orange-50/40 text-slate-950 font-semibold text-sm transition decoration-none"
                  >
                    <div className="truncate pr-1 text-left">
                      <span className="text-[9px] text-slate-500 block tracking-tight uppercase font-bold">{line.label}</span>
                      <span className="font-extrabold text-slate-900 text-sm">{line.phone}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-amber-100 rounded-lg text-[#ea580c]">
                      <Phone size={12} />
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* ==================== SUCCESS TARGET DISPATCH WINDOW ==================== */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-6 bg-white rounded-2xl border border-emerald-200 shadow-md space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-3xs">
              <CheckCircle2 size={36} className="animate-pulse" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-black text-slate-950 m-0">Emergency Alert Sent</h2>
              <p className="text-sm font-semibold text-slate-700 max-w-sm mx-auto leading-relaxed m-0 pt-1">
                Your coordinates have been transmitted. Temple quick-response security anchors have been dispatched. Please stay exactly where you are if it is completely safe to do so.
              </p>
            </div>

            <div className="inline-block bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-mono text-xs text-slate-800 font-bold">
              Ticket ID: <span className="text-slate-950 font-black">{incidentId}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 max-w-xs mx-auto">
              <button 
                onClick={() => navigate("/devotee/dashboard")}
                className="w-full px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition border-0 cursor-pointer shadow-3xs"
              >
                Return to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal Backdrop */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="bg-white border border-amber-100/60 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="p-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0">
                  <AlertOctagon size={20} />
                </div>
                <div className="flex-1 space-y-0.5 text-left">
                  <h3 className="text-base font-black text-slate-950 m-0">Confirm Emergency Alert</h3>
                  <p className="text-sm font-semibold text-slate-700 leading-normal m-0 pt-0.5">
                    This will broadcast your high-accuracy GPS coordinates to the center response array for <strong className="text-slate-950">{selectedType}</strong>.
                  </p>
                </div>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex gap-2 pt-1 w-full">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={triggerAlertSubmission}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-xl transition border-0 cursor-pointer shadow-xs"
                >
                  Confirm Alert
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}