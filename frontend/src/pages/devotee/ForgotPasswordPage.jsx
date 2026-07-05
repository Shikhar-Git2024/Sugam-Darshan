import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import api from "../../services/api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSentSuccessfully, setIsSentSuccessfully] = useState(false);
  const [error, setError] = useState("");

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/forgot-password", { email });
      setIsSentSuccessfully(true);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail || 
        "No account was found with this email address. Please check your email or create a new account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center p-4 md:p-6 relative overflow-hidden text-left antialiased selection:bg-orange-100">
      
      {/* Devotional Warm Ambient Background Assets */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3e3c3_1px,transparent_1px),linear-gradient(to_bottom,#f3e3c3_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-b from-orange-100/30 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[30rem] h-[40rem] bg-gradient-to-tr from-amber-100/40 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Clean Single Canvas Account Content Block */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white/80 border border-[#f3e3c3] backdrop-blur-md rounded-[24px] p-6 md:p-10 shadow-md z-10 space-y-6"
      >
        {/* Top Utility Row */}
        <div className="w-full flex justify-end pb-4 border-b border-slate-50">
          <button 
            type="button"
            onClick={() => navigate("/devotee/login")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#ea580c] bg-[#fffdf8] border border-[#f3e3c3] px-3.5 py-2 rounded-xl shadow-3xs cursor-pointer group transition border-0"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Back To Login
          </button>
        </div>

        {/* Crossfading AnimatePresence Module for Premium Form / Success States */}
        <div className="w-full py-2">
          <AnimatePresence mode="wait">
            {!isSentSuccessfully ? (
              <motion.div
                key="forgot-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight m-0">
                    Forgot Your Password?
                  </h2>
                  <p className="text-sm font-medium text-slate-700 m-0 pt-0.5">
                    Enter your registered email address and we'll send you a secure password reset link.
                  </p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-start gap-2"
                  >
                    <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleReset} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-0.5">
                      Email Address
                    </label>
                    <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-[#ea580c]">
                      <Mail size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold block px-0.5">
                      Only registered email addresses can receive a password reset link.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-black tracking-widest uppercase border-0 shadow-sm hover:shadow-orange-200 transition-all cursor-pointer active:scale-[0.995] disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Reset Email"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-[#fffdf8] border border-emerald-100 rounded-2xl p-6 text-center space-y-4 shadow-3xs"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={24} className="animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-950 tracking-tight m-0">Reset Link Sent</h3>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed pt-1 m-0">
                    We've sent a password reset link to <span className="text-slate-950 font-bold break-all">{email}</span>.
                  </p>
                </div>

                <p className="text-xs text-slate-500 font-medium bg-white border border-slate-100 p-2.5 rounded-xl leading-normal m-0">
                  Please check your inbox and spam folder. The link will expire shortly for security compliance.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/devotee/login")}
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-black tracking-wider uppercase border-0 shadow-xs transition cursor-pointer"
                >
                  Return To Sign In
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Secure System Bottom Operational Anchor */}
        <div className="w-full flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 select-none uppercase tracking-wider pt-4 border-t border-slate-50">
          <Lock size={10} />
          <span>Secure Verification Gateway • Sugam Darshan © 2026</span>
        </div>
      </motion.div>
    </div>
  );
}