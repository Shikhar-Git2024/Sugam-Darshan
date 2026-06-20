import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Users, Globe, Save, Phone, MapPin, Languages } from "lucide-react";

export default function ProfileSettingsPage() {
  const [user, setUser] = useState({ name: "Devotee", email: "devotee@example.com", role: "Gold Member" });
  const [profile, setProfile] = useState({
    phone: "", language: "English", visitTime: "Morning", emergencyName: "", emergencyPhone: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const saveProfile = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profile updated successfully");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900">Account Settings</h1>
            <p className="text-slate-500 mt-1">Manage your personal details and safety preferences.</p>
          </div>
          <div className="h-16 w-16 bg-violet-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-violet-600" />
          </div>
        </header>

        {/* Profile Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Personal Info */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-violet-600" /> Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600">Phone Number</label>
                <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full mt-2 bg-slate-50 rounded-xl p-3 border-none" placeholder="+91 XXX XXX XXXX" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600">Preferred Language</label>
                <select value={profile.language} onChange={e => setProfile({...profile, language: e.target.value})} className="w-full mt-2 bg-slate-50 rounded-xl p-3 border-none">
                  <option>English</option><option>Hindi</option><option>Sanskrit</option>
                </select>
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Shield size={20} className="text-red-500" /> Emergency Contact
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600">Contact Name</label>
                <input value={profile.emergencyName} onChange={e => setProfile({...profile, emergencyName: e.target.value})} className="w-full mt-2 bg-slate-50 rounded-xl p-3 border-none" placeholder="Enter name" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600">Contact Number</label>
                <input value={profile.emergencyPhone} onChange={e => setProfile({...profile, emergencyPhone: e.target.value})} className="w-full mt-2 bg-slate-50 rounded-xl p-3 border-none" placeholder="+91 XXX XXX XXXX" />
              </div>
            </div>
          </section>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: "Family Management", value: "Available" },
            { icon: Shield, label: "Account Security", value: "Protected" },
            { icon: Globe, label: "Language", value: profile.language },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <item.icon className="text-violet-600 mb-3" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{item.label}</p>
              <p className="font-bold text-slate-800 mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <button 
          onClick={saveProfile}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          <Save size={20} /> Save Changes
        </button>
      </div>
    </div>
  );
}