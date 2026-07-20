import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Images,
} from "lucide-react";

import hackathonGallery from "../../data/Homepage Carousel/hackathonGallery";

export default function HackathonGallery() {

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {

  if (!autoPlay) return;

  const timer = setInterval(() => {
    setCurrent((prev) => (prev + 1) % hackathonGallery.length);
  }, 7000);

  return () => clearInterval(timer);

}, [autoPlay]);

  return (
  <motion.div
    initial={{ opacity: 0, y: 35 }}
    onMouseEnter={() => setAutoPlay(false)}
    onMouseLeave={() => setAutoPlay(true)}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.15 }}
    className="relative h-[248px] overflow-hidden rounded-[28px]
    border border-white/10
    bg-gradient-to-br
    from-[#0d1126]
    via-[#11162b]
    to-[#0d1126]
    p-5"
  >
    {/* Header */}

    <div className="mb-5 flex items-center justify-between">

      <div className="flex items-center gap-3">

        <Images
          size={18}
          className="text-violet-400"
        />

        <h2 className="whitespace-nowrap text-base font-semibold uppercase tracking-[0.18em] text-violet-300">
          Glimpses From The Hackathon
        </h2>

      </div>

      <div className="text-sm font-medium text-slate-500">
    {current + 1} / {hackathonGallery.length}
      </div>

    </div>

    {/* Gallery */}

    <AnimatePresence mode="wait">

      <motion.div
        key={current}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -20,
        }}
        transition={{
          duration: 1.15,
        }}
        className="grid grid-cols-4 gap-3"
      >
              {hackathonGallery.map((item, index) => (

          <motion.div
            key={index}
            whileHover={{
              y: -8,
              scale: 1.04,
            }}
            onClick={() => {
    setCurrent(index);
    setAutoPlay(false);
}}
            className={`group
cursor-pointer
overflow-hidden
rounded-2xl
border
transition-all
duration-500
hover:shadow-[0_0_35px_rgba(251,146,60,0.28)]

            ${
              current === index
                ? "border-orange-400 shadow-[0_0_25px_rgba(251,146,60,.35)]"
                : "border-white/10"
            }`}
          >

            <div className="relative h-[125px] overflow-hidden">

              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-fill transition duration-500 group-hover:scale-[1.08]
group-hover:brightness-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            </div>

            <div className="p-3">

              <h3 className="text-center text-xs font-semibold text-white">

                {item.title}

              </h3>

            </div>

          </motion.div>

        ))}

              </motion.div>

    </AnimatePresence>

    {/* Dots */}

    <div className="mt-5 flex justify-center gap-2">

      {hackathonGallery.map((_, index) => (

        <button
          key={index}
          onClick={() => {
    setCurrent(index);
    setAutoPlay(false);
}}
          className={`h-2 rounded-full transition-all duration-300

          ${
            current === index
              ? "w-8 bg-orange-400"
              : "w-2 bg-white/25"
          }`}
        />

      ))}

    </div>

  </motion.div>
);
}