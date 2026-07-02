import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowLeft, Loader2, Lock, Mail, AlertTriangle, LogOut, LayoutDashboard } from "lucide-react";
import api from "../../services/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [roleMessage, setRoleMessage] = useState("");
  
  // Interceptor State for existing active session
  const [activeSessionUser, setActiveSessionUser] = useState(null);

  // Enforce session check on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    let user = null;
    
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        user = JSON.parse(storedUser);
      }
    } catch {
      localStorage.removeItem("user");
      user = null;
    }

    if (token && user?.role) {
      setActiveSessionUser(user);
    }
  }, []);

  const handleGlobalLogout = () => {
    localStorage.clear();
    setActiveSessionUser(null);
    setError("");
  };

  const handleGoToDashboard = () => {
    if (!activeSessionUser) return;
    const pathMap = {
      DEVOTEE: "/devotee/dashboard",
      AUTHORITY: "/authority/dashboard",
      ADMIN: "/admin/dashboard"
    };
    navigate(pathMap[activeSessionUser.role] || "/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/login", {
        ...formData,
        role: "ADMIN",
      });
      const data = response?.data;

      if (data && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        navigate("/admin/dashboard");
      } else {
        setError("Authentication failed. No access token received.");
      }
    } catch (err) {
      console.error(err);
      let errorMessage = "Authentication failed";

      if (err?.response?.data) {
        if (typeof err.response.data.detail === "string") {
          errorMessage = err.response.data.detail;
        } else if (typeof err.response.data.message === "string") {
          errorMessage = err.response.data.message;
        }
      }

      if (err?.response?.data?.redirect) {
        setRedirectPath(err.response.data.redirect);
        setRoleMessage(err.response.data.message);
        setShowRolePopup(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 selection:bg-amber-500/30 relative overflow-hidden">
      {/* Decorative subtle light beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Already Logged In Dialog Interceptor */}
      <AnimatePresence>
        {activeSessionUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Already Logged In</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                You are currently logged into an active account session as <span className="text-amber-500 font-semibold">{activeSessionUser.role}</span>.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={handleGlobalLogout}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-all"
                >
                  <LogOut size={16} />
                  Logout
                </button>
                <button
                  onClick={handleGoToDashboard}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold shadow-lg shadow-amber-950/50 transition-all"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

          {showRolePopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30"
            >
              <h3 className="text-amber-500 font-bold text-sm">Wrong Login Portal</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {roleMessage}
                <br />
                Please continue using your dedicated security interface.
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowRolePopup(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-all"
                >
                  Stay Here
                </button>
                <button
                  type="button"
                  onClick={() => navigate(redirectPath)}
                  className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all"
                >
                  Go To Login
                </button>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-600" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 pl-12 pr-4 py-3.5 rounded-2xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-700 text-sm"
                  placeholder="admin@temple.org"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-600" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 pl-12 pr-4 py-3.5 rounded-2xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-700 text-sm"
                  placeholder="••••••••"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs text-center font-medium">{error}</p>}

            <button
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white text-slate-950 font-bold hover:bg-amber-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
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