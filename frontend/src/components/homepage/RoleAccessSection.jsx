import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Shield,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import mandala from "../../assets/decorations/mandala.svg";
import mandala2 from "../../assets/decorations/mandala2.svg";

export default function RoleAccessSection() {
  const navigate = useNavigate();

  const portals = [
    {
      title: "Devotee Portal",
      icon: Users,
      description:
        "Book darshan slots, check crowd updates, and plan a smooth temple visit for yourself and your family.",
      badge: "For Devotees",
      iconBg: "bg-[#FAD6A5]/30",
      iconColor: "text-[#92400E]",
      border: "border-[#FAD6A5]/40",
      glow: "bg-orange-200/40",
      path: "/devotee/login",
    },

    {
      title: "Authority Portal",
      icon: Shield,
      description:
        "Monitor live crowd conditions, manage temple operations, and help ensure a safe darshan experience.",
      badge: "Temple Staff",
      iconBg: "bg-[#E8F0E8]",
      iconColor: "text-[#3E653E]",
      border: "border-[#CDE0CD]",
      glow: "bg-green-200/40",
      path: "/authority/login",
    },

    {
      title: "Admin Portal",
      icon: Lock,
      description:
        "Manage users, permissions, system settings, and overall platform administration securely.",
      badge: "Administrator",
      iconBg: "bg-[#FDECEC]",
      iconColor: "text-[#991B1B]",
      border: "border-[#FECACA]",
      glow: "bg-red-200/40",
      path: "/admin/login",
    },
  ];

  return (
    <section
      id="platform-access"
      className="relative overflow-hidden py-24 bg-[#FFF8F1]"
    >
      {/* Background Decorations */}

      <img
        src={mandala}
        alt=""
        className="absolute -top-24 -left-24 w-[650px] opacity-[0.1] pointer-events-none select-none"
      />

      <img
        src={mandala2}
        alt=""
        className="absolute -bottom-20 -right-24 w-[620px] opacity-[0.1] pointer-events-none select-none"
      />

      <div className="absolute top-24 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-orange-100/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="flex flex-col items-center text-center mb-16"
        >

          <div className="inline-flex items-center gap-2 rounded-full bg-[#FAD6A5]/30 border border-[#FAD6A5]/50 px-5 py-2 text-[#92400E] font-bold text-xs uppercase tracking-wider mb-6">

            <Sparkles size={14} className="animate-spin [animation-duration:5s]"/>

            Choose Your Portal

          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#5D3A1A] leading-tight">

            Access the

            <br />

            <span className="text-[#92400E]">

              Right Portal

            </span>

          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#8B7355]">

            Whether you're planning your darshan, managing temple operations,
            or administering the platform, choose the portal that matches your
            role to continue securely.

          </p>

        </motion.div>

        {/* Portal Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {portals.map((portal, index) => {

            const Icon = portal.icon;

            return (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: .5,
                  delay: index * .1,
                }}
                whileHover={{
                  y: -8,
                }}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  ${portal.border}
                  bg-[#FFFBF5]/90
                  backdrop-blur-md
                  shadow-[0_20px_45px_rgba(217,119,6,0.08)]
                  hover:shadow-[0_25px_60px_rgba(217,119,6,0.15)]
                  transition-all
                  duration-300
                  p-8
                  flex
                  flex-col
                  justify-between
                `}
              >

                <div
                  className={`
                    absolute
                    -top-10
                    -right-10
                    h-40
                    w-40
                    rounded-full
                    ${portal.glow}
                    blur-3xl
                    opacity-40
                    group-hover:opacity-70
                    transition-all
                  `}
                />

                <div className="relative">

                  <div className="flex items-center justify-between mb-8">

                    <div
                      className={`
                        h-14
                        w-14
                        rounded-2xl
                        ${portal.iconBg}
                        border
                        ${portal.border}
                        flex
                        items-center
                        justify-center
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      `}
                    >

                      <Icon
                        size={26}
                        className={portal.iconColor}
                      />

                    </div>

                    <span className="rounded-full border border-[#FAD6A5]/40 bg-[#FFF5E6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#92400E]">

                      {portal.badge}

                    </span>

                  </div>

                  <h3 className="text-2xl font-black text-[#5D3A1A]">

                    {portal.title}

                  </h3>

                  <p className="mt-4 text-[15px] leading-7 text-[#8B7355] min-h-[120px]">

                    {portal.description}

                  </p>
                                  <div className="mt-8 pt-6 border-t border-[#FAD6A5]/40 flex items-center justify-between">

                    <span className="text-xs font-semibold uppercase tracking-wider text-[#8B7355]">

                      Secure Access

                    </span>

                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(portal.path)}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-[#92400E]
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-white
                        shadow-lg
                        transition-all
                        duration-300
                        hover:bg-[#7C2D12]
                        hover:shadow-xl
                      "
                    >

                      Continue

                      <ArrowRight
                        size={16}
                        className="
                          text-[#FAD6A5]
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />

                    </motion.button>

                  </div>

                </div>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>

  );

}