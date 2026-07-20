import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Users,
  Clock3,
  IndianRupee,
} from "lucide-react";

import teamPhoto from "../../assets/images/hackathon/team-photo.jpeg";
import trophyBadge from "../../assets/images/hackathon/trophy-badge1.png";

// Replace these later with actual team images
import avatar1 from "../../assets/images/hackathon/avatar1.png";
import avatar2 from "../../assets/images/hackathon/avatar2.jpg";
import avatar3 from "../../assets/images/hackathon/avatar3.jpeg";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const stats = [
  {
    icon: Users,
    value: "600+",
    label: "Teams",
  },
  {
    icon: Clock3,
    value: "24",
    label: "Hours",
  },
  {
    icon: IndianRupee,
    value: "₹25K",
    label: "Grant Received",
  },
];

export default function HackathonHero() {
  return (
    <section className="relative overflow-hidden py-5">

      {/* Background Glow */}

      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-orange-500/20 blur-[120px]" />

      <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[160px]" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid w-full max-w-[1550px] items-center gap-4 px-8 lg:grid-cols-12"
      >

        {/* ===========================
             LEFT CONTENT
        ============================ */}

        <motion.div
          variants={item}
          className="flex h-full flex-col justify-center lg:col-span-12
xl:col-span-5"
        >

          {/* Badge */}

          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 backdrop-blur-md"
          >
            <Sparkles
              size={15}
              className="text-orange-400"
            />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-300">
              National Recognition
            </span>
          </motion.div>

          {/* Heading */}

          <motion.h1
            variants={item}
            className="mt-6 max-w-[620px] text-5xl font-black leading-[0.95] text-white xl:text-6xl 2xl:text-6xl"
          >
            Innovation That

            <span className="mt-2 block bg-gradient-to-r from-orange-400 via-yellow-300 to-pink-400 bg-clip-text text-transparent">
              Won Hearts
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-xl leading-9 text-slate-300"
          >
            Sugam Darshan emerged as the
            <span className="font-semibold text-orange-400">
              {" "}1st Place Grand Winner{" "}
            </span>
            at a national hackathon by solving real-world pilgrimage
            challenges through AI-powered crowd intelligence,
            smart planning and accessible technology for millions
            of devotees.
          </motion.p>

          {/* Buttons */}

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap gap-5"
          >


            <motion.a
  href="https://www.etvbharat.com/hi/state/kanpur-hack-shodh-2026-at-csjmu-allen-house-team-wins-uttar-pradesh-news-ups26020100468"
  target="_blank"
  rel="noopener noreferrer"

  animate={{
  y: [0, -5, 0],
  x: [0, 9, 0],
  rotate: [5, -3, 0],
}}

transition={{
  duration: 2,
  repeat: Infinity,
  ease: "easeInOut",
}}

  whileHover={{
    scale: 1.06,
    y: -3,
  }}

  whileTap={{
    scale: 0.96,
  }}
  

  className="group inline-flex items-center gap-1 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 px-8 py-3.5 text-base font-bold text-white shadow-[0_15px_40px_rgba(249,115,22,0.45)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(249,115,22,0.65)]"
>
  Explore Our Journey

  <ArrowRight
    size={18}
    className="transition-transform duration-300 group-hover:translate-x-1"
  />
</motion.a>


          </motion.div>
          

          {/* Team Members */}

          <motion.div
            variants={item}
            className="mt-7 flex items-center gap-3"
          >

            <div className="flex -space-x-2">

              {[avatar1, avatar2, avatar3].map((avatar, index) => (

                <motion.img
                  key={index}
                  whileHover={{
                    scale: 1.12,
                    y: -3,
                    zIndex: 20,
                  }}
                  src={avatar}
                  alt="Developer"
                  className="h-14 w-14 rounded-full border-[3px] border-[#0b1120] object-cover shadow-xl"
                />

              ))}

            </div>

            <div>

              <p className="font-semibold text-white">
                Built by passionate innovators
              </p>

              <p className="text-sm text-slate-400">
                Turning ideas into impactful solutions.
              </p>

            </div>

          </motion.div>

        </motion.div>

        {/* =======================================
                CENTER IMAGE
        ======================================== */}

        <motion.div
          variants={item}
          className="relative flex items-center justify-center lg:col-span-6
xl:col-span-4"
        >

          {/* Background Glow */}

          <div className="absolute -left-10 top-10 h-60 w-60 rounded-full bg-orange-500/20 blur-[120px]" />

          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/20 blur-[150px]" />

          {/* Floating Decoration */}

          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
            }}
            className="absolute -right-6 top-8 z-20 h-24 w-24 rounded-full bg-gradient-to-br from-orange-400/30 to-pink-500/20 blur-xl"
          />

          <motion.div
            whileHover={{
              scale: 1.015,
            }}
            transition={{
              duration: 0.35,
            }}
            className="group relative max-w-[500px] w-full max-w-[500px] overflow-hidden rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.35)]"
          >

            <img
              src={teamPhoto}
              alt="Sugam Darshan Team"
              className="h-[580px] rounded-[32px] w-full object-cover transition-all duration-700 group-hover:scale-105"
            />

            {/* Overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent" />

            {/* Shine Animation */}

            <motion.div
              initial={{
                x: "-120%",
              }}
              whileHover={{
                x: "180%",
              }}
              transition={{
                duration: 1.3,
              }}
              className="absolute inset-y-0 w-28 rotate-12 bg-white/20 blur-xl"
            />

            {/* Bottom Caption */}

            <div className="absolute bottom-3 left-6 right-6 rounded-2xl border border-white/10 bg-black/30 p-2 backdrop-blur-xl">

              <p className="text-xs uppercase tracking-[0.35em] text-orange-300">
                National Hackathon
              </p>

              <h3 className="mt-1 text-2xl font-bold text-white">
                Hackshodh'26 Champions
              </h3>

              <p className="mt-1 text-xm leading-6.5 text-slate-300">
                From a spark to a winning solution—built on heart, teamwork, and technology that matters.
              </p>

            </div>

          </motion.div>

        </motion.div>

        {/* =======================================
                WINNER CARD
        ======================================== */}

        <motion.div
          variants={item}
          className="relative lg:col-span-6
xl:col-span-3 max-w-[280px] w-full justify-self-end"
        >

                  {/* Premium Glow */}

          <div className="absolute inset-0 rounded-[34px] bg-gradient-to-b from-orange-500/10 via-transparent to-violet-500/10 blur-2xl" />

          <motion.div
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            transition={{
              duration: 0.35,
            }}
            className="relative w-full max-w-[350px] overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-[#181824] via-[#12131f] to-[#090b14] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >

            {/* Decorative Background */}

            <div className="absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-orange-400/20 blur-[90px]" />

            <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-violet-500/20 blur-[80px]" />

            {/* Trophy */}

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
              className="relative z-10 flex justify-center"
            >
              <img
                src={trophyBadge}
                alt="Winner Trophy"
                className="w-45 drop-shadow-[0_15px_35px_rgba(255,185,0,0.55)]"
              />
            </motion.div>

            {/* Winner Text */}

            <div className="relative z-10 mt-1 text-center">

              <p className="text-5xl font-black text-amber-300">
                1<sup className="text-2xl">st</sup>
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.6em] text-sky-300">
                PLACE
              </p>

              <div className="mx-auto mt-2 h-px w-16 bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

              <h3 className="mt-2 text-xl font-bold tracking-wide text-white">
                GRAND WINNER
              </h3>

              <p className="mt-0 text-sm leading-6 text-slate-400">
                National Level Hackathon
              </p>

            </div>

            {/* Divider */}

            <div className="my-2.5 h-px bg-white/10" />

            {/* Stats */}

            <div className="space-y-1.5">

              {stats.map((stat, index) => {

                const Icon = stat.icon;

                return (

                  <motion.div
                    key={index}
                    whileHover={{
                      x: 5,
                    }}
                    className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-1 transition-all duration-300 hover:border-orange-400/20 hover:bg-white/[0.05]"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-400/10 text-orange-300">

                      <Icon size={22} />

                    </div>

                    <div>

                      <h4 className="text-2xl font-bold text-white">

                        {stat.value}

                      </h4>

                      <p className="text-sm text-slate-400">

                        {stat.label}

                      </p>

                    </div>

                  </motion.div>

                );

              })}

            </div>

          </motion.div>

        </motion.div>
        </motion.div>
    </section>
  );
}