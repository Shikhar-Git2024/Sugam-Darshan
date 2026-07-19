import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Trophy,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

import logo from "../../assets/images/logo.png";
import mandala from "../../assets/decorations/mandala.svg";
import mandala2 from "../../assets/decorations/mandala2.svg";

export default function FooterSection() {
  const navigate = useNavigate();

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#FFF8F1] pt-24 pb-10"
    >

      {/* Decorative Background */}

      <img
        src={mandala}
        alt=""
        className="absolute -top-28 -left-28 w-[620px] opacity-[0.1] pointer-events-none select-none"
      />

      <img
        src={mandala2}
        alt=""
        className="absolute bottom-0 -left-24 w-[600px] opacity-[0.1] pointer-events-none select-none"
      />

      <img
        src={mandala2}
        alt=""
        className="absolute bottom-0 -right-24 w-[600px] opacity-[0.1] pointer-events-none select-none"
      />

      <div className="absolute top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-orange-100 blur-[140px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        {/* CTA */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="
            relative
            overflow-hidden
            rounded-[36px]
            border
            border-[#FAD6A5]/50
            bg-gradient-to-br
            from-white
            via-[#FFF8EF]
            to-[#FFF2E3]
            shadow-[0_25px_60px_rgba(217,119,6,0.10)]
            p-10
            md:p-14
            mb-24
          "
        >

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-70" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-[#FAD6A5]/50 bg-[#FDE7C6] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#92400E]">

                <Sparkles
                  size={14}
                  className="animate-spin [animation-duration:5s]"
                />

                Plan Smarter

              </div>

              <h2 className="mt-6 text-4xl md:text-5xl font-black leading-tight text-[#5D3A1A]">

                Ready For A

                <br />

                <span className="text-[#92400E]">

                  Peaceful Darshan?

                </span>

              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#8B7355]">

                Book your darshan at the right time, avoid long queues,
                and enjoy a comfortable temple visit with AI-powered
                crowd recommendations.

              </p>

            </div>

            <div className="flex flex-wrap gap-4">

              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: .97,
                }}
                onClick={() => navigate("/devotee/login")}
                className="
                  rounded-xl
                  bg-[#92400E]
                  px-8
                  py-4
                  font-bold
                  text-white
                  shadow-lg
                  transition-all
                  hover:bg-[#7C2D12]
                "
              >

                Plan My Visit

              </motion.button>

              <motion.a
                href="#features"
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: .97,
                }}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#FAD6A5]/50
                  bg-white
                  px-8
                  py-4
                  font-bold
                  text-[#92400E]
                  transition-all
                  hover:bg-[#FFF6EC]
                "
              >

                Explore Features

                <ArrowRight size={18} />

              </motion.a>

            </div>

          </div>

        </motion.div>

        {/* Footer */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-[#FAD6A5]/40 pt-14">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-4">

              <img
                src={logo}
                alt="Sugam Darshan"
                className="h-14 w-14 object-contain"
              />

              <div>

                <h3 className="text-2xl font-black text-[#5D3A1A]">

                  Sugam Darshan

                </h3>

                <p className="text-sm text-[#92400E]">

                  AI Temple Crowd Intelligence

                </p>

              </div>

            </div>

            <p className="mt-6 leading-7 text-[#8B7355]">

              Helping devotees experience peaceful darshan through
              intelligent crowd prediction, smart planning,
              and better pilgrimage management.

            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#FAD6A5]/50 bg-[#FDE7C6] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#92400E]">

              <Trophy size={14} />

              HackShodh 2026 Winner

                        </div>

          </div>

          {/* Quick Links */}

          <div>

            <h4 className="text-lg font-bold text-[#5D3A1A] mb-6">

              Quick Links

            </h4>

            <ul className="space-y-4">

              <li>
                <a
                  href="#home"
                  className="text-[#8B7355] hover:text-[#92400E] transition-colors"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#forecasting"
                  className="text-[#8B7355] hover:text-[#92400E] transition-colors"
                >
                  Crowd Forecast
                </a>
              </li>

              <li>
                <a
                  href="#features"
                  className="text-[#8B7355] hover:text-[#92400E] transition-colors"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="text-[#8B7355] hover:text-[#92400E] transition-colors"
                >
                  How It Works
                </a>
              </li>

            </ul>

          </div>

          {/* Platform */}

          <div>

            <h4 className="text-lg font-bold text-[#5D3A1A] mb-6">

              Platform

            </h4>

            <ul className="space-y-4">

              <li className="text-[#8B7355]">
                Smart Crowd Prediction
              </li>

              <li className="text-[#8B7355]">
                AI Slot Recommendation
              </li>

              <li className="text-[#8B7355]">
                Temple Queue Management
              </li>

              <li className="text-[#8B7355]">
                Safe Darshan Planning
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h4 className="text-lg font-bold text-[#5D3A1A] mb-6">

              Contact

            </h4>

            <div className="space-y-5">

              <div className="flex items-start gap-4">

                <div className="h-11 w-11 rounded-xl bg-[#FDE7C6] border border-[#FAD6A5]/50 flex items-center justify-center">

                  <Mail
                    size={18}
                    className="text-[#92400E]"
                  />

                </div>

                <div>

                  <p className="text-sm text-[#8B7355]">

                    Email

                  </p>

                  <a
                    href="mailto:sugamdarshan.project@gmail.com"
                    className="font-semibold text-[#5D3A1A] hover:text-[#92400E]"
                  >

                    sugamdarshan@gmail.com

                  </a>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <div className="h-11 w-11 rounded-xl bg-[#FDE7C6] border border-[#FAD6A5]/50 flex items-center justify-center">

                  <MapPin
                    size={18}
                    className="text-[#92400E]"
                  />

                </div>

                <div>

                  <p className="text-sm text-[#8B7355]">

                    Location

                  </p>

                  <p className="font-semibold text-[#5D3A1A]">

                    Kanpur, Uttar Pradesh

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-12 border-t border-[#FAD6A5]/80 pt-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-sm text-[#8B7355]">

              © 2026 Sugam Darshan. All Rights Reserved.

            </p>

            <p className="text-sm text-[#92400E] font-semibold">

              Built with ❤️ for Devotees

            </p>

          </div>

        </div>

      </div>

    </footer>

  );

}