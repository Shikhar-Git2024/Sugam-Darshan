import { useEffect, useRef, useState } from "react";
import { scrollToSection } from "../../utils/scrollToSection";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pause,
  Play,
  
} from "lucide-react";

import heroSlides from "../../data/SpiritualGuide/heroSlides";

export default function SpiritualHeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const intervalRef = useRef(null);

  const totalSlides = heroSlides.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
  if (paused) return;

  intervalRef.current = setInterval(() => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, 4500);

  return () => clearInterval(intervalRef.current);
}, [paused, totalSlides]);

  const handleButtonClick = () => {

  switch (heroSlides[current].id) {

    case 1:
      scrollToSection("live-darshan");
      break;

    case 2:
      scrollToSection("pilgrim-guide");
      break;

    case 3:
      scrollToSection("virtual-tour");
      break;

    case 4:
      scrollToSection("pilgrim-guide");
      break;

    default:
      break;

  }

};

  const slide = heroSlides[current];

  return (
    <div className="mt-8 px-6">

      <div
        className="relative overflow-hidden rounded-[32px] shadow-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >

        {/* Progress */}

        <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-30">

          <motion.div
            key={current}
            initial={{ width: 0 }}
            animate={{ width: paused ? "0%" : "100%" }}
            transition={{
              duration: 4.5,
              ease: "linear",
            }}
            className="h-full bg-orange-500"
          />

        </div>

        <AnimatePresence mode="wait">

          <motion.div
            key={slide.id}
            initial={{
              opacity: 0,
              x: 80,
              scale: 1.02,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: -80,
            }}
            transition={{
              duration: .6,
            }}
            className="relative h-[340px]"
          >

            {/* Background */}

            <motion.img
              src={slide.image}
              alt={slide.title}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5 }}
              className="absolute inset-0 w-full h-full object-fill"
            />

            {/* Overlay */}

            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/20 to-transparent" />

            {/* Content */}

            <div className="relative z-20 flex items-center h-full">

              <div className="max-w-xl pl-28 pr-16">

                <motion.h2
                  initial={{
                    y: 25,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    delay: .1,
                  }}
                  className="text-3xl font-bold text-orange-700"
                >
                  {slide.title}
                </motion.h2>

                <motion.p
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    delay: .25,
                  }}
                  className="mt-6 text-xl italic text-slate-800 leading-relaxed"
                >
                  "{slide.subtitle}"
                </motion.p>

                <motion.p
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    delay: .4,
                  }}
                  className="mt-5 text-lg font-semibold text-slate-700"
                >
                  {slide.hindi}
                </motion.p>

                <motion.p
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    delay: .55,
                  }}
                  className="mt-5 text-base text-slate-600"
                >
                  {slide.author}
                </motion.p>

                <motion.button
                  onClick={handleButtonClick}
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: .96,
                  }}
                  className="mt-8 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-7 py-3 font-semibold text-white shadow-lg transition-all"
                >
                  {slide.button}

                  <ArrowRight size={18} />
                </motion.button>

              </div>

            </div>

                        {/* Left Arrow */}

            <button
              onClick={prevSlide}
              className="absolute left-8 top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Right Arrow */}

            <button
              onClick={nextSlide}
              className="absolute right-8 top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white"
            >
              <ChevronRight size={22} />
            </button>

          </motion.div>

        </AnimatePresence>

        {/* Bottom Controls */}

        <div className="pointer-events-none absolute bottom-5 left-0 right-0 z-30 flex items-center justify-center">

          {/* Dots */}

          <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-black/15 px-4 py-2 backdrop-blur-md">

            {heroSlides.map((_, index) => (

              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`transition-all duration-300 ${
                  current === index
                    ? "h-3 w-8 rounded-full bg-orange-500"
                    : "h-3 w-3 rounded-full bg-white"
                }`}
              />

            ))}

          </div>

        </div>

        {/* Play Pause */}

        <div className="pointer-events-none absolute bottom-5 right-6 z-10">
          <button
            onClick={() => setPaused((prev) => !prev)}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110"
          >
          {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>

      </div>

    </div>
  );
}