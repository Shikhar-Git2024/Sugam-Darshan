import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../../services/api";

export default function DevoteeLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerSuccessMessage = location.state?.successMsg;

  // SAFEGUARD: Only redirect if a valid token exists (checking for "undefined" strings)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      navigate("/devotee/dashboard", { replace: true });
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { email, password });
      const data = response?.data;

      // VALIDATION: Ensure the backend actually sent a token back before proceeding
      if (data && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        navigate("/devotee/dashboard");
      } else {
        // If the server responded with a 200 OK but no token, handle it safely
        setError("Authentication failed. No access token received.");
      }

    } catch (err) {
      console.error("Login Error Catch:", err);
      
      // DEFENSIVE EXTRACTION: Safely extract error message to prevent React crashes
      let errorMessage = "Invalid Email or Password";
      
      if (err?.response?.data) {
        if (typeof err.response.data.detail === "string") {
          errorMessage = err.response.data.detail;
        } else if (typeof err.response.data.message === "string") {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = typeof err.response.data.error === "string" 
            ? err.response.data.error 
            : JSON.stringify(err.response.data.error);
        }
      }
      
      setError(errorMessage);
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