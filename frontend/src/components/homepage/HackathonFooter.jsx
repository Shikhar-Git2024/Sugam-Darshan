import csjmuLogo from "../../assets/images/hackathon/csjmulogo.png";
import vfsLogo from "../../assets/images/hackathon/vfs.jpg";
import hindustan from "../../assets/images/hackathon/hindustan.png";
import alta from "../../assets/images/hackathon/alta.png";
import nextgenLogo from "../../assets/images/hackathon/nextgen.jpg";
import ns3Logo from "../../assets/images/hackathon/Ns3Edu logo.svg";
import etvLogo from "../../assets/images/hackathon/etv.jpg";
import jagranLogo from "../../assets/images/hackathon/jagran.png";
import { motion } from "framer-motion";
import {
  ArrowRight,
} from "lucide-react";

import temple from "../../assets/images/hackathon/ram-mandir-hero.png";

export default function HackathonFooter() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">

      {/* =======================================================
                          LEFT CARD
      ======================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: .6 }}
        className="
        rounded-[28px]
        border border-white/10
        bg-gradient-to-br
        from-[#0d1126]
        via-[#11162b]
        to-[#0d1126]
        p-4
        h-[188px]
        relative
        overflow-hidden"
      >
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-[90px]" />

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400">
          RECOGNIZED BY
        </p>

        <div className="mt-5 grid grid-cols-6 divide-x divide-white/10">

  {/* CSJMU */}

  <motion.div
    whileHover={{ y: -5, scale: 1.04 }}
    className="px-2 text-center"
  >
    <img
      src={csjmuLogo}
      alt="CSJMU"
      className="mx-auto h-11"
    />

    <h3 className="mt-3 text-[15px] font-semibold text-white">
      CSJMU
    </h3>

    <p className="mt-1 text-[13px] text-slate-400">
      Host University
    </p>
  </motion.div>

  {/* Nexify */}

  <motion.div
    whileHover={{ y: -5, scale: 1.04 }}
    className="px-2 text-center"
  >
     <img
    src={alta}
    alt="alta"
    className="mx-auto h-10 w-10 rounded-full object-full"
/>

    <h3 className="mt-3 text-[15px] font-semibold text-white">
      Nexify'26
    </h3>

    <p className="mt-1 text-[13px] text-slate-400">
      National Hackathon
    </p>
  </motion.div>

  {/* VFS */}

  <motion.div
    whileHover={{ y: -5, scale: 1.04 }}
    className="px-2 text-center"
  >
    <img
    src={vfsLogo}
    alt="VFS Global"
    className="mx-auto h-10 w-10 rounded-full object-cover"
/>

    <h3 className="mt-3 text-[15px] font-semibold text-white">
      VFS Global
    </h3>

    <p className="mt-1 text-[13px] text-slate-400">
      Industry Partner
    </p>
  </motion.div>

  {/* NextGen */}

  <motion.div
    whileHover={{ y: -5, scale: 1.04 }}
    className="px-2 text-center"
  >
    <img
    src={nextgenLogo}
    alt="NextGen Navigator"
    className="mx-auto h-10 w-10 rounded-full object-cover"
/>

    <h3 className="mt-3 text-[15px] font-semibold text-white">
      NextGen
    </h3>

    <p className="mt-1 text-[13px] text-slate-400">
      Navigator
    </p>
  </motion.div>

  {/* NS3 */}

  <motion.div
    whileHover={{ y: -5, scale: 1.04 }}
    className="px-2 text-center"
  >
    <img
    src={ns3Logo}
    alt="NS3 EDU"
    className="mx-auto h-10 object-contain"
/>

    <h3 className="mt-3 text-[15px] font-semibold text-white">
      NS3 EDU
    </h3>

    <p className="mt-1 text-[13px] leading-4 text-slate-400">
      NS3 Solutions Ltd.
    </p>
  </motion.div>

  {/* Media */}

  <motion.div
    whileHover={{ y: -5, scale: 1.04 }}
    className="px-2 text-center"
  >
    <div className="mx-auto grid w-fit grid-cols-3 gap-1">

    <img
        src={etvLogo}
        alt="ETV Bharat"
        className="h-7 w-7 rounded object-cover"
    />

    <img
        src={jagranLogo}
        alt="Jagran"
        className="h-7 w-7 rounded object-cover"
    />

    <img
        src={hindustan}
        alt="hindustan"
        className="h-7 w-7 rounded object-cover"
    />
  </div>  

    <h3 className="mt-3 text-[16px] font-semibold text-white">
      Featured By
    </h3>

    <p className="mt-0 text-[11.5px] leading-4 text-slate-400">
      Amar Ujala<br />
      Hindustan<br />
      Dainik Jagran<br />
      ETV Bharat
    </p>
  </motion.div>

</div>

      </motion.div>

      {/* =======================================================
                         RIGHT CARD
      ======================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: .6, delay: .15 }}
        className="
        relative
        overflow-hidden
        rounded-[28px]
        border border-white/10
        bg-gradient-to-r
        from-violet-900/50
        via-[#1a1738]
        to-orange-900/25
        p-5
        h-[188px]
        "
      >

        <img
  src={temple}
  alt=""
  className="
    absolute
    right-0
    top-0
    h-full
    w-[100%]
    object-cover
    object-center
    opacity-90
    pointer-events-none
    select-none
"
/>

          <h2 className="mt-0 text-2xl font-extrabold text-white opacity-90">
            This is just the beginning.
          </h2>

          <p className="mt-1 max-w-sm text-sm leading-5 text-slate-300 opacity-65">
            We are building the future of intelligent pilgrimage
            experiences with AI, real-time crowd intelligence and
            smarter temple management.
          </p>

          <motion.a
  href="https://whatsapp.com/channel/0029VbDJpUd3QxS4UVwjEX0v"
  target="_blank"
  rel="noopener noreferrer"

  animate={{
    y: [0, -10, 0],
  }}

  transition={{
    duration: 3.2,
    repeat: Infinity,
    ease: "easeInOut",
  }}

  whileHover={{
    scale: 1.06,
    y: -3,
  }}

  whileTap={{
    scale: 0.97,
  }}

  className="
    group
    mt-3
    inline-flex
    items-center
    gap-2
    rounded-xl
    bg-gradient-to-r
    from-orange-500
    to-yellow-400
    px-5
    py-3
    font-semibold
    text-white
    shadow-lg
    transition-all
    duration-300
    hover:opacity-100
    opacity-95
  "
>
  Join Our Mission

  <ArrowRight
    size={18}
    className="transition-transform duration-300 group-hover:translate-x-1"
  />
</motion.a>

        

      </motion.div>

    </section>
  );
}