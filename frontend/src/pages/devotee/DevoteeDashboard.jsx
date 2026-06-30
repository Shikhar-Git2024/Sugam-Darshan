import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  CameraOff, 
  VolumeX, 
  HeartHandshake, 
  ShieldCheck, 
  Bell, 
  User, 
  LogOut, 
  Compass, 
  Sparkles,
  Inbox,
  Eye,
  Loader2,
  MapPin
} from "lucide-react";
import api from "../../services/api";

import DashboardNavbar from "../../components/devotee/DashboardNavbar";
import WelcomeSection from "../../components/devotee/WelcomeSection";
import UpcomingVisitCard from "../../components/devotee/UpcomingVisitCard";
import RecentNotifications from "../../components/devotee/RecentNotifications";

const TempleGuidelines = () => {
  const rules = [
    { icon: CameraOff, title: "No Photography", desc: "Prohibited inside the core sanctum pavilions." },
    { icon: VolumeX, title: "Maintain Silence", desc: "Keep vocal noise levels low during meditations." },
    { icon: HeartHandshake, title: "Dress Modestly", desc: "Traditional clean attire required for entry gates." },
    { icon: ShieldCheck, title: "Security Checks", desc: "Cooperate actively with on-ground staff personnel." }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-xs mt-6"
    >
      <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
        <ShieldCheck className="text-orange-600" size={22} />
        Temple Code of Conduct Guidelines
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ scale: 1.01, y: -1 }}
            className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-orange-50/40"
          >
            <div className="p-3 bg-white rounded-xl shadow-3xs text-orange-600 border border-slate-200/40 shrink-0">
              <rule.icon size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">{rule.title}</h4>
              <p className="text-xs font-bold text-slate-500 mt-0.5">{rule.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default function DevoteeDashboard() {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [actionProcessingId, setActionProcessingId] = useState(null);
  
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function fetchNotifications() {
    if (!user?.id) return;
    try {
      const response = await api.get(`/notifications/user/${user.id}`);
      const data = response.data.notifications || response.data || [];
      setNotifications(data);
    } catch (error) {
      console.error("Error pulling live dashboard navigation alerts:", error);
    }
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 3000);

    return () => clearInterval(interval);
  }, [user?.id]);

  async function handleMarkAsRead(notifId, e) {
    e.stopPropagation();
    try {
      setActionProcessingId(notifId);
      await api.put(`/notifications/read/${notifId}`);
      setNotifications(prev => 
        prev.map(n => n.id === notifId ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error("Could not update layout read index status:", err);
    } finally {
      setActionProcessingId(null);
    }
  }

  const liveUnreadDropdownList = useMemo(() => {
    return notifications.filter(n => !n.is_read).slice(0, 5);
  }, [notifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/devotee/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-orange-100">
      <DashboardNavbar />

      <main className="ml-72 p-6 md:p-8 space-y-6">
        
        {/* TOP INTERACTIVE ACTION UTILITY BAR ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/60 p-4 rounded-3xl shadow-3xs">
          
          {/* Operational Metrics Strip beautifully fills out empty center space */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pl-2">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600">Sanctum Feed: <strong className="text-emerald-700">Optimal Flow</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 hidden md:flex">
              <MapPin size={14} className="text-orange-500" />
              <span>Sector Status: <strong className="text-slate-800">Clear & Active</strong></span>
            </div>
          </div>
          
          {/* Action Dropdown Elements Column */}
          <div className="flex justify-end items-center gap-3 self-end sm:self-auto">
            
            {/* Real-time Connected Notification Dropdown Panel */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowProfileDropdown(false); }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                  showNotifDropdown 
                    ? "bg-slate-950 border-slate-950 text-white shadow-md" 
                    : "bg-white border-slate-200/60 text-slate-600 hover:border-orange-400"
                }`}
              >
                <Bell size={20} />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
                      <span className="font-black text-sm text-slate-900 tracking-tight">
                        Unread Alerts Stream ({notifications.filter(n => !n.is_read).length})
                      </span>
                      <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">Live API</span>
                    </div>
                    
                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-0.5">
                      {liveUnreadDropdownList.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-medium text-sm space-y-1.5">
                          <Inbox size={28} className="mx-auto text-slate-300" />
                          <p>No active unread updates on this channel.</p>
                        </div>
                      ) : (
                        liveUnreadDropdownList.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => navigate(`/devotee/notifications`)}
                            className="p-4 hover:bg-slate-50/60 transition cursor-pointer space-y-1.5 border-l-2 border-l-orange-500/80"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <h4 className="font-extrabold text-sm text-slate-950 tracking-tight line-clamp-1">{n.title}</h4>
                              <button
                                disabled={actionProcessingId === n.id}
                                onClick={(e) => handleMarkAsRead(n.id, e)}
                                className="text-slate-400 hover:text-violet-600 transition p-0.5 rounded border border-slate-100 hover:border-violet-100 hover:bg-violet-50 shrink-0"
                                title="Dismiss Alert"
                              >
                                {actionProcessingId === n.id ? (
                                  <Loader2 className="animate-spin size-3" />
                                ) : (
                                  <Eye size={12} />
                                )}
                              </button>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <Link 
                      to="/devotee/notifications" 
                      onClick={() => setShowNotifDropdown(false)}
                      className="block text-center py-3 bg-slate-50 hover:bg-slate-100/80 text-xs font-extrabold text-orange-700 border-t border-slate-100 tracking-wide transition"
                    >
                      Open Complete Notification Hub →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Account Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifDropdown(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                  showProfileDropdown 
                    ? "bg-slate-950 border-slate-950 text-white shadow-md" 
                    : "bg-white border-slate-200/60 text-slate-700 hover:border-orange-400"
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-3xs shrink-0">
                  <User size={14} />
                </div>
                <span className="text-sm font-black tracking-tight hidden sm:inline">
                  {user.name || "Devotee Profile"}
                </span>
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2.5 w-72 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 overflow-hidden p-4 space-y-4"
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                        {(user.name || "D").charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <h4 className="font-black text-slate-900 text-base tracking-tight truncate">{user.name || "Devotee"}</h4>
                        <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">{user.email || "devotee@sugamdarshan.org"}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs font-bold text-slate-500">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                        <span className="uppercase tracking-wider text-[10px]">Devotee ID Reference</span>
                        <span className="font-mono text-slate-800">#{user.id || "9283-DX"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                        <span className="uppercase tracking-wider text-[10px]">Access Clearance</span>
                        <span className="text-emerald-700 font-extrabold uppercase">Verified</span>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100/70 border border-red-100/40 text-red-600 font-extrabold text-sm rounded-xl transition cursor-pointer"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

        {/* CORE INTEGRATED CHILD WORKSPACE SECTIONS */}
        <WelcomeSection />
        
        <div className="grid grid-cols-1 gap-6 pt-2">
          <UpcomingVisitCard />
          <RecentNotifications />
        </div>

        <TempleGuidelines />
      </main>
    </div>
  );
}