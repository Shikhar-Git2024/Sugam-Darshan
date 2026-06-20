import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import api from "../../services/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 selection:bg-amber-500/30">
      {/* Decorative subtle light beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[420px]"
      >
        {/* Back Link */}
        <button 
          onClick={() => navigate("/")}
          className="group absolute -top-16 left-0 flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors duration-300"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium tracking-wide">Back to Portal</span>
        </button>

        {/* Main Card */}
        <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 p-10 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="mx-auto h-16 w-16 mb-6 rounded-3xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50 shadow-inner">
              <ShieldCheck className="text-amber-500" size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-light text-white tracking-widest uppercase">Administration</h1>
            <p className="text-slate-500 text-sm mt-1">Authorized access only</p>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              const { data } = await api.post("/login", formData);
              localStorage.setItem("token", data.access_token);
              navigate("/admin/dashboard");
            } catch { setError("Authentication failed"); }
            finally { setLoading(false); }
          }} className="space-y-6">
            
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-600" size={18} />
                <input 
                  type="email" 
                  className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 pl-12 pr-4 py-3.5 rounded-2xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-700"
                  placeholder="admin@temple.org"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-600" size={18} />
                <input 
                  type="password" 
                  className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 pl-12 pr-4 py-3.5 rounded-2xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white text-slate-950 font-bold hover:bg-amber-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-slate-700 text-[10px] uppercase tracking-[0.2em] mt-8">
          System managed by temple authority
        </p>
      </motion.div>
    </div>
  );
}