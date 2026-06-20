import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Trophy,
  Mail,
  MapPin,
} from "lucide-react";

import logo from "../../assets/images/logo.png";

export default function FooterSection() {
  const navigate = useNavigate();

  return (
    <footer id="contact" className="relative bg-slate-950 text-slate-100 pt-32 pb-12 overflow-hidden selection:bg-violet-500/30">
      {/* Premium Tech Grid Mesh Background Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      {/* Cyberpunk Dynamic Ambient Glow Components */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-12 right-1/4 w-[500px] h-[400px] bg-amber-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Call-to-Action Board — High Fidelity Command Module Look */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 md:p-12 shadow-2xl mb-24 group"
        >
          {/* Internal Premium Node Backlight */}
          <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Ready For A <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Smarter Darshan?</span>
              </h2>
              <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
                Take the guesswork out of your temple visit. Receive dynamic crowd timeline advice, schedule safe family timings, and plan an organized pilgrimage journey ahead of time.
              </p>
            </div>

            {/* Functional Navigational Buttons */}
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/devotee/login")}
                className="px-6 py-3.5 rounded-xl bg-white text-slate-950 text-sm font-bold shadow-lg transition-all"
              >
                Plan My Visit
              </motion.button>

              <motion.a
                href="#features"
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-200 text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer"
              >
                Explore Features
                <ArrowRight size={16} className="text-slate-400" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* High-Legibility Directory Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-slate-800/60">

          {/* Matrix Element 01: Brand Console */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Sugam Darshan" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="text-xl font-black tracking-tight text-white">Sugam Darshan</h3>
                <p className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase mt-1">Crowd Management System</p>
              </div>
            </div>
            
            <p className="mt-5 text-slate-400 text-sm leading-relaxed">
              An award-winning platform engineered to bring safety, clarity, and comfort to temple travel routines for families everywhere.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Trophy size={14} />
              National Hackathon Winner
            </div>
          </div>

          {/* Matrix Element 02: Platform Module Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-5">
              Platform Modules
            </h4>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><a href="#features" className="hover:text-violet-400 hover:underline underline-offset-4 transition-colors">Core Features</a></li>
              <li><a href="#forecasting" className="hover:text-violet-400 hover:underline underline-offset-4 transition-colors">Live Crowd Tracking</a></li>
              <li><a href="#booking" className="hover:text-violet-400 hover:underline underline-offset-4 transition-colors">Smart Entry Booking</a></li>
              <li><a href="#recommendations" className="hover:text-violet-400 hover:underline underline-offset-4 transition-colors">AI Route Planning</a></li>
            </ul>
          </div>

          {/* Matrix Element 03: Resource Portal */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-5">
              Resources
            </h4>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><a href="#temples" className="hover:text-violet-400 hover:underline underline-offset-4 transition-colors">Temple Information</a></li>
              <li><a href="#festivals" className="hover:text-violet-400 hover:underline underline-offset-4 transition-colors">Festival Calendar</a></li>
              <li><a href="#updates" className="hover:text-violet-400 hover:underline underline-offset-4 transition-colors">Security Guidelines</a></li>
              <li><a href="#support" className="hover:text-violet-400 hover:underline underline-offset-4 transition-colors">Devotee Support</a></li>
            </ul>
          </div>

          {/* Matrix Element 04: Communications Connectors */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-5">
              Communications
            </h4>
            <div className="space-y-4 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-violet-400 transition-colors">
                  <Mail size={16} />
                </div>
                <a href="mailto:contact@sugamdarshan.in" className="hover:text-white transition-colors">contact@sugamdarshan.in</a>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-violet-400 transition-colors">
                  <MapPin size={16} />
                </div>
                <span>Kanpur, Uttar Pradesh</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Status / Telemetry Stream */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 Sugam Darshan. All Rights Reserved.</p>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational // Protected Pilgrimage Initiative</span>
          </div>
        </div>

      </div>
    </footer>
  );
}