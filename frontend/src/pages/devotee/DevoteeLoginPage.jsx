import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, Eye, EyeOff, ArrowLeft, AlertTriangle, LogOut, LayoutDashboard, 
  Sparkles, Users, CalendarDays, Compass, ShieldCheck, ShieldAlert, 
  Map, Sun, Bell, Volume2, Cloud, HelpCircle, FileText, CheckCircle2, 
  Award, QrCode, PhoneCall, HeartPulse, User, UserX, Printer, Share2, Globe, Flame, ShieldEllipsis
} from "lucide-react";
import api from "../../services/api";
import GoogleSignInButton from "../../components/GoogleSignInButton";

import logoAsset from "../../assets/images/logo.png";

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
  const [activeSessionUser, setActiveSessionUser] = useState(null);

  const registerSuccessMessage = location.state?.successMsg;

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    let user = null;

    try {
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        user = JSON.parse(storedUser);
      }
    } catch {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      user = null;
    }

    if (token && user?.role) {
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

  // Gracefully handles routing unverified users instantly to verification workspace
  const handleRoutingToVerification = () => {
    if (!email) return;
    localStorage.setItem("pending_verification_email", email);
    navigate("/devotee/verify-email", { state: { email } });
  };

  const handleLogin = async (e) => {
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
        setError("Unable to sign in. Please check your credentials and try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      let errorMessage = "Unable to sign in. Please check your email address and password.";

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
    <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center p-4 md:p-6 relative overflow-hidden text-left antialiased selection:bg-orange-100">
      
      {/* Devotional Warm Ambient Background Assets */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3e3c3_1px,transparent_1px),linear-gradient(to_bottom,#f3e3c3_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-b from-orange-100/30 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[30rem] h-[40rem] bg-gradient-to-tr from-amber-100/40 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Session Interceptor Dialog Modal */}
      <AnimatePresence>
        {activeSessionUser && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-md bg-white border border-[#f3e3c3] p-6 rounded-2xl shadow-xl text-center space-y-4"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 text-[#ea580c] border border-orange-100 flex items-center justify-center shadow-3xs">
                <AlertTriangle size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-950 m-0 tracking-tight">Already Logged In</h3>
                <p className="text-sm font-semibold text-slate-600 leading-relaxed m-0 pt-1">
                  You are currently logged into an active session as a <span className="text-[#ea580c] font-black">{activeSessionUser.role}</span>.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleGlobalLogout}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition cursor-pointer"
                >
                  <LogOut size={14} />
                  Logout
                </button>
                <button
                  onClick={handleGoToDashboard}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-black border-0 shadow-xs transition cursor-pointer"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Central Login Canvas Architecture Block */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-white/80 border border-[#f3e3c3] backdrop-blur-md rounded-[24px] overflow-hidden shadow-md grid lg:grid-cols-12 min-h-[640px] z-10"
      >
        {/* Left Side Content Segment (Spiritual Branding Block) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#fffdf8] via-[#fff9f2] to-[#fff1e5] p-8 md:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#f3e3c3]/60 text-left overflow-y-auto max-h-[750px] lg:max-h-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,88,12,0.03),transparent_50%)] pointer-events-none" />
          
          <div className="space-y-6 relative z-10 w-full">
            {/* Horizontal Branding Layout with Expanded Free-Floating Logo */}
            <div className="flex items-center gap-4">
              <img 
                src={logoAsset} 
                alt="Sugam Darshan" 
                className="w-20 h-20 md:w-24 md:h-24 object-contain shrink-0 filter drop-shadow-[0_4px_8px_rgba(234,88,12,0.08)]"
              />
              <div className="space-y-0.5 min-w-0">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-950 m-0 leading-tight">
                  Sugam Darshan
                </h1>
                <p className="text-xs md:text-sm font-bold text-[#ea580c] m-0 tracking-wide">
                  Your Digital Companion
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 m-0">
                  Established 2026
                </p>
              </div>
            </div>

            {/* Direct Context Core Description */}
            <p className="text-sm font-medium text-slate-700 leading-relaxed m-0 pt-1">
              Sign in to access your bookings, live crowd information, travel guidance, and personalized darshan services.
            </p>

            {/* Comprehensive Platform Capability Registry Matrix */}
            <div className="grid grid-cols-1 gap-y-2.5 pt-2 border-t border-amber-100">
              {[
                { label: "Smart Visit Planning", icon: Sparkles },
                { label: "Live Crowd Updates", icon: Users },
                { label: "Temple Navigation", icon: Compass },
                { label: "Emergency Assistance", icon: ShieldCheck },
                { label: "Real-Time Push Alerts", icon: Bell },
                { label: "Localized Weather Tracker", icon: Cloud },
                { label: "Instant Emergency SOS", icon: ShieldAlert },
                { label: "Multilingual System Controls", icon: Globe },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                  <f.icon size={14} className="text-[#ea580c] shrink-0" />
                  <span className="truncate">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Balanced Stats Pill Row and Inspirational Quote */}
          <div className="mt-8 pt-4 border-t border-amber-200/50 relative z-10 space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-extrabold tracking-tight text-slate-600">
              <div className="bg-white/40 border border-amber-200/40 rounded-lg py-1.5 px-1 truncate">24×7 Support</div>
              <div className="bg-white/40 border border-amber-200/40 rounded-lg py-1.5 px-1 truncate">Live Updates</div>
              <div className="bg-white/40 border border-amber-200/40 rounded-lg py-1.5 px-1 truncate">Secure Booking</div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/50 border border-amber-200/40 px-2.5 py-0.5 rounded-full">
                ✨ AI Powered Temple Experience
              </div>
              <p className="text-xs font-medium italic text-slate-500 m-0 leading-relaxed">
                "May your journey to Shri Ram Mandir be peaceful, comfortable, and spiritually fulfilling."
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Content Segment (Intake Form Interactive Column) */}
        <div className="lg:col-span-7 p-6 md:p-10 flex flex-col justify-between bg-white relative text-left">
          
          {/* Form Context Top Utility Header Row */}
          <div className="w-full flex justify-end pb-4 border-b border-slate-50">
            <button 
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#ea580c] bg-[#fffdf8] border border-[#f3e3c3] px-3.5 py-2 rounded-xl shadow-3xs cursor-pointer group transition border-0"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              Back To Home
            </button>
          </div>

          <form onSubmit={handleLogin} className="w-full max-w-md mx-auto space-y-5 py-6 flex-1 flex flex-col justify-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight m-0">
                Welcome Back
              </h2>
              <p className="text-sm font-medium text-slate-700 m-0 pt-0.5">
                Sign in to continue your Sugam Darshan journey.
              </p>
            </div>

            {registerSuccessMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>{registerSuccessMessage}</span>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex flex-col items-start gap-2"
              >
                <div className="flex items-start gap-2 w-full">
                  <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
                  <span className="flex-1">{error}</span>
                </div>
                
                {/* Improvement: Appends contextual action button upon encountering email restriction error block */}
                {error.includes("verify your email") && (
                  <button
                    type="button"
                    onClick={handleRoutingToVerification}
                    className="mt-1 ml-6 inline-flex items-center gap-1 text-xs font-black text-[#ea580c] hover:text-[#c2410c] hover:underline bg-transparent border-0 p-0 cursor-pointer uppercase tracking-wider transition"
                  >
                    <ShieldEllipsis size={13} />
                    Verify Email Now
                  </button>
                )}
              </motion.div>
            )}

            {showRolePopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3"
              >
                <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
                  <AlertTriangle size={15} className="text-amber-600" />
                  Wrong Login Portal
                </div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed m-0">
                  {roleMessage} Please use the dedicated management portal link to proceed safely.
                </p>
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowRolePopup(false)}
                    className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Stay Here
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(redirectPath)}
                    className="flex-1 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black rounded-lg transition border-0 cursor-pointer shadow-3xs"
                  >
                    Go To Login
                  </button>
                </div>
              </motion.div>
            )}

            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-0.5">
                  Email Address
                </label>
                <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-[#ea580c]">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] hover:underline bg-transparent border-0 cursor-pointer outline-hidden p-0 transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-[#ea580c]">
                  <Lock size={16} className="text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer p-0"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-0.5">
              <input 
                type="checkbox" 
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#f3e3c3] bg-[#fffdf8] text-[#ea580c] focus:ring-[#ea580c]/20 accent-[#ea580c] cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm font-semibold text-slate-600 select-none cursor-pointer">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-black tracking-widest uppercase border-0 shadow-sm hover:shadow-orange-200 transition-all cursor-pointer active:scale-[0.995]"
            >
              {loading ? "Signing you in..." : "Sign In"}
            </button>

            <div className="flex items-center py-1">
              <div className="flex-1 border-t border-slate-100"></div>
              <span className="mx-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Or Continue With</span>
              <div className="flex-1 border-t border-slate-100"></div>
            </div>

            <div className="pt-1 w-full">
              <GoogleSignInButton text="Continue with Google" />
            </div>

            <div className="text-center pt-2 space-y-3">
              <p className="text-sm font-medium text-slate-600 m-0">
                Don't have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => navigate("/devotee/register")} 
                  className="font-bold text-[#ea580c] hover:text-[#c2410c] hover:underline bg-transparent border-0 cursor-pointer outline-hidden p-0 transition"
                >
                  Create a new devotee account
                </button>
              </p>
            </div>
          </form>

          {/* Fixed Bottom Operational Brand Line */}
          <div className="w-full flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 select-none uppercase tracking-wider pt-4 border-t border-slate-50">
            <Lock size={10} />
            <span>Secure Authentication • Sugam Darshan © 2026</span>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}