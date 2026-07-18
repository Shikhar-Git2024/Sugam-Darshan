import {
  LayoutDashboard, Sparkles, CalendarDays, BarChart3, MapPinned, 
  Map, CloudSun, BookOpen, Bell, ShieldAlert, Users, User, 
  LogOut, CalendarCheck
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(
  localStorage.getItem("user") ||
  sessionStorage.getItem("user") ||
  "{}"
);

  const menuSections = [
    {
      title: "Main Services",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/devotee/dashboard" },
        { name: "Smart Booking", icon: Sparkles, path: "/devotee/planner" },
        { name: "My Bookings", icon: CalendarCheck, path: "/devotee/my-bookings" },
      ]
    },
    {
      title: "Temple & Guidance",
      items: [
        { name: "Temple Navigation", icon: MapPinned, path: "/devotee/navigation" },
        { name: "Live Crowd Map", icon: Map, path: "/devotee/live-map" },
        { name: "Spiritual Guide", icon: BookOpen, path: "/devotee/spiritual-companion" },
        { name: "Festival Calendar", icon: CalendarDays, path: "/devotee/festival-calendar" },
      ]
    },
    {
      title: "Support",
      items: [
        { name: "Emergency SOS", icon: ShieldAlert, path: "/devotee/emergency-sos", className: "text-red-600 hover:bg-red-50" },
        { name: "Missing Person", icon: Users, path: "/devotee/missing-person" },
        { name: "Notifications", icon: Bell, path: "/devotee/notifications" },
        { name: "Profile Settings", icon: User, path: "/devotee/profile" },
      ]
    }
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/devotee/login");
}
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-amber-100 flex flex-col z-50 shadow-sm">
      <div className="p-6 border-b border-amber-100">
        <h1 className="text-2xl font-bold text-orange-800">Sugam Darshan</h1>
        <p className="text-sm text-slate-500">Devotee Dashboard</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all mb-1
                    ${isActive ? "bg-amber-100 text-orange-800 font-semibold" : "text-slate-600 hover:bg-slate-50"}
                    ${item.className || ""}
                  `}
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-amber-100 bg-slate-50">
        <div className="mb-4">
          <p className="font-semibold text-slate-800">{user?.name || "Devotee"}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email || "Welcome"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}