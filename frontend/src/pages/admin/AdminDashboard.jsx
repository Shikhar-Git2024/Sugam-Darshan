import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CalendarCheck, ShieldCheck, Activity, UserCog, ArrowRight, BookOpen, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_users: 0, total_bookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const res = await api.get("/admin/stats");
      setStats({ total_users: res.data.total_users || 0, total_bookings: res.data.total_bookings || 0 });
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with entrance animation */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Admin Command Center</h1>
          <p className="text-slate-500 mt-2 text-lg">System oversight for temple operations</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Devotees" value={stats.total_users} icon={<Users size={22}/>} color="bg-indigo-50 text-indigo-600" />
          <StatCard title="Total Bookings" value={stats.total_bookings} icon={<CalendarCheck size={22}/>} color="bg-emerald-50 text-emerald-600" />
          <StatCard title="System Status" value="Online" icon={<Activity size={22}/>} color="bg-sky-50 text-sky-600" />
          <StatCard title="Authorities" value="Active" icon={<ShieldCheck size={22}/>} color="bg-amber-50 text-amber-600" />
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-amber-500 rounded-full"></span> Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard icon={<UserCog />} title="Authority Management" desc="Configure permissions and roles" onClick={() => navigate("/admin/authority-management")} />
            <ActionCard icon={<UserPlus />} title="User Directory" desc="Manage devotees and accounts" onClick={() => navigate("/admin/users")} />
            <ActionCard icon={<BookOpen />} title="Booking Overview" desc="Track darshan activities" onClick={() => navigate("/admin/bookings")} />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <motion.div 
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${color}`}>
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
    </motion.div>
  );
}

function ActionCard({ icon, title, desc, onClick }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-left hover:border-amber-200 transition-all group"
    >
      <div className="text-slate-400 group-hover:text-amber-500 transition-colors mb-4">{icon}</div>
      <h3 className="font-bold text-lg text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm mt-2 mb-6">{desc}</p>
      <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm">
        Proceed <ArrowRight size={16} />
      </div>
    </motion.button>
  );
}