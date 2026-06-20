import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, CloudSun, AlertTriangle, Megaphone, CheckCircle2, Inbox } from "lucide-react";

export default function NotificationsPage() {
  const [notifications] = useState([
    { id: 1, type: "booking", title: "Booking Confirmed", message: "Your darshan slot is confirmed for 18 June 2026.", time: "10m ago", read: false },
    { id: 2, type: "weather", title: "Heat Advisory", message: "Temperature may reach 39°C today. Please carry water.", time: "1h ago", read: false },
    { id: 3, type: "festival", title: "Guru Purnima Update", message: "High crowd expected during Guru Purnima.", time: "3h ago", read: true },
    { id: 4, type: "authority", title: "Temple Announcement", message: "Gate B will remain closed from 2 PM to 4 PM.", time: "Yesterday", read: true },
  ]);

  const getIcon = (type) => {
    const style = "size-6";
    switch (type) {
      case "booking": return <Calendar className={`text-blue-500 ${style}`} />;
      case "weather": return <CloudSun className={`text-orange-500 ${style}`} />;
      case "festival": return <Bell className={`text-violet-500 ${style}`} />;
      case "authority": return <Megaphone className={`text-red-500 ${style}`} />;
      default: return <AlertTriangle className={`text-amber-500 ${style}`} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <header>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Notifications</h1>
          <p className="mt-2 text-slate-500">Stay informed with real-time updates from the temple authority.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", count: notifications.length, color: "text-slate-600" },
            { label: "Unread", count: unreadCount, color: "text-red-600" },
            { label: "Read", count: notifications.length - unreadCount, color: "text-green-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">{stat.label}</p>
              <h2 className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.count}</h2>
            </div>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl p-6 border transition-all ${
                  !n.read ? "border-violet-200 shadow-sm" : "border-slate-100 opacity-80"
                }`}
              >
                <div className="flex gap-4">
                  <div className={`mt-1 p-2 rounded-2xl ${!n.read ? "bg-violet-50" : "bg-slate-50"}`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-900">{n.title}</h3>
                      <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-2">{n.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}