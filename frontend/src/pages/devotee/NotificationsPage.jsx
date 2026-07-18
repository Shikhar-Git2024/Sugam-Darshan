import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Bell, Calendar, CloudSun, AlertTriangle, Megaphone, 
  Inbox, Loader2, CheckCircle2, Eye, Info, ArrowLeft,
  Sparkles, CheckSquare
} from "lucide-react";
import api from "../../services/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [actionProcessingId, setActionProcessingId] = useState(null);
  const [batchProcessing, setBatchProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  async function fetchNotifications(showLoader = false) {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      if (showLoader) setLoading(true);
      const response = await api.get(`/notifications/user/${user.id}`);
      const data = response.data.notifications || response.data || [];
      setNotifications(data);
    } catch (error) {
      console.error("Error pulling notification stream:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications(true);
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [user?.id]);

  async function handleMarkAsRead(notifId) {
    try {
      setActionProcessingId(notifId);
      await api.put(`/notifications/read/${notifId}`);
      setNotifications(prev => 
        prev.map(n => n.id === notifId ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error("Could not update read status:", err);
    } finally {
      setActionProcessingId(null);
    }
  }

  async function handleMarkAllAsRead() {
    const unread = notifications.filter(n => !n.is_read);
    if (unread.length === 0) return;
    try {
      setBatchProcessing(true);
      await Promise.all(unread.map(n => api.put(`/notifications/read/${n.id}`)));
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Could not complete batch read update:", err);
    } finally {
      setBatchProcessing(false);
    }
  }

  const getNotificationMetadata = (type) => {
    const normalType = type?.toUpperCase() || "DEFAULT";
    switch (normalType) {
      case "SOS":
        return {
          icon: <AlertTriangle className="size-4 text-red-600" />,
          bgColor: "bg-red-50 border-red-200",
          indicatorColor: "bg-red-500",
          label: "Emergency"
        };
      case "AUTHORITY":
        return {
          icon: <Megaphone className="size-4 text-amber-600" />,
          bgColor: "bg-amber-50 border-amber-200",
          indicatorColor: "bg-amber-500",
          label: "Announcement"
        };
      case "BOOKING":
        return {
          icon: <Calendar className="size-4 text-orange-600" />,
          bgColor: "bg-orange-50 border-orange-200",
          indicatorColor: "bg-[#ea580c]",
          label: "Booking"
        };
      case "WEATHER":
        return {
          icon: <CloudSun className="size-4 text-blue-600" />,
          bgColor: "bg-blue-50 border-blue-200",
          indicatorColor: "bg-blue-500",
          label: "Weather"
        };
      case "FESTIVAL":
        return {
          icon: <Bell className="size-4 text-amber-500" />,
          bgColor: "bg-[#fffbeb] border-[#f3e3c3]",
          indicatorColor: "bg-amber-500",
          label: "Festival"
        };
      default:
        return {
          icon: <Info className="size-4 text-slate-500" />,
          bgColor: "bg-slate-50 border-slate-200",
          indicatorColor: "bg-slate-400",
          label: "Update"
        };
    }
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeFilter === "ALL") return true;
      if (activeFilter === "UNREAD") return !n.is_read;
      return n.type?.toUpperCase() === activeFilter;
    });
  }, [notifications, activeFilter]);

  const timelineGroups = useMemo(() => {
    const todayList = [];
    const yesterdayList = [];
    const earlierList = [];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    filteredNotifications.forEach(n => {
      const itemDate = new Date(n.created_at || n.timestamp || now);
      if (itemDate >= today) {
        todayList.push(n);
      } else if (itemDate >= yesterday) {
        yesterdayList.push(n);
      } else {
        earlierList.push(n);
      }
    });

    const sortByDate = (a, b) => new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp);

    return {
      today: todayList.sort(sortByDate),
      yesterday: yesterdayList.sort(sortByDate),
      earlier: earlierList.sort(sortByDate)
    };
  }, [filteredNotifications]);

  const formatCardTime = (dateString) => {
    if (!dateString) return "Just now";
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return past.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filterChips = [
    { id: "ALL", label: "All" },
    { id: "UNREAD", label: `Unread (${unreadCount})` },
    { id: "BOOKING", label: "Bookings" },
    { id: "AUTHORITY", label: "Announcements" },
    { id: "SOS", label: "Emergency" },
    { id: "WEATHER", label: "Weather" },
    { id: "FESTIVAL", label: "Festival" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf8]">
        <Loader2 className="animate-spin text-[#ea580c] mr-3" size={24} />
        <span className="text-slate-800 text-base font-bold tracking-tight">Loading alerts...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf8] text-slate-800 px-4 py-6 md:p-6 text-left antialiased selection:bg-orange-100 pb-16">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Premium Unified Header Node */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#f3e3c3] p-5 shadow-3xs">
          <div className="space-y-0.5">
            <h1 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight m-0">Notifications</h1>
            <p className="text-xs font-semibold text-slate-600 m-0 pt-0.5">
              Stay updated with your bookings, authority announcements, weather alerts and emergency updates.
            </p>
            <div className="text-[11px] font-bold text-slate-500 pt-1">
              {notifications.length} notifications • <span className="text-orange-700 font-extrabold">{unreadCount} unread</span>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={batchProcessing}
              className="px-4 py-2 border border-orange-200 bg-orange-50/50 hover:bg-orange-50 text-[#ea580c] text-xs font-bold tracking-wide rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-40"
            >
              {batchProcessing ? <Loader2 className="animate-spin size-3.5" /> : <CheckSquare size={13} />}
              Mark all as read
            </button>
          )}
        </div>

        {/* Dynamic Category Filtering Row */}
        <div className="w-full overflow-x-auto flex items-center gap-2 pb-1 scrollbar-none">
          {filterChips.map(chip => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-4 py-2 text-xs font-bold rounded-full border tracking-wide whitespace-nowrap transition cursor-pointer shrink-0 focus:outline-hidden ${
                activeFilter === chip.id
                  ? "bg-[#ea580c] border-[#ea580c] text-white shadow-3xs"
                  : "bg-white border-[#f3e3c3] text-slate-600 hover:bg-[#fffbeb]/50 hover:text-slate-900"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Continuous Monolithic Feed Timeline Canvas */}
        <div className="space-y-6 pt-1">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#f3e3c3] shadow-3xs space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#ea580c] flex items-center justify-center mx-auto border border-orange-100">
                <Bell size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 m-0 pt-1">You're all caught up</h3>
              <p className="text-xs font-semibold text-slate-500 m-0">No new notifications inside this category filter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {["today", "yesterday", "earlier"].map(key => {
                const group = timelineGroups[key];
                if (group.length === 0) return null;
                return (
                  <div key={key} className="space-y-2.5">
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block px-1">
                      {key}
                    </span>
                    <div className="space-y-2.5">
                      <AnimatePresence mode="popLayout">
                        {group.map((n) => {
                          const meta = getNotificationMetadata(n.type);
                          return (
                            <motion.div
                              key={n.id}
                              layout
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: n.is_read ? 0.75 : 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              className={`bg-white rounded-xl border p-4 shadow-3xs transition-all relative flex gap-3.5 items-start ${
                                n.is_read ? "border-slate-200" : "border-[#f3e3c3] ring-1 ring-orange-500/5 shadow-2xs"
                              }`}
                            >
                              {/* Dynamic Unread Status Verification Dot */}
                              {!n.is_read && (
                                <span className={`absolute top-4.5 left-2 w-2 h-2 rounded-full ${meta.indicatorColor}`} />
                              )}

                              {/* Compact Graphical Accent Capsule */}
                              <div className={`p-2 rounded-lg border shrink-0 mt-0.5 shadow-3xs bg-white ${meta.bgColor}`}>
                                {meta.icon}
                              </div>

                              {/* Structured Core Copy Information */}
                              <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex justify-between items-baseline gap-4 w-full">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <h4 className={`font-bold text-sm tracking-tight truncate m-0 ${n.is_read ? 'text-slate-600 line-through decoration-slate-300' : 'text-slate-950'}`}>
                                      {n.title}
                                    </h4>
                                    <span className="text-[9px] bg-slate-50 border border-slate-200 font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-slate-500 shrink-0 select-none">
                                      {meta.label}
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-bold font-mono text-slate-400 shrink-0">
                                    {formatCardTime(n.created_at || n.timestamp)}
                                  </span>
                                </div>
                                
                                <p className={`text-xs font-semibold leading-relaxed m-0 ${n.is_read ? 'text-slate-500' : 'text-slate-700'}`}>
                                  {n.message}
                                </p>
                              </div>

                              {/* Card Trigger Control Action Elements */}
                              {!n.is_read && (
                                <button
                                  disabled={actionProcessingId === n.id}
                                  onClick={() => handleMarkAsRead(n.id)}
                                  title="Mark Update Read"
                                  className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-[#ea580c] hover:bg-orange-50 hover:border-orange-100 transition shrink-0 cursor-pointer self-center"
                                >
                                  {actionProcessingId === n.id ? (
                                    <Loader2 className="animate-spin size-3" />
                                  ) : (
                                    <Eye size={13} />
                                  )}
                                </button>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}