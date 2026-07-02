import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Bell, 
  Calendar, 
  CloudSun, 
  AlertTriangle, 
  Megaphone, 
  Inbox,
  Loader2,
  CheckCircle,
  Eye,
  Info,
  ShieldCheck,
  FlameKindling,
  ArrowLeft,
  Activity,
  History,
  Sparkles,
  HeartHandshake,
  CheckCircle2
} from "lucide-react";
import api from "../../services/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionProcessingId, setActionProcessingId] = useState(null);

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
    }, 3000);

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

  // ================= DYNAMIC CATEGORY, ICON & DESCRIPTION FILTER =================
  const getNotificationMetadata = (type, title = "", message = "") => {
    const normalType = type?.toUpperCase() || "DEFAULT";
    const normalizedTitle = title?.toLowerCase() || "";
    const normalizedMessage = message?.toLowerCase() || "";
    
    const isResolved = 
      normalizedTitle.includes("resolved") || 
      normalizedMessage.includes("resolved") ||
      normalizedTitle.includes("fixed") ||
      normalizedMessage.includes("fixed");

    switch (normalType) {
      case "SOS":
        if (isResolved) {
          return {
            icon: <HeartHandshake className="size-5 text-emerald-600" />,
            bgColor: "bg-emerald-50",
            borderColor: "border-l-emerald-600",
            badge: "bg-emerald-100 text-emerald-800",
            meaning: "Medical/SOS Resolved",
            actionHint: "💚 Medical or security personnel have fully completed your emergency assistance request. On-ground logs are marked clear, and no further urgent action is required on your part."
          };
        }
        return {
          icon: <FlameKindling className="size-5 text-red-600 animate-bounce" />,
          bgColor: "bg-red-50",
          borderColor: "border-l-red-600",
          badge: "bg-red-100 text-red-800",
          meaning: "Active SOS Alert",
          actionHint: "🚨 Active Emergency Support Request received. Ground response forces are actively coordinating navigation tracking vectors to reach your exact spot. Keep your device terminal active."
        };

      case "AUTHORITY":
        if (isResolved) {
          return {
            icon: <CheckCircle2 className="size-5 text-indigo-600" />,
            bgColor: "bg-indigo-50",
            borderColor: "border-l-indigo-600",
            badge: "bg-indigo-100 text-indigo-800",
            meaning: "Access Accepted",
            actionHint: "✅ Request Accepted: Sector supervisors have approved your entry gate permissions or boundary passage requests. You can now step forward to the queue line checkers cleanly."
          };
        }
        return {
          icon: <Megaphone className="size-5 text-purple-600" />,
          bgColor: "bg-purple-50",
          borderColor: "border-l-purple-600",
          badge: "bg-purple-100 text-purple-800",
          meaning: "Management Instruction",
          actionHint: "📣 On-Ground Notice: Official temple command centers are modifying active corridor routes or exit directions. Please read the specific text above and adapt your tracking route map."
        };

      case "WEATHER":
        return {
          icon: <CloudSun className="size-5 text-sky-600" />,
          bgColor: "bg-sky-50",
          borderColor: "border-l-sky-400",
          badge: "bg-sky-100 text-sky-800",
          meaning: "Weather Advisory",
          actionHint: "🌤️ Environmental Advisory Update. Check outdoor tracking parameters and stay hydrated along exposed stone staircase sections."
        };

      case "BOOKING":
        return {
          icon: <Calendar className="size-5 text-teal-600" />,
          bgColor: "bg-teal-50",
          borderColor: "border-l-teal-500",
          badge: "bg-teal-100 text-teal-800",
          meaning: "Pass Token Confirmed",
          actionHint: "🎟️ Slot Validation Token successfully updated in your application profile database record. Secure verification code keys are compiled."
        };

      case "FESTIVAL":
        return {
          icon: <Bell className="size-5 text-amber-600" />,
          bgColor: "bg-amber-50",
          borderColor: "border-l-amber-500",
          badge: "bg-amber-100 text-amber-800",
          meaning: "Procession Schedule",
          actionHint: "🪔 Ritual Phase Update: Public event queues are shifting as central mandap decoration processions begin. Arrive early at designated perimeter checks."
        };

      default:
        return {
          icon: <Info className="size-5 text-slate-500" />,
          bgColor: "bg-slate-50",
          borderColor: "border-l-slate-400",
          badge: "bg-slate-100 text-slate-800",
          meaning: "System Broadcast",
          actionHint: "ℹ️ Automated system tracking log entry processed for application records synchronization metrics."
        };
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Just now";
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const unreadNotifications = useMemo(() => notifications.filter(n => !n.is_read), [notifications]);
  const readNotifications = useMemo(() => notifications.filter(n => n.is_read), [notifications]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-violet-600 mr-3" size={24} />
        <span className="text-slate-700 text-lg font-bold">Fetching active alerts...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-amber-50/20 p-4 md:p-8 text-slate-800 antialiased selection:bg-orange-100 pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Control */}
        <div className="flex items-center justify-start">
          <Link 
            to="/devotee/dashboard" 
            className="inline-flex items-center gap-2.5 text-base font-black text-slate-500 hover:text-slate-900 transition bg-white/80 hover:bg-white px-5 py-2.5 rounded-2xl border border-slate-200/60 shadow-xs cursor-pointer group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Floating Glass Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm tracking-widest uppercase mb-1">
              <Activity size={16} className="text-orange-500 animate-pulse" />
              Live Security Dispatch
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Notifications Hub
            </h1>
            <p className="mt-1 text-base text-slate-500 font-semibold">Real-time alerts, crowd safety parameters, and official operational updates.</p>
          </div>
        </header>

        {/* METRICS DASHBOARD ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <StatCard label="Total Feed Flow" count={notifications.length} color="text-slate-800" bgStyle="bg-white border-slate-200/60 shadow-xs" />
          <StatCard label="Unread Updates" count={unreadNotifications.length} color={unreadNotifications.length > 0 ? "text-red-600 font-black" : "text-slate-400"} bgStyle="bg-red-50/40 border-red-200/40 shadow-xs" />
          <StatCard label="Processed History" count={readNotifications.length} color="text-emerald-600" bgStyle="bg-emerald-50/30 border-emerald-200/30 shadow-xs" />
        </div>

        {/* BALANCED SPLIT INTERFACE SHEET LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
          
          {/* COLUMN 1 (LEFT SIDE): ACTIVE UNREAD NOTIFICATIONS PANE */}
          <div className="space-y-4 bg-white rounded-3xl border border-slate-200/60 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Active Stream ({unreadNotifications.length})</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Needs Action</span>
            </div>

            <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
              <AnimatePresence>
                {unreadNotifications.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center text-slate-400 font-medium text-base"
                  >
                    <Inbox size={40} className="mx-auto mb-3 text-slate-300" />
                    No new alerts. Your timeline is current!
                  </motion.div>
                ) : (
                  unreadNotifications.map((n, index) => {
                    const meta = getNotificationMetadata(n.type, n.title, n.message);
                    return (
                      <motion.div
                        key={n.id || `unread-${index}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`bg-slate-50/50 rounded-2xl p-5 border border-l-4 shadow-3xs transition-all ${meta.borderColor} border-slate-200/40`}
                      >
                        <div className="flex gap-4">
                          <div className={`p-3 rounded-xl h-fit shadow-3xs ${meta.bgColor}`}>
                            {meta.icon}
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight leading-tight">{n.title}</h3>
                                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${meta.badge}`}>
                                  {meta.meaning}
                                </span>
                              </div>
                              <span className="text-xs font-bold font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100 shadow-3xs whitespace-nowrap">
                                {formatTime(n.created_at)}
                              </span>
                            </div>
                            
                            <p className="text-base font-medium text-slate-600 leading-relaxed">{n.message}</p>
                            
                            {/* Adaptive guidance container blocks */}
                            <div className={`p-3.5 rounded-xl text-sm font-bold border ${meta.bgColor} bg-opacity-50 border-slate-100/30 leading-relaxed text-slate-700`}>
                              {meta.actionHint}
                            </div>
                            
                            <div className="pt-1 flex justify-end">
                              <button
                                disabled={actionProcessingId === n.id}
                                onClick={() => handleMarkAsRead(n.id)}
                                className="flex items-center gap-1.5 text-xs text-violet-700 font-extrabold bg-violet-50 hover:bg-violet-100 shadow-3xs border border-violet-100/30 transition px-4 py-2 rounded-xl cursor-pointer disabled:opacity-50"
                              >
                                {actionProcessingId === n.id ? (
                                  <Loader2 className="animate-spin size-3" />
                                ) : (
                                  <Eye className="size-3.5" />
                                )}
                                Mark Read
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* COLUMN 2 (RIGHT SIDE): RESOLVED ARCHIVED ALERTS TRACKER */}
          <div className="space-y-4 bg-white rounded-3xl border border-slate-200/60 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <History className="size-5 text-slate-400" />
                <h2 className="text-xl font-black text-slate-500 tracking-tight">Archived Logs ({readNotifications.length})</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">History</span>
            </div>

            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              <AnimatePresence>
                {readNotifications.length === 0 ? (
                  <div className="text-center font-bold text-sm text-slate-400/80 py-16">
                    No items found in system history records.
                  </div>
                ) : (
                  readNotifications.map((n, index) => {
                    const meta = getNotificationMetadata(n.type, n.title, n.message);
                    return (
                      <motion.div
                        key={n.id || `read-${index}`}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        className={`bg-slate-50/30 rounded-2xl p-4 border border-l-4 shadow-3xs transition-all ${meta.borderColor}`}
                      >
                        <div className="flex gap-4 items-start">
                          <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 shadow-3xs bg-white`}>
                            {meta.icon}
                          </div>
                          
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex justify-between items-baseline gap-4">
                              <div className="flex items-center gap-2 truncate">
                                <h4 className="font-extrabold text-slate-600 text-base md:text-lg line-through decoration-slate-300 truncate">{n.title}</h4>
                                <span className={`text-[9px] font-black px-2 py-0.5 border text-slate-500 rounded tracking-wider uppercase shrink-0 shadow-3xs ${meta.badge}`}>
                                  {meta.meaning}
                                </span>
                              </div>
                              <span className="text-xs font-bold font-mono text-slate-400 shrink-0">
                                {formatTime(n.created_at)}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 leading-normal">{n.message}</p>
                            
                            {/* Clear instruction notes display underneath resolved past streams */}
                            <div className="text-xs font-bold text-slate-500 border-t border-slate-100 pt-2 leading-relaxed italic">
                              {meta.actionHint}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Global Emergency Index Key Badge Footer Panel */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} /> Emergency Priority Index Key
            </h3>
            <p className="text-xs text-slate-400 font-medium">Use layout category highlights to instantly identify active dispatch streams across fields.</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
              <span>SOS Emergency</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full" />
              <span>Authority Limits</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
              <span>Ritual Updates</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, count, color, bgStyle }) {
  return (
    <div className={`p-4 rounded-2xl flex items-center justify-between gap-4 border ${bgStyle}`}>
      <p className="text-sm uppercase font-extrabold text-slate-400 tracking-wider">{label}</p>
      <h2 className={`text-3xl font-black tracking-tight ${color}`}>{count}</h2>
    </div>
  );
}