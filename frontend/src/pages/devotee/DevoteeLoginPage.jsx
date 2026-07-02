import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertTriangle, LogOut, LayoutDashboard } from "lucide-react";
import api from "../../services/api";
import GoogleSignInButton from "../../components/GoogleSignInButton";

export default function DevoteeLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [roleMessage, setRoleMessage] = useState("");
  
  // Interceptor State for existing active session
  const [activeSessionUser, setActiveSessionUser] = useState(null);

  const registerSuccessMessage = location.state?.successMsg;

  // Enforce session check on mount - handles potential crashes elegantly
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    let user = null;

    try {
      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        user = JSON.parse(storedUser);
      }
    } catch {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      user = null;
    }

    if (token && user?.role) {
      // Intercept and show user they are already logged in
      setActiveSessionUser(user);
    }
  }, []);

  const handleGlobalLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
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
        role: "DEVOTEE",
      });

      const data = response?.data;

      if (data && data.access_token) {

        if (rememberMe) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user", JSON.stringify(data.user || {}));
        } else {
          sessionStorage.setItem("token", data.access_token);
          sessionStorage.setItem("user", JSON.stringify(data.user || {}));
        }

        navigate("/devotee/dashboard");

      } else {

        setError("Authentication failed. No access token received.");

      }

    } catch (err) {

      console.error("Login Error Catch:", err);

      let errorMessage = "Invalid Email or Password";

      if (err?.response?.data) {

        if (typeof err.response.data.detail === "string") {

          errorMessage = err.response.data.detail;

        } else if (typeof err.response.data.message === "string") {

          errorMessage = err.response.data.message;

        } else if (err.response.data.error) {

          errorMessage =
            typeof err.response.data.error === "string"
              ? err.response.data.error
              : JSON.stringify(err.response.data.error);

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

  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-6 relative overflow-hidden selection:bg-violet-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

      <button 
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors group z-20"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back To Home
      </button>

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-2xl grid lg:grid-cols-12 min-h-[640px]"
      >
        <div className="lg:col-span-5 bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-950 p-8 md:p-12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-slate-800/60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
          
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-mono font-bold tracking-wider uppercase mb-8">
              Secured Access
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-none">
              Smart Darshan <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-200">Platform</span>
            </h1>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Plan your visit, monitor crowd levels, receive recommendations and enjoy a smoother darshan experience.
            </p>
          </div>

          <div className="mt-12 space-y-3.5">
            {[
              "AI-Powered Visit Planning",
              "Live Crowd Monitoring",
              "Smart Slot Booking",
              "Real-Time Temple Updates"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-medium text-slate-300">
                <CheckCircle2 size={16} className="text-violet-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 p-8 md:p-12 flex items-center bg-slate-900/20">
          <form onSubmit={handleLogin} className="w-full max-w-md mx-auto">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Devotee Login
              </h2>
              <p className="mt-1.5 text-slate-400 text-sm">
                Sign in to manage your bookings and personalized darshan recommendations.
              </p>
            </div>

            {registerSuccessMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
              >
                {registerSuccessMessage}
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            {showRolePopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30"
              >
                <h3 className="text-amber-400 font-bold text-sm">
                  Wrong Login Portal
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  {roleMessage}
                  <br />
                  Please continue using the correct login page.
                </p>
                <div className="flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => setShowRolePopup(false)}
                    className="flex-1 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-all"
                  >
                    Stay Here
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(redirectPath)}
                    className="flex-1 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all"
                  >
                    Go To Login
                  </button>
                </div>
              </motion.div>
            )}

            <div className="mt-8 space-y-5">
              <div>
                <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-medium text-violet-400 hover:text-violet-300 hover:underline bg-transparent border-none cursor-pointer outline-none transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-violet-600 focus:ring-violet-500/30 accent-violet-600 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-400 select-none cursor-pointer">
                Remember Me
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-950/50 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Signing In..." : "Login"}
            </motion.button>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-slate-700"></div>

              <span className="mx-3 text-xs text-slate-500">
                OR
              </span>

              <div className="flex-1 border-t border-slate-700"></div>
            </div>

            <GoogleSignInButton />

            <p className="mt-6 text-center text-xs text-slate-400">
              New to the platform?{" "}
              <button 
                type="button" 
                onClick={() => navigate("/devotee/register")} 
                className="font-bold text-violet-400 hover:text-violet-300 hover:underline bg-transparent border-none cursor-pointer outline-none transition-colors"
              >
                Create Account
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}