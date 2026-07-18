import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, Shield, Save, Phone, Languages, Lock, 
  RefreshCw, CheckCircle2, Clock, Mail, CalendarDays, ArrowLeft
} from "lucide-react";
import api from "../../services/api";

export default function ProfileSettingsPage() {
  const navigate = useNavigate();

  const sessionUser = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
  );

  const [profile, setProfile] = useState({
    name: sessionUser.name || "Devotee",
    email: sessionUser.email || "Connected",
    id: sessionUser.id || "N/A",
    phone: "",
    language: "English",
    visitTime: "Morning",
    emergencyName: "",
    emergencyPhone: "",
  });

  const [initialProfile, setInitialProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      const profileRes = await api.get(`/devotee/profile/${sessionUser.id}`).catch(() => null);
      const backendData = profileRes?.data?.profile || {};
      const savedLocalProfile = JSON.parse(localStorage.getItem("profile_preferences") || "{}");

      const parsedProfile = {
        name: sessionUser.name || "Devotee",
        email: sessionUser.email || "Connected",
        id: sessionUser.id || "N/A",
        phone: backendData.phone || savedLocalProfile.phone || sessionUser.mobile || "",
        language: backendData.language || savedLocalProfile.language || "English",
        visitTime: backendData.visitTime || savedLocalProfile.visitTime || "Morning",
        emergencyName: backendData.emergencyName || savedLocalProfile.emergencyName || "",
        emergencyPhone: backendData.emergencyPhone || savedLocalProfile.emergencyPhone || "",
      };

      setProfile(parsedProfile);
      setInitialProfile(parsedProfile);
    } catch (error) {
      console.error("Error drawing profile configuration:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(profile) !== JSON.stringify(initialProfile);
  }, [profile, initialProfile]);

  const handleSaveChanges = async () => {
    if (!hasUnsavedChanges) return;
    try {
      setSaving(true);
      await api.put(`/devotee/profile/update`, {
        user_id: profile.id,
        phone: profile.phone,
        language: profile.language,
        visitTime: profile.visitTime,
        emergencyName: profile.emergencyName,
        emergencyPhone: profile.emergencyPhone
      });

      const updatedUserToken = {
        ...sessionUser,
        mobile: profile.phone,
        language: profile.language
      };
      localStorage.setItem("user", JSON.stringify(updatedUserToken));
      sessionStorage.setItem("user", JSON.stringify(updatedUserToken));
      localStorage.setItem("profile_preferences", JSON.stringify(profile));
      
      setInitialProfile(profile);
      await fetchProfileDetails();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (error) {
      console.error("Profile write exception:", error);
      alert("Unable to save your profile. Please try again.");
      return;
    } finally {
      setSaving(false);
    }
  };

  const initials = useMemo(() => {
    return profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }, [profile.name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf8] flex flex-col justify-center items-center gap-2">
        <RefreshCw className="h-6 w-6 text-[#ea580c] animate-spin" />
        <p className="text-slate-700 font-bold text-sm tracking-wide">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf8] text-slate-800 font-sans antialiased text-left px-4 py-6 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Success Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 text-sm font-bold border border-emerald-500"
            >
              <CheckCircle2 size={16} />
              <span>Changes saved successfully.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Standardized Navigation Header Block */}
        <div className="flex items-center gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight m-0">Account Settings</h1>
            <p className="text-sm font-medium text-slate-700 m-0 pt-0.5">Manage your personal information, language preferences and emergency contacts.</p>
          </div>
        </div>

        {/* Profile Avatar Identity HUD */}
        <div className="bg-white rounded-2xl p-5 border border-[#f3e3c3] shadow-3xs flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ea580c] to-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0 select-none">
            {initials}
          </div>
          <div className="space-y-1 text-center sm:text-left min-w-0">
            <h2 className="text-lg font-black text-slate-950 m-0 tracking-tight truncate">{profile.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1"><Mail size={13} className="text-slate-400" /> {profile.email}</span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1"><Shield size={13} className="text-slate-400" /> USER ID: #{profile.id}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Forms Layout Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section A: Personal Information */}
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-[#f3e3c3] shadow-3xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2 pb-2.5 border-b border-slate-100 m-0">
              <User size={16} className="text-[#ea580c]" /> Personal Information
            </h3>
            
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  Full Name <Lock size={12} className="text-slate-400" />
                </label>
                <input 
                  type="text" 
                  value={profile.name} 
                  disabled 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-500 font-bold cursor-not-allowed focus:outline-hidden" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  Email Address <Lock size={12} className="text-slate-400" />
                </label>
                <input 
                  type="email" 
                  value={profile.email} 
                  disabled 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-500 font-bold cursor-not-allowed focus:outline-hidden" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Contact Phone Number
                </label>
                <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#ea580c]">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={profile.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      if (value.length <= 10) {
                        setProfile({
                          ...profile,
                          phone: value,
                        });
                      }
                    }}
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
                    placeholder="Enter 10-digit mobile number"
                  />
                  {profile.phone.length > 0 && profile.phone.length < 10 && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      Please enter a valid 10-digit mobile number.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Preferred Language
                </label>
                <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 h-[46px] flex items-center focus-within:ring-2 focus-within:ring-[#ea580c]">
                  <Languages size={14} className="text-slate-400 shrink-0 mr-3" />
                  <select 
                    value={profile.language} 
                    onChange={e => setProfile({...profile, language: e.target.value})} 
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Sanskrit">Sanskrit</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section B: Emergency Contact */}
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-[#f3e3c3] shadow-3xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2 pb-2.5 border-b border-slate-100 m-0">
              <Shield size={16} className="text-[#ea580c]" /> Emergency Contact
            </h3>
            
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Emergency Contact Name
                </label>
                <div className="border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 focus-within:ring-2 focus:ring-[#ea580c]">
                  <input 
                    type="text"
                    value={profile.emergencyName} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s.-]/g, "");
                      setProfile({
                        ...profile,
                        emergencyName: value,
                      });
                    }}
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden" 
                    placeholder="Enter guardian full name" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Emergency Contact Number
                </label>
                <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 focus-within:ring-2 focus:ring-[#ea580c]">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={profile.emergencyPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setProfile({
                          ...profile,
                          emergencyPhone: value,
                        });
                      }
                    }}
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
                    placeholder="Enter 10-digit mobile number"
                  />
                  {profile.emergencyPhone.length > 0 && profile.emergencyPhone.length < 10 && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      Please enter a valid 10-digit emergency contact number.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Preferred Visit Time
                </label>
                <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 h-[46px] flex items-center focus-within:ring-2 focus:ring-[#ea580c]">
                  <Clock size={14} className="text-slate-400 shrink-0 mr-3" />
                  <select 
                    value={profile.visitTime} 
                    onChange={e => setProfile({...profile, visitTime: e.target.value})} 
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Read-Only Account Specifications Row */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-2"><CalendarDays size={14} className="text-slate-400" /> <span>Member Since: <strong className="text-slate-900 font-bold">2026</strong></span></div>
          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> <span>Account Status: <strong className="text-emerald-700 font-bold">Active</strong></span></div>
          <div className="flex items-center gap-2"><Lock size={14} className="text-slate-400" /> <span>Privacy Vector: <strong className="text-slate-900 font-bold">Protected</strong></span></div>
        </div>

        {/* Action Trigger Button */}
        <button 
          onClick={handleSaveChanges}
          disabled={!hasUnsavedChanges || saving}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm tracking-widest uppercase border-0 transition-all select-none cursor-pointer ${
            hasUnsavedChanges && !saving
              ? "bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md shadow-orange-600/10 active:scale-[0.995]"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
              Saving...
            </>
          ) : (
            <>
              <Save size={15} /> Save Changes
            </>
          )}
        </button>

      </div>
    </div>
  );
}