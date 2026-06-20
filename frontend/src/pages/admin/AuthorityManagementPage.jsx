import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, User, Search, Mail, CheckCircle2, Crown, UserPlus, Loader2 } from "lucide-react";
import api from "../../services/api";

export default function AuthorityManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promotingId, setPromotingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    try {
      const response = await api.get("/dashboard/users");
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  }

  async function promoteUser(userId) {
    try {
      setPromotingId(userId);
      await api.post(`/admin/create-authority/${userId}`);
      await loadUsers();
    } catch (error) { alert(error?.response?.data?.detail || "Failed to promote user"); }
    finally { setPromotingId(null); }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">Authority Management</h1>
          <p className="text-slate-500 mt-2">Manage administrative access and roles for the temple system.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Users" value={users.length} icon={<User size={20}/>} color="bg-indigo-50 text-indigo-600" />
          <StatCard title="Authorities" value={users.filter(u => u.role === "AUTHORITY").length} icon={<ShieldCheck size={20}/>} color="bg-emerald-50 text-emerald-600" />
          <StatCard title="Devotees" value={users.filter(u => u.role === "DEVOTEE").length} icon={<Crown size={20}/>} color="bg-amber-50 text-amber-600" />
        </div>

        {/* Search & Directory */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">User Directory</h2>
            <div className="relative w-72">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name/email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {user.name?.[0]}
                      </div>
                      <span className="font-semibold text-slate-800">{user.name}</span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'AUTHORITY' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.role === "AUTHORITY" ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                          <CheckCircle2 size={16} /> Verified
                        </span>
                      ) : (
                        <button 
                          onClick={() => promoteUser(user.id)}
                          disabled={promotingId === user.id}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                        >
                          {promotingId === user.id ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                          {promotingId === user.id ? "Promoting" : "Promote"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  );
}