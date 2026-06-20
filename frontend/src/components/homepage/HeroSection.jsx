import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import heroImage from "../../assets/images/ram-mandir-hero.jpg";
import logo from "../../assets/images/logo.png";

export default function HeroSection() {
  const navigate = useNavigate();
  const [homeStats, setHomeStats] =
    useState(null);

  useEffect(() => {

    async function loadData() {

      try {

        const response =
          await axios.get(
            "http://127.0.0.1:8000/public/home-stats"
          );

        setHomeStats(
          response.data
        );

      } catch (error) {

        console.log(error);

      }

    }

    loadData();

  }, []);

  return (
    <section id="top" className="relative min-h-screen overflow-hidden">

      {/* Background Image */}
      <motion.img
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        src={heroImage}
        alt="Ram Mandir"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "
      />

      {/* Main Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#140b35]/95
          via-[#2e1b63]/80
          to-[#357bc4]/55
        "
      />

      {/* Animated Glow 1 */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="
          absolute
          -top-32
          left-20
          w-[500px]
          h-[500px]
          rounded-full
          bg-violet-500/20
          blur-[140px]
        "
      />

      {/* Animated Glow 2 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="
          absolute
          bottom-0
          right-0
          w-[500px]
          h-[500px]
          rounded-full
          bg-cyan-400/20
          blur-[140px]
        "
      />

      {/* Floating Logo Watermark */}
      <motion.img
        animate={{
          y: [-10, 10, -10],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        src={logo}
        alt=""
        className="
          absolute
          right-10
          top-1/2
          -translate-y-1/2
          w-72
          opacity-[0.06]
          pointer-events-none
          hidden lg:block
        "
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="pt-28 pb-24 max-w-4xl">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.8,
              }}
              className="
                text-white
                font-bold
                leading-[0.95]
                text-5xl
                md:text-6xl
                lg:text-7xl
              "
            >
              Smarter Darshan.
              <br />

              Safer Visits.
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-cyan-300
                  via-purple-300
                  to-pink-300
                  bg-clip-text
                  text-transparent
                "
              >
                Better Experiences.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.8,
              }}
              className="
                mt-8
                text-xl
                text-white/85
                leading-relaxed
                max-w-3xl
              "
            >
              An AI-powered crowd intelligence platform helping
              devotees plan seamless visits to Ram Mandir with
              real-time forecasts, smart slot booking, crowd
              monitoring and safer pilgrimage experiences.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.6,
                duration: 0.8,
              }}
              className="flex gap-5 mt-10 flex-wrap"
            >

              <motion.button
                whileHover={{
                  y: -6,
                  scale: 1.04,
                }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 18,
                }}
                onClick={() => {
                  const token =
                    localStorage.getItem("token");
                    if (token) {
                      navigate(
                        "/devotee/dashboard"
                      );
                    } else {
                      navigate(
                        "/devotee/login"
                      );
                    }
                  }}
                className="
                  group
                  px-8
                  py-4
                  rounded-2xl
                  bg-white
                  text-violet-700
                  font-semibold
                  shadow-xl
                  hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)]
                  transition-all
                  duration-300
                "
              >
                <span className="flex items-center gap-2">
                  Plan My Visit
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>

              <motion.button
                onClick={() => {

                  document
                    .getElementById("features")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });

                }}
                whileHover={{
                  y: -6,
                  scale: 1.04,
                }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 18,
                }}
                className="
                  px-8
                  py-4
                  rounded-2xl
                  bg-white/15
                  backdrop-blur-xl
                  border
                  border-white/20
                  text-white
                  font-semibold
                  hover:bg-white/25
                  hover:border-white/40
                  hover:shadow-[0_20px_40px_rgba(255,255,255,0.08)]
                  transition-all
                  duration-300
                "
              >
                Explore Features
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.8,
                duration: 0.8,
              }}
              className="
                flex
                flex-wrap
                gap-14
                mt-16
              "
            >

              {[
                  {
                    number:
                      homeStats?.total_visitors || 0,
                    label:
                      "Registered Users",
                  },
                  {
                    number:
                      homeStats?.active_bookings || 0,
                    label:
                      "Active Bookings",
                  },
                  {
                    number: "24/7",
                    label:
                      "Live Monitoring",
                  },
                ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{
                    y: -6,
                  }}
                  className="cursor-default"
                >
                  <h3 className="text-5xl font-bold text-white">
                    {item.number}
                  </h3>

                  <p className="text-white/70 mt-2">
                    {item.label}
                  </p>
                </motion.div>
              ))}

            </motion.div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}