import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import { Users, Shield, ArrowRight, Lock } from "lucide-react";



export default function RoleAccessSection() {

  const navigate = useNavigate();



  // Added Admin Portal to the portals array
  const portals = [

    {

      title: "Devotee Portal",

      icon: Users,

      description:

        "Book your peaceful darshan slots, view crowd timing guidelines, and coordinate a comfortable temple trip for your family.",

      badge: "For Families & Visitors",

      accentColor: "text-violet-400 border-violet-500/20 bg-violet-500/10",

      glow: "bg-violet-600/10",

      path: "/devotee/login",

    },

    {

      title: "Authority Portal",

      icon: Shield,

      description:

        "Monitor live temple complex density numbers, oversee crowd line patterns, and maintain public safety checks in real time.",

      badge: "For Temple Management",

      accentColor: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",

      glow: "bg-emerald-600/10",

      path: "/authority/login",

    },
    
    {

      title: "Admin Portal",

      icon: Lock,

      description:

        "Manage system configurations, user roles, security protocols, and overall platform administration settings.",

      badge: "For Super Admins",

      accentColor: "text-rose-400 border-rose-500/20 bg-rose-500/10",

      glow: "bg-rose-600/10",

      path: "/admin/login",

    },

  ];



  return (

    <section id="platform-access" className="relative py-32 overflow-hidden bg-slate-950 text-slate-100 selection:bg-violet-500/30">

      {/* Premium Tech Grid Mesh Background Layer */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />



      {/* Dynamic Ambient Glow Component */}

      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 blur-[180px] rounded-full pointer-events-none" />



      <div className="relative max-w-5xl mx-auto px-6">



        {/* Header Bar with Fully Readable Typography */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.6 }}

          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 border-b border-slate-800/60 pb-10"

        >

          <div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">

              Dedicated <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Access Portals</span>

            </h2>

            <p className="mt-4 text-slate-400 max-w-xl text-base md:text-lg leading-relaxed">

              Custom tools designed to provide a completely safe and organized experience for everyone.

            </p>

          </div>

          <div className="self-start sm:self-auto shrink-0">

            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono font-bold tracking-wider uppercase">

              Platform Access

            </span>

          </div>

        </motion.div>



        {/* Balanced 3-Column Grid Layout for Portals */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {portals.map((portal, index) => {

            const Icon = portal.icon;



            return (

              <motion.div

                key={index}

                initial={{ opacity: 0, y: 30 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                transition={{ duration: 0.5, delay: index * 0.1 }}

                whileHover={{ y: -6 }}

                className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-8 hover:bg-slate-900/75 hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between"

              >

                {/* Micro Ambient Glow Layer inside each card */}

                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full ${portal.glow} blur-[60px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />



                <div>

                  {/* Icon & Badge Display Header */}

                  <div className="flex items-center justify-between mb-8">

                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${portal.accentColor}`}>

                      <Icon size={26} />

                    </div>

                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800/60">

                      {portal.badge}

                    </span>

                  </div>



                  {/* High-Legibility Content Block */}

                  <h3 className="text-2xl font-bold text-white tracking-tight">

                    {portal.title}

                  </h3>

                  

                  <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed min-h-[72px]">

                    {portal.description}

                  </p>

                </div>



                {/* Dashboard Action Area linked to Routing State */}

                <div className="mt-10 pt-6 border-t border-slate-800/60 flex items-center justify-between">

                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wide">Secure Access</span>

                  

                  <motion.button

                    whileHover={{ x: 4 }}

                    whileTap={{ scale: 0.98 }}

                    onClick={() => navigate(portal.path)}

                    className="inline-flex items-center gap-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-5 py-2.5 rounded-xl transition-colors duration-200"

                  >

                    Enter Portal

                    <ArrowRight size={16} className="text-slate-400 group-hover:text-white transition-colors" />

                  </motion.button>

                </div>

              </motion.div>

            );

          })}

        </div>



      </div>

    </section>

  );

}