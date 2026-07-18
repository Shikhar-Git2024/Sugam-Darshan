import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertTriangle, KeyRound } from "lucide-react";
import api from "../../services/api";

export default function DevoteeResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Real-time security state metrics
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordTyping = password.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setError("Please ensure your password satisfies all security parameters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/reset-password", {
        token,
        new_password: password,
      });

      setSuccess(
        res?.data?.message || "Your password has been updated successfully."
      );

      setTimeout(() => {
        navigate("/devotee/login");
      }, 2000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Unable to reset password. The security token may be invalid or expired."
      );
    } finally {
      if (loading) setLoading(false);
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

        {/* Main Header Context */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-950 tracking-tight m-0">
            Create a New Password
          </h2>
          <p className="text-sm font-medium text-slate-700 m-0 pt-0.5">
            Enter a strong password to secure your Sugam Darshan account.
          </p>
        </div>

        {/* Improvement: If target verification link fails or expires, display a structured recovery button */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex flex-col items-start gap-2"
          >
            <div className="flex items-start gap-2 w-full">
              <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
              <span className="flex-1">
                {error.toLowerCase().includes("expired") || error.toLowerCase().includes("token")
                  ? "This password reset link has expired or is invalid."
                  : error}
              </span>
            </div>
            
            {(error.toLowerCase().includes("expired") || error.toLowerCase().includes("token")) && (
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="mt-1 ml-6 inline-flex items-center gap-1 text-xs font-black text-[#ea580c] hover:text-[#c2410c] hover:underline bg-transparent border-0 p-0 cursor-pointer uppercase tracking-wider transition"
              >
                <KeyRound size={13} />
                Request a new password reset email
              </button>
            )}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-start gap-2"
          >
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="m-0 font-bold">{success}</p>
              <p className="m-0 text-slate-500 text-[11px] font-medium">Redirecting you to the sign in page...</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-0.5">
              New Password
            </label>
            <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-[#ea580c]">
              <Lock size={16} className="text-slate-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                disabled={!!success || (error.toLowerCase().includes("expired") || error.toLowerCase().includes("token"))}
                required
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!!success || (error.toLowerCase().includes("expired") || error.toLowerCase().includes("token"))}
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer p-0 disabled:opacity-30"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Secure Criteria Metric Checker */}
            {isPasswordTyping && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] font-bold"
              >
                <div className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-600" : "text-slate-400"}`}>
                  <span>{hasMinLength ? "✓" : "•"} 8+ Characters</span>
                </div>
                <div className={`flex items-center gap-1 ${hasUppercase ? "text-emerald-600" : "text-slate-400"}`}>
                  <span>{hasUppercase ? "✓" : "•"} 1 Uppercase</span>
                </div>
                <div className={`flex items-center gap-1 ${hasNumber ? "text-emerald-600" : "text-slate-400"}`}>
                  <span>{hasNumber ? "✓" : "•"} 1 Number</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-0.5">
              Confirm Password
            </label>
            <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-[#ea580c]">
              <Lock size={16} className="text-slate-400 shrink-0" />
              <input
                type={showConfirm ? "text" : "password"}
                disabled={!!success || (error.toLowerCase().includes("expired") || error.toLowerCase().includes("token"))}
                required
                placeholder="Verify your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!!success || (error.toLowerCase().includes("expired") || error.toLowerCase().includes("token"))}
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer p-0 disabled:opacity-30"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Form Controls Button */}
          <button
            type="submit"
            disabled={loading || !!success || (error.toLowerCase().includes("expired") || error.toLowerCase().includes("token"))}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-black tracking-widest uppercase border-0 shadow-sm hover:shadow-orange-200 transition-all cursor-pointer active:scale-[0.995] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </form>

        {/* Secure System Bottom Operational Anchor */}
        <div className="w-full flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 select-none uppercase tracking-wider pt-4 border-t border-slate-50">
          <Lock size={10} />
          <span>Secure Credentials Dashboard • Sugam Darshan © 2026</span>
        </div>
      </motion.div>
    </div>
  );
}