import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, AlertTriangle, LogOut, LayoutDashboard } from "lucide-react";
import api from "../../services/api";

export default function AuthorityLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [roleMessage, setRoleMessage] = useState("");
  
  // Interceptor State for existing active session
  const [activeSessionUser, setActiveSessionUser] = useState(null);

  // Enforce structural session check on mount
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

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", {
        email,
        password,
        role: "AUTHORITY",
      });

      const data = response?.data;

      if (data && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        navigate("/authority/dashboard");
      } else {
        setError("Authentication failed. No access token received.");
      }

    } catch (err) {
      console.error(err);
      let errorMessage = "Invalid credentials";

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
    } opacity: {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-600/10 blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[180px]" />

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
              <div className="mx-auto w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Already Logged In</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                You are currently logged into an active account session as <span className="text-violet-400 font-semibold">{activeSessionUser.role}</span>.
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
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-950/50 transition-all"
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 mx-auto flex items-center justify-center">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-5">Authority Portal</h1>
          <p className="text-slate-400 mt-2">Restricted Administrative Access</p>
        </div>

        {/* Security Notice */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex gap-3">
          <AlertTriangle size={20} className="text-red-400 shrink-0" />
          <p className="text-red-300 text-sm">
            Authorized personnel only. All login attempts are monitored and recorded.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5 text-red-300 text-sm">
            {error}
          </div>
        )}

        {showRolePopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30"
          >
            <h3 className="text-amber-400 font-bold text-sm">Wrong Login Portal</h3>
            <p className="mt-2 text-sm text-slate-300">
              {roleMessage}
              <br />
              Please use the explicit portal landing system.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowRolePopup(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-all"
              >
                Stay Here
              </button>
              <button
                type="button"
                onClick={() => navigate(redirectPath)}
                className="flex-1 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all"
              >
                Go To Login
              </button>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-slate-400 text-sm">Authority Email</label>
            <div className="relative mt-2">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-violet-500"
                placeholder="authority@rammandir.org"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-slate-400 text-sm">Password</label>
            <div className="relative mt-2">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-violet-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:shadow-xl hover:shadow-violet-600/30 transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Access Command Center"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}