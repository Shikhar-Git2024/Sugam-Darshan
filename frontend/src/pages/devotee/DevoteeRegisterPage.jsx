import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Phone, ArrowLeft, Eye, EyeOff, 
  AlertTriangle, CheckCircle2 
} from "lucide-react";
import api from "../../services/api";
import GoogleSignInButton from "../../components/GoogleSignInButton";

export default function DevoteeRegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccessfullyRegistered, setIsSuccessfullyRegistered] = useState(false);

  // Real-time password validations
  const hasMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isPasswordTyping = formData.password.length > 0;

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please provide a valid email address.");
      return;
    }

    if (formData.phone.length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setError("Password requirements are not satisfied.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      await api.post("/register", payload);
      setIsSuccessfullyRegistered(true);
      
      setTimeout(() => {
        navigate("/devotee/login", { 
          state: { successMsg: "Account created successfully. Please log in to continue." } 
        });
      }, 1500);

    } catch (err) {
      console.error("Registration Error:", err);
      setError(
        err?.response?.data?.detail || 
        err?.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      if (!isSuccessfullyRegistered) setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center p-4 md:p-6 relative overflow-hidden text-left antialiased selection:bg-orange-100">
      
      {/* Devotional Warm Ambient Background Assets */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3e3c3_1px,transparent_1px),linear-gradient(to_bottom,#f3e3c3_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-b from-orange-100/30 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[30rem] h-[40rem] bg-gradient-to-tr from-amber-100/40 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Success Animation Interstitial Overlay */}
      <AnimatePresence>
        {isSuccessfullyRegistered && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-white border border-[#f3e3c3] p-8 rounded-2xl shadow-xl text-center space-y-4"
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-3xs">
                <CheckCircle2 size={28} className="animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-950 m-0 tracking-tight">Account Created</h3>
                <p className="text-sm font-semibold text-slate-600 leading-relaxed m-0 pt-1">
                  Redirecting you to login...
                </p>
              </div>
              <div className="pt-2 flex justify-center">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            Create Your Devotee Account
          </h2>
          <p className="text-sm font-medium text-slate-700 m-0 pt-0.5">
            Complete the details below to begin your Sugam Darshan journey.
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

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-0.5">
              Full Name
            </label>
            <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-[#ea580c]">
              <User size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-0.5">
              Email Address
            </label>
            <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-[#ea580c]">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Mobile Number Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-0.5">
              Mobile Number
            </label>
            <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-[#ea580c]">
              <Phone size={16} className="text-slate-400 shrink-0" />
              <input
                type="tel"
                required
                maxLength="10"
                placeholder="Enter your 10-digit mobile number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-0.5">
              Password
            </label>
            <div className="relative border border-[#f3e3c3] rounded-xl bg-[#fffdf8] px-3.5 py-3 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-[#ea580c]">
              <Lock size={16} className="text-slate-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer p-0"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Validation Checklist */}
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
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer p-0"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms Compliance Checkbox */}
          <div className="flex items-start gap-2.5 px-0.5 pt-1">
            <input 
              type="checkbox" 
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[#f3e3c3] bg-[#fffdf8] text-[#ea580c] focus:ring-[#ea580c]/20 accent-[#ea580c] cursor-pointer"
            />
            <label htmlFor="agreeToTerms" className="text-xs font-semibold text-slate-600 select-none cursor-pointer leading-normal">
              I agree to the <a href="#terms" className="text-[#ea580c] hover:underline font-bold">Terms of Service</a> and <a href="#privacy" className="text-[#ea580c] hover:underline font-bold">Privacy Policy</a>.
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-black tracking-widest uppercase border-0 shadow-sm hover:shadow-orange-200 transition-all cursor-pointer active:scale-[0.995] disabled:opacity-50"
          >
            {loading ? "Creating your profile..." : "Create Account"}
          </button>

          {/* Multi-Auth Separator Layout */}
          <div className="flex items-center py-1">
            <div className="flex-1 border-t border-slate-100"></div>
            <span className="mx-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Or Continue With</span>
            <div className="flex-1 border-t border-slate-100"></div>
          </div>

          {/* Google Identity Integration */}
          <div className="pt-1 w-full">
            <GoogleSignInButton text="Sign up with Google" />
          </div>

          {/* Redirection Text Link Footer */}
          <div className="text-center pt-2">
            <p className="text-sm font-medium text-slate-600 m-0">
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => navigate("/devotee/login")} 
                className="font-bold text-[#ea580c] hover:text-[#c2410c] hover:underline bg-transparent border-0 cursor-pointer outline-hidden p-0 transition"
              >
                Sign In here
              </button>
            </p>
          </div>
        </form>

        {/* Secure System Bottom Operational Anchor */}
        <div className="w-full flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 select-none uppercase tracking-wider pt-4 border-t border-slate-50">
          <Lock size={10} />
          <span>Secure Registration • Sugam Darshan © 2026</span>
        </div>
      </motion.div>
    </div>
  );
}