import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import api from "../../services/api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/forgot-password", { email });
      setMessage("A password reset link has been sent to your email inbox.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "We couldn't find an account associated with that email address.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden text-slate-100 selection:bg-violet-500/30">
      {/* Background styling elements matching login page */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <button 
        onClick={() => navigate("/devotee/login")} 
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group z-20"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Login
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative"
      >
        <h2 className="text-2xl font-black text-white">Forgot Password</h2>
        <p className="text-slate-400 text-sm mt-1">Enter your registered email address below, and we will send you a link to reset your password.</p>

        {error && <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">{error}</div>}
        {message && <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">{message}</div>}

        <form onSubmit={handleReset} className="mt-6">
          <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" 
              placeholder="Enter your email address" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-lg transition-all"
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}