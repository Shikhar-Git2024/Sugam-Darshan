import { 
  LayoutDashboard, Activity, CalendarCheck, Users, Clock, 
  ShieldAlert, ShieldCheck, Search, Bell, LogOut 
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AuthorityNavbar() {
  const navigate = useNavigate();
  
  const navItems = [
    { name: "Dashboard Overview", icon: LayoutDashboard, path: "/authority/dashboard" },
    { name: "Live Crowd Monitoring", icon: Activity, path: "/authority/live-crowd-monitoring" },
    { name: "Booking Management", icon: CalendarCheck, path: "/authority/bookings" },
    { name: "Devotee Management", icon: Users, path: "/authority/devotees" },
    { name: "Waitlist Management", icon: Clock, path: "/authority/waitlist" },
    { name: "Risk Analysis Center", icon: ShieldCheck, path: "/authority/risk-analysis" },
    { name: "SOS Center", icon: ShieldAlert, path: "/authority/sos" },
    { name: "Notification Center", icon: Bell, path: "/authority/notifications" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col z-50 shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Sugam Darshan</h1>
        <p className="text-sm text-slate-500 font-medium">Authority Command Center</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
              ${isActive ? "bg-violet-100 text-violet-700" : "text-slate-600 hover:bg-slate-50"}
            `}
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => { localStorage.clear(); navigate("/login"); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}