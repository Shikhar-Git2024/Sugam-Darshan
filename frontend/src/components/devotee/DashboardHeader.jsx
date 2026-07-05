import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, CheckCircle, Inbox, Loader2, Eye, ChevronDown } from "lucide-react";
import api from "../../services/api";

export default function DashboardHeader({
  notifications = [],
  setNotifications = () => {},
  actionProcessingId = null,
  setActionProcessingId = () => {}
}) {
  const navigate = useNavigate();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const [liveUser, setLiveUser] = useState(() => {
    try {
      const cached = localStorage.getItem("user") || sessionStorage.getItem("user");
      return cached ? JSON.parse(cached) : { name: "Devotee", email: "Connected", role: "USER" };
    } catch (e) {
      return { name: "Devotee", email: "Connected", role: "USER" };
    }
  });

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const fetchGlobalAlertStream = useCallback(async () => {
    if (!liveUser?.id) return;
    try {
      const response = await api.get(`/notifications/user/${liveUser.id}`);
      const data = response.data.notifications || response.data || [];
      setNotifications(data);
    } catch (error) {
      console.error("Error pulling notification stream inside header:", error);
    }
  }, [liveUser?.id, setNotifications]);

  useEffect(() => {
    fetchGlobalAlertStream();

    const pollInterval = setInterval(() => {
      fetchGlobalAlertStream();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [fetchGlobalAlertStream]);

  useEffect(() => {
    const clickCloseHandler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileDropdown(false);
    };
    document.addEventListener("mousedown", clickCloseHandler);
    return () => document.removeEventListener("mousedown", clickCloseHandler);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/devotee/login");
  }, [navigate]);

  const handleMarkAsRead = useCallback(async (notifId, e) => {
    e.stopPropagation();
    try {
      setActionProcessingId(notifId);
      await api.put(`/notifications/read/${notifId}`);
      setNotifications(prev =>
        prev.map(n => n.id === notifId ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error("Could not update read index status:", err);
    } finally {
      setActionProcessingId(null);
    }
  }, [setNotifications, setActionProcessingId]);

  const globalBroadcasts = useMemo(() => {
    return notifications.filter(n => {
      if (n.is_read === true || n.is_read === "true") return false;
      const typeStr = String(n.type || "").toUpperCase();
      const targetStr = String(n.target || n.target_audience || "").toUpperCase();
      const isAuthorityBroadcast = (typeStr === "AUTHORITY" || n.is_global === true || n.is_global === "true");
      const isForDevoteeContext = (targetStr === "ALL" || targetStr === "DEVOTEE" || !n.user_id);
      return isAuthorityBroadcast && isForDevoteeContext;
    });
  }, [notifications]);

  const recentDropdownList = useMemo(() => {
    return [...notifications]
      .sort((a, b) => {
        if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
        return new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp);
      })
      .slice(0, 5);
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.is_read).length;
  }, [notifications]);

  const userInitials = useMemo(() => {
    const nameString = liveUser?.name || "Devotee";
    const parts = nameString.trim().split(/\s+/);
    if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return nameString.charAt(0).toUpperCase();
  }, [liveUser?.name]);

  const getPriorityLabel = (priority) => {
    const norm = String(priority).toUpperCase();
    if (norm === "CRITICAL") return "Critical";
    if (norm === "HIGH") return "High";
    return "Normal";
  };

  const getPriorityColor = (priority) => {
    switch (String(priority).toUpperCase()) {
      case "CRITICAL": return "bg-red-50 text-red-700 border border-red-200";
      case "HIGH": return "bg-orange-50 text-orange-700 border border-orange-200";
      default: return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const getBroadcastTag = (category) => {
    const norm = String(category || "").toUpperCase();
    if (norm === "EMERGENCY" || norm === "CRITICAL") return "🚨 Emergency";
    if (norm === "FESTIVAL" || norm === "UTSAV") return "🪔 Festival";
    if (norm === "TRAVEL" || norm === "TRAFFIC") return "🚗 Travel";
    if (norm === "SYSTEM" || norm === "UPDATE") return "ℹ️ Update";
    return "📢 Announcement";
  };

  return (
    <>
      <style>{`
        @keyframes continuousLinearScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-live-marquee {
          display: flex;
          width: max-content;
          animation: continuousLinearScroll 40s linear infinite;
        }
        .animate-live-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-4 bg-white/95 backdrop-blur-md border-b border-amber-100/70 px-6 py-3.5 shadow-2xs text-left">
        
        {/* Continuous Broadcast Live Loop Canvas */}
        <div className="flex-1 min-w-0 flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 h-10 overflow-hidden relative">
          <div className="bg-orange-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 z-10 shadow-3xs mr-4 flex items-center gap-1">
            <span className="w-1 h-1 bg-white rounded-full animate-ping" />
            LIVE
          </div>
          
          <div className="relative flex flex-1 overflow-hidden items-center h-full">
            <div className="animate-live-marquee flex items-center gap-16">
              {globalBroadcasts.length === 0 ? (
                <>
                  <div className="text-slate-600 font-bold text-xs whitespace-nowrap">
                    Welcome to Sugam Darshan • Plan your visit with live crowd updates, weather information and temple announcements.
                  </div>
                  <div className="text-slate-600 font-bold text-xs whitespace-nowrap" aria-hidden="true">
                    Welcome to Sugam Darshan • Plan your visit with live crowd updates, weather information and temple announcements.
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-16 whitespace-nowrap">
                    {globalBroadcasts.map((n) => (
                      <div 
                        key={`track1-${n.id}`} 
                        onClick={() => navigate("/devotee/notifications")}
                        className="flex items-center gap-2.5 text-xs cursor-pointer hover:text-orange-700 transition"
                      >
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${getPriorityColor(n.priority)}`}>
                          {getPriorityLabel(n.priority)}
                        </span>
                        <span className="text-orange-800 font-extrabold">{getBroadcastTag(n.category || n.type)}</span>
                        <span className="text-slate-900 font-bold">{n.title}:</span>
                        <span className="text-slate-600 font-semibold">{n.message}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-10" />
        </div>

        {/* Action Triggers Controls Menu Row Layout */}
        <div className="flex items-center gap-3 shrink-0">
          
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowProfileDropdown(false); }}
              className={`p-2 rounded-xl border transition-all cursor-pointer relative focus:outline-hidden ${
                showNotifDropdown ? "bg-slate-50 border-slate-300 text-slate-900" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center rounded-full px-1 ring-2 ring-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-md z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900 tracking-tight">Notifications</span>
                    <span className="text-[9px] bg-amber-100 text-orange-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">New</span>
                  </div>
                  
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {recentDropdownList.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 font-semibold text-xs space-y-2">
                        <Inbox size={22} className="mx-auto text-slate-300" />
                        <p>No active updates found.</p>
                      </div>
                    ) : (
                      recentDropdownList.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => { setShowNotifDropdown(false); navigate(`/devotee/notifications`); }}
                          className={`p-3 hover:bg-slate-50/80 transition cursor-pointer space-y-1 border-l-2 ${
                            n.is_read ? "border-l-slate-200 opacity-60" : "border-l-orange-600 bg-orange-50/5 font-medium"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <h4 className="font-bold text-xs text-slate-900 tracking-tight line-clamp-1">{n.title}</h4>
                            {!n.is_read && (
                              <button
                                disabled={actionProcessingId === n.id}
                                onClick={(e) => handleMarkAsRead(n.id, e)}
                                className="text-slate-400 hover:text-orange-700 transition p-1 rounded border border-slate-200 bg-white shrink-0"
                              >
                                {actionProcessingId === n.id ? <Loader2 className="animate-spin size-2.5" /> : <Eye size={11} />}
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => { setShowNotifDropdown(false); navigate("/devotee/notifications"); }}
                    className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-orange-800 border-t border-slate-200 tracking-wide block"
                  >
                    View All Notifications →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifDropdown(false); }}
              className={`flex items-center gap-2 pl-2 pr-2.5 h-9 rounded-xl border transition-all cursor-pointer focus:outline-hidden max-w-[180px] ${
                showProfileDropdown ? "bg-slate-50 border-slate-300 text-slate-900" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-orange-700 text-white flex items-center justify-center font-bold text-[10px] tracking-wider shrink-0 shadow-3xs">
                {userInitials}
              </div>
              <span className="text-xs font-bold truncate text-slate-700 flex-1">
                {liveUser?.name || "Devotee"}
              </span>
              <ChevronDown size={13} className={`text-slate-400 transition-transform duration-150 shrink-0 ${showProfileDropdown ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 space-y-2.5"
                >
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-orange-800 flex items-center justify-center font-bold text-xs border border-amber-100/60 shrink-0">
                      {userInitials}
                    </div>
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs tracking-tight truncate flex-1">
                          {liveUser?.name || "Devotee"}
                        </h4>
                        <CheckCircle size={12} className="text-orange-700 shrink-0" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                        {liveUser?.email || "Devotee Account"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <button
                      onClick={() => { setShowProfileDropdown(false); navigate("/devotee/profile"); }}
                      className="w-full text-left px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-md transition"
                    >
                      My Profile Settings
                    </button>
                    <button
                      onClick={() => { setShowProfileDropdown(false); navigate(`/devotee/my-bookings`); }}
                      className="w-full text-left px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-md transition"
                    >
                      My Bookings
                    </button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-red-50 hover:bg-red-100/60 border border-red-100/50 text-red-600 font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    <LogOut size={12} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>
    </>
  );
}