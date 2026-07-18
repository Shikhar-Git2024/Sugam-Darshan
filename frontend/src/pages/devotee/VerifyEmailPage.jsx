import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import api from "../../services/api";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check React Router memory state first; if empty, look into localStorage fallback
  const [email, setEmail] = useState(() => {
    if (location.state?.email) {
      localStorage.setItem("pending_verification_email", location.state.email);
      return location.state.email;
    }
    return localStorage.getItem("pending_verification_email") || "";
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // If there is absolutely no email trace context found anywhere, redirect back to register
  useEffect(() => {
    if (!email) {
      setError("No active verification session found. Redirecting...");
      setTimeout(() => navigate("/devotee/register"), 2000);
    }
  }, [email, navigate]);

  // Handle countdown tracking clock state pipeline
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.length !== 6 || /\D/.test(otp)) {
      setError("Please input a valid 6-digit numerical code.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/verify-email", { email, otp });
      if (response.data.success) {
        localStorage.removeItem("pending_verification_email");
        
        navigate("/devotee/login", {
          state: { successMsg: "Email verified successfully. Please login." }
        });
      } else {
        setError(response.data.message || "Invalid or expired OTP code.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Verification process unexpected disruption. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setError("");
    setMessage("");
    setResendLoading(true);

    try {
      const response = await api.post("/resend-email-otp", { email });
      if (response.data.success) {
        setMessage("OTP sent successfully.");
        setCountdown(30);
        setIsResendDisabled(true);
      } else {
        setError(response.data.message || "Failed to process target OTP transaction.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to process code delivery infrastructure safely at this time."
      );
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center p-4 md:p-6 relative overflow-hidden text-left antialiased selection:bg-orange-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3e3c3_1px,transparent_1px),linear-gradient(to_bottom,#f3e3c3_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-b from-orange-100/30 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-[#f3e3c3] rounded-[24px] p-6 md:p-8 shadow-md z-10 space-y-6"
      >
        <div className="w-full flex justify-start pb-4 border-b border-slate-50">
          <button
            type="button"
            onClick={() => navigate("/devotee/register")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#ea580c] bg-[#fffdf8] border border-[#f3e3c3] px-3.5 py-2 rounded-xl shadow-3xs cursor-pointer group transition border-0"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Register
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-950 tracking-tight m-0">
            Verify Your Email
          </h2>
          <p className="text-sm font-medium text-slate-700 m-0 pt-0.5 leading-relaxed">
            We've sent a 6-digit verification code to your registered email address. Enter the code below to verify your account.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-start gap-2">
            <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-0.5">
              Target Destination
            </label>
            <div className="relative border border-slate-200 rounded-xl bg-slate-50 px-3.5 py-3 flex items-center gap-3 select-none">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                readOnly
                value={email || "Locating verification stream..."}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-500 focus:outline-hidden cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-0.5">
              Enter 6-Digit OTP
            </label>
            <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-[#ea580c]">
              <ShieldCheck size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full border-0 bg-transparent p-0 text-sm font-black text-slate-900 tracking-widest placeholder-slate-300 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Verify button is now disabled unless exactly 6 digits are typed */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6 || !email}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-black tracking-widest uppercase border-0 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Validating Authenticator Code..." : "Verify OTP Code"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-50 flex flex-col items-center justify-center gap-2">
          {isResendDisabled ? (
            <p className="text-xs font-bold text-slate-400 m-0 uppercase tracking-wider">
              Resend OTP in <span className="text-slate-700 font-black">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              disabled={resendLoading || !email}
              onClick={handleResendOtp}
              className="text-xs font-black text-[#ea580c] hover:text-[#c2410c] hover:underline bg-transparent border-0 cursor-pointer p-0 m-0 uppercase tracking-wider disabled:opacity-40 transition"
            >
              {resendLoading ? "Transmitting..." : "Resend Verification Code"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}