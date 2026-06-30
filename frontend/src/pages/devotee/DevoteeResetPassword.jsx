
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/reset-password", {
        token,
        new_password: password,
      });

      setSuccess(
        res?.data?.message || "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/devotee/login");
      }, 2000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full" />

      <button
        onClick={() => navigate("/devotee/login")}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white"
      >
        <ArrowLeft size={16}/> Back to Login
      </button>

      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className="w-full max-w-md bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-xl p-8"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          Reset Password
        </h1>

        <p className="text-slate-400 text-sm text-center mt-2">
          Enter your new password.
        </p>

        {error && (
          <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
            <CheckCircle2 size={18}/>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/>
            <input
              type={showPassword ? "text":"password"}
              placeholder="New Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
            <button type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/>
            <input
              type={showConfirm ? "text":"password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
            <button type="button"
              onClick={()=>setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>

          <motion.button
            whileHover={{scale:1.01}}
            whileTap={{scale:0.99}}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
}
