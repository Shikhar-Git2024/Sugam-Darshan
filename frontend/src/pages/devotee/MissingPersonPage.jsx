import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search, Upload, User, Phone, MapPin, Clock3, AlertCircle, 
  CheckCircle2, ArrowLeft, Shirt, Eye, Loader2, X, AlertOctagon, HelpCircle
} from "lucide-react";
import api from "../../services/api";

const STATIC_HELPLINES = [
  { label: "Temple Help Desk", phone: "1800-123-4567" },
  { label: "Temple Security", phone: "1800-987-6543" },
  { label: "Police Assistance", phone: "112" }
];

export default function MissingPersonPage() {
  const navigate = useNavigate();

  // Active operational flow toggle: 'REPORT' vs 'FOUND'
  const [activeMode, setActiveMode] = useState("REPORT");
  
  const [form, setForm] = useState({
    name: "", age: "", gender: "", location: "", time: "", description: "", contact: ""
  });
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [locationCoordinates, setLocationCoordinates] = useState(null);
  const [resolvedLocationName, setResolvedLocationName] = useState("Fetching live location name...");
  const [locationError, setLocationError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Autofill user contact text index on launch if stored locally
  useEffect(() => {
    if (user?.contact_number || user?.phone) {
      setForm((prev) => ({ ...prev, contact: user.contact_number || user.phone }));
    }
  }, []);

  function fetchDeviceCoordinates() {
    if (!navigator.geolocation) {
      setLocationError("Device GPS tracking is not supported by your browser.");
      return;
    }
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocationCoordinates(coords);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await response.json();
          setResolvedLocationName(data.display_name || "Temple Premises, Ayodhya");
        } catch {
          setResolvedLocationName("Temple Compound Area, Ayodhya");
        }
      },
      () => {
        setLocationError("Please enable device location services to assist dispatch logs.");
        setResolvedLocationName("Temple Premises, Ayodhya");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  useEffect(() => {
    fetchDeviceCoordinates();
  }, []);

  async function executeReportSubmission() {
    setShowConfirmModal(false);
    try {
      setSending(true);

      let imagePath = null;
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResponse = await api.post("/upload/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imagePath = uploadResponse.data.image_path;
      }

      const generatedTicket = `MP-${Date.now().toString().slice(-6)}`;

      await api.post("/incident/create", {
        user_id: user.id,
        type: "MISSING_PERSON",
        category: activeMode === "REPORT" ? "Missing Person Report" : "Found Person Check-In",
        description: form.description,
        latitude: locationCoordinates ? locationCoordinates.latitude.toString() : "0",
        longitude: locationCoordinates ? locationCoordinates.longitude.toString() : "0",
        missing_person_name: form.name,
        missing_person_age: Number(form.age),
        missing_person_gender: form.gender,
        contact_number: form.contact,
        location_name: activeMode === "REPORT" ? form.location : "",
        last_seen_time: activeMode === "REPORT" ? form.time : "",
        image_path: imagePath,
        incident_ticket: generatedTicket
      });

      setTrackingId(generatedTicket);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to submit report. Please alert nearby ground security anchors immediately.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center p-4 md:p-6 antialiased text-left">
        <motion.div 
          initial={{ scale: 0.97, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-white rounded-2xl p-6 md:p-10 shadow-md max-w-lg w-full text-center border border-[#f3e3c3]"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-3xs mb-5">
            <CheckCircle2 size={36} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-950 m-0">{activeMode === "REPORT" ? "Missing Person Report Registered" : "Found Person Registered"}</h2>
          <p className="mt-2 text-sm font-semibold text-slate-700 leading-relaxed m-0">
            Your report has been broadcast successfully. On-ground search operations, helpdesk speakers, and patrol vectors have been synchronized.
          </p>
          
          <div className="mt-6 bg-[#fffdf8] rounded-xl p-5 border border-[#f3e3c3] shadow-3xs">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest m-0">Missing Report ID</p>
            <p className="text-2xl font-black text-orange-800 tracking-tight mt-1 m-0">{trackingId}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button 
              onClick={() => navigate("/devotee/dashboard")} 
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition border-0 cursor-pointer shadow-3xs"
            >
              Return to Dashboard
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl transition cursor-pointer"
            >
              View My Reports
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf8] text-slate-800 px-4 py-6 md:p-6 text-left antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Top Title Header */}
        <div className="flex items-center gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight m-0">Missing Person Assistance</h1>
            <p className="text-sm font-medium text-slate-700 m-0 pt-0.5">Report or search for a missing family member during your temple visit.</p>
          </div>
        </div>

        {/* Informational Verification Disclaimer Banner */}
        <div className="bg-[#fef3c7] border border-[#f59e0b] rounded-2xl p-4 flex gap-3 shadow-3xs">
          <AlertOctagon size={20} className="text-amber-700 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-amber-900 leading-relaxed m-0">
            <strong className="text-amber-950 font-black">Important Notice:</strong> This service links directly with public announcement networks and ground security anchors. Providing precise data accelerates real-time tracking protocols.
          </p>
        </div>

        {/* Operational Mode Toggle Split Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveMode("REPORT")}
            className={`p-5 rounded-xl border-2 transition-all flex items-start gap-4 text-left cursor-pointer focus:outline-hidden ${
              activeMode === "REPORT"
                ? "bg-[#fffbeb] border-[#ea580c] ring-4 ring-[#ea580c]/5 shadow-3xs"
                : "bg-white border-[#f3e3c3] hover:border-orange-300"
            }`}
          >
            <div className={`p-2.5 rounded-lg border shrink-0 ${activeMode === "REPORT" ? "bg-[#ea580c] border-[#ea580c] text-white" : "bg-slate-50 border-[#f3e3c3] text-slate-400"}`}>
              <Search size={20} />
            </div>
            <div>
              <span className="text-base font-bold text-slate-950 block">Report a Missing Person</span>
              <p className="text-sm font-medium text-slate-700 leading-snug m-0 pt-0.5">Initiate search arrays and desk broadcasts for a companion.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("FOUND")}
            className={`p-5 rounded-xl border-2 transition-all flex items-start gap-4 text-left cursor-pointer focus:outline-hidden ${
              activeMode === "FOUND"
                ? "bg-[#fffbeb] border-[#ea580c] ring-4 ring-[#ea580c]/5 shadow-3xs"
                : "bg-white border-[#f3e3c3] hover:border-orange-300"
            }`}
          >
            <div className={`p-2.5 rounded-lg border shrink-0 ${activeMode === "FOUND" ? "bg-[#ea580c] border-[#ea580c] text-white" : "bg-slate-50 border-[#f3e3c3] text-slate-400"}`}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-base font-bold text-slate-950 block">I Have Found Someone</span>
              <p className="text-sm font-medium text-slate-700 leading-snug m-0 pt-0.5">Register a separated person currently safe at your coordinates.</p>
            </div>
          </button>
        </div>

        {/* Main Processing Request Intake Form Container */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (form.contact.length !== 10) {
                alert("Please enter a valid 10-digit mobile number.");
                return;
            }
            setShowConfirmModal(true);
        }}
          className="bg-white rounded-2xl p-5 md:p-6 border border-[#f3e3c3] shadow-3xs space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">Full Name</label>
              <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 focus-within:ring-2 focus:ring-[#ea580c]">
                <User size={16} className="text-slate-400 shrink-0" />
                <input 
                  required 
                  type="text"
                  placeholder="e.g. Rahul Sharma" 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">Age</label>
              <div className="border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 focus-within:ring-2 focus:ring-[#ea580c]">
                <input 
                  required 
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 12" 
                  value={form.age}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                        setForm({ ...form, age: "" });
                        return;
                    }
                    const age = Number(value);
                    if (age >= 1 && age <= 120) {
                        setForm({ ...form, age: value });
                    }
                }}
                  className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">Gender</label>
            <div className="border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 h-[46px] flex items-center focus-within:ring-2 focus:ring-[#ea580c]">
              <select
                required
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
              >
                <option value="" className="text-slate-400">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">Last Seen Location</label>
            <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 focus-within:ring-2 focus:ring-[#ea580c]">
              <MapPin size={16} className="text-slate-400 shrink-0" />
              <input 
                required={activeMode === "REPORT"}
                disabled={activeMode === "FOUND"}
                type="text"
                placeholder={
                  activeMode === "FOUND"
                    ? "Not required when reporting a found person"
                    : "e.g. Near Corridor Gate No. 2 Comfort Desk"
                }
                value={
                  activeMode === "FOUND"
                    ? ""
                    : form.location
                }
                onChange={(e) =>
                  activeMode === "REPORT" &&
                  setForm({ ...form, location: e.target.value })
                }
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">Last Seen Time</label>
              <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-2.5 flex items-center gap-3 focus-within:ring-2 focus:ring-[#ea580c]">
                <Clock3 size={16} className="text-slate-400 shrink-0" />
                <input 
                  required={activeMode === "REPORT"}
                  disabled={activeMode === "FOUND"}
                  type="time"
                  value={
                    activeMode === "FOUND"
                      ? ""
                      : form.time
                  }
                  onChange={e => setForm({...form, time: e.target.value})}
                  className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer h-6" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">Reporter Contact Number</label>
              <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 focus-within:ring-2 focus:ring-[#ea580c]">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={form.contact}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setForm({
                        ...form,
                        contact: value,
                      });
                    }
                  }}
                  className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase block px-0.5">Clothing & Physical Description</label>
            <div className="border border-[#f3e3c3] rounded-xl bg-[#fffdf8] p-3.5 focus-within:ring-2 focus:ring-[#ea580c]">
              <textarea 
                required 
                rows={3} 
                placeholder="Describe clothing style, vertical height range, color codes or any identifying items..." 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 resize-none focus:outline-hidden" 
              />
            </div>
          </div>

          {/* Graphical Support Node: Image File Vault */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase block px-0.5">Recent Photograph (Optional)</label>
            <div className="border-2 border-dashed border-[#f3e3c3] rounded-xl p-5 bg-[#fffdf8] text-center hover:bg-[#fffbeb]/40 transition relative flex flex-col items-center justify-center gap-2">
              <Upload className="text-slate-400" size={20} />
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setImage(e.target.files[0])} 
                className="text-xs text-slate-700 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-orange-50 file:text-[#ea580c] file:cursor-pointer cursor-pointer" 
              />
              {image && <span className="text-xs font-bold text-emerald-700">✓ File selected: {image.name}</span>}
            </div>
          </div>

          {/* Reporter Coordinates Tracking HUD */}
          <div className="bg-white p-4 rounded-xl border border-[#f3e3c3] shadow-3xs flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Your Sync Coordinates</span>
              <span className="font-extrabold text-sm text-slate-950 block truncate max-w-[20rem] sm:max-w-md pt-0.5">{resolvedLocationName}</span>
              {locationCoordinates && (
                <p className="text-[11px] text-slate-500 font-mono m-0 pt-0.5">
                  GPS: {locationCoordinates.latitude.toFixed(5)}, {locationCoordinates.longitude.toFixed(5)} • <span className="text-emerald-700 font-bold">Verified</span>
                </p>
              )}
              {locationError && <p className="text-xs font-bold text-rose-600 m-0 pt-0.5">{locationError}</p>}
            </div>
            <button 
              type="button"
              onClick={fetchDeviceCoordinates}
              className="bg-slate-50 p-3 rounded-xl text-slate-600 border border-[#f3e3c3] hover:bg-orange-50 hover:text-[#ea580c] transition shrink-0 cursor-pointer shadow-3xs"
            >
              <MapPin size={16} className={!locationCoordinates && !locationError ? "animate-pulse text-[#ea580c]" : ""} />
            </button>
          </div>

          {/* Submission Fire Panel Control Button */}
          <button 
            type="submit"
            disabled={sending}
            className="w-full py-4 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-sm tracking-widest shadow-md shadow-orange-100 uppercase border-0 transition-all cursor-pointer rounded-xl active:scale-[0.995]"
          >
            {sending ? "Registering Case..." : activeMode === "REPORT" ? "Submit Missing Person Report" : "Register Found Person"}
          </button>
        </form>

        {/* Quick Dial Critical Helplines Matrix */}
        <div className="bg-white p-4 rounded-xl border border-[#f3e3c3] shadow-3xs space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">Emergency Help Center Helplines</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {STATIC_HELPLINES.map((line) => (
              <a 
                key={line.phone}
                href={`tel:${line.phone}`}
                className="flex items-center justify-between px-3 py-2 bg-[#fffdf8] border border-[#f3e3c3] rounded-xl hover:bg-orange-50/40 text-slate-900 font-semibold text-sm transition decoration-none shadow-3xs"
              >
                <div className="truncate pr-1 text-left">
                  <span className="text-[10px] text-slate-500 block tracking-tight uppercase font-bold">{line.label}</span>
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

      {/* Verification Dialog Box Portal */}
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
                <div className="p-2 bg-amber-50 border border-amber-100 rounded-xl text-[#ea580c] shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1 space-y-0.5 text-left">
                  <h3 className="text-base font-black text-slate-950 m-0">{activeMode === "REPORT" ? "Confirm Missing Person Report" : "Confirm Found Person Registration"}</h3>
                  <p className="text-sm font-semibold text-slate-700 leading-normal m-0 pt-0.5">
                    This will instantly dispatch this report to the temple control center, public announcer networks, and patrolling teams.
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
                  Modify
                </button>
                <button 
                  onClick={executeReportSubmission}
                  className="flex-1 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-sm rounded-xl transition border-0 cursor-pointer shadow-xs"
                >
                  Confirm Dispatch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}