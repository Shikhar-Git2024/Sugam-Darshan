import { motion } from "framer-motion";
import { Bell, AlertTriangle, CalendarDays, CloudSun, Info } from "lucide-react";

export default function RecentNotifications() {
  // In production, fetch this from your API.
  const notifications = [
    {
      id: 1,
      icon: Bell,
      title: "Darshan Update",
      message: "Current crowd level is moderate. Expected wait time is 18 minutes.",
      time: "2 mins ago",
      type: "update"
    },
    {
      id: 2,
      icon: CalendarDays,
      title: "Festival Advisory",
      message: "Crowd levels are expected to increase during upcoming celebrations.",
      time: "1 hour ago",
      type: "info"
    },
    {
      id: 3,
      icon: AlertTriangle,
      title: "Security Notice",
      message: "Please keep your belongings secure and follow temple guidelines.",
      time: "Today",
      type: "alert"
    },
  ];

  const getStyle = (type) => {
    switch(type) {
      case 'alert': return "text-orange-700 bg-orange-50";
      case 'info': return "text-blue-700 bg-blue-50";
      default: return "text-amber-700 bg-amber-50";
    }
  };

  return (
    <section className="px-8 pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Latest Updates</h2>
        <p className="text-slate-500 mt-1">Real-time alerts from the temple authority.</p>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n, index) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-amber-200 transition-colors shadow-sm"
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getStyle(n.type)}`}>
                  <n.icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-900">{n.title}</h3>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{n.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
            <Info className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-400">No new notifications.</p>
          </div>
        )}
      </div>
    </section>
  );
}