import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import api from "../../services/api";

export default function DevoteeRegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    // 1. Production Validation: Confirm Passwords Match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // 2. Production Validation: Enforce Terms Compliance
    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      // Stripping confirmPassword out of the final payload sent to backend API
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      await api.post("/register", payload);
      
      // Clean, professional success flash message passed via routing state
      navigate("/devotee/login", { 
        state: { successMsg: "Account created successfully. Please log in to continue." } 
      });
    } catch (err) {
      console.error(err);
      // Removed overly dramatic error messages
      setError(
        err?.response?.data?.detail || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-6 relative overflow-hidden text-slate-100 selection:bg-violet-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      
      <button 
        onClick={() => navigate("/devotee/login")} 
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors group z-20"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back To Login
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative"
      >
        <h2 className="text-3xl font-black tracking-tight text-white">Create Account</h2>
        <p className="text-slate-400 text-sm mt-1">Register your details to schedule slots and view crowd updates.</p>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                required 
                placeholder="Enter your full name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" 
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="email" 
                required 
                placeholder="Enter your email address" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" 
              />
            </div>
          </div>

          {/* Phone Number Input with 10-digit Validation */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Mobile Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="tel" 
                required 
                pattern="[0-9]{10}"
                maxLength="10"
                placeholder="Enter your 10-digit mobile number" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, "")})} 
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" 
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
              <span className="text-[11px] text-slate-500">Min. 8 characters</span>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="password" 
                required 
                minLength="8"
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" 
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" 
              />
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="pt-2 flex items-start gap-3">
            <input 
              type="checkbox" 
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-800 bg-slate-950 text-violet-600 focus:ring-violet-500/30 accent-violet-600 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-slate-400 leading-normal select-none cursor-pointer">
              I agree to the <a href="#terms" className="text-violet-400 hover:underline">Terms of Service</a> and <a href="#privacy" className="text-violet-400 hover:underline">Privacy Policy</a>.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-violet-950/40 hover:from-violet-500 transition-all disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}