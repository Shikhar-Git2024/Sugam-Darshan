import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import virtualTourLinks from "../../data/SpiritualGuide/virtualTourLinks";

export default function VirtualTourModal({
  isOpen,
  onClose,
}) {

  const [currentTour, setCurrentTour] = useState(
    virtualTourLinks[0]
  );

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const changeTour = (tour) => {

    if (tour.id === currentTour.id) return;

    setLoading(true);

    window.scrollTo(0, 0);
    setTimeout(() => {

      setCurrentTour(tour);

      setLoading(false);

    }, 600);

  };

  return (

    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-6">

      <div className="relative
w-[90vw]
max-w-[1700px]
h-[95vh]
overflow-hidden
rounded-[34px]
bg-black
border border-slate-700
shadow-[0_30px_80px_rgba(0,0,0,0.65)]
flex
flex-col">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-700 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-8 py-2">

          <div>

            <h2 className="text-2xl font-bold tracking-wide text-white">
              360° Virtual Darshan
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Shri Ram Janmabhoomi Mandir
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-3 backdrop-blur-md transition-all duration-300 hover:bg-red-500 hover:rotate-90 hover:scale-110 transition hover:bg-red-500"
          >
            <X
              size={22}
              className="text-white"
            />
          </button>

        </div>

        {/* Navigation */}

        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-slate-700 bg-slate-800 px-8 py-2">

          {virtualTourLinks.map((tour) => (

            <motion.button
              key={tour.id}
              onClick={() => changeTour(tour)}
              whileHover={{
                y: -4,
                scale: 1.05,
            }}

            whileTap={{
              scale: 0.96,
            }}

            transition={{
              type: "spring",
              stiffness: 350,
              damping: 18,
            }}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                currentTour.id === tour.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl scale-105"
                  : "bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white hover:scale-105"
              }`}
            >
              {tour.title}
            </motion.button>

          ))}

        </div>

        {currentTour.id === 2 && (

            <div className="flex items-center justify-center bg-amber-500/10 py-3">

            <p className="text-sm text-amber-300">

            ⚠ Interactive Home View may open new browser tabs when selecting locations.
            Use the buttons above for the best immersive experience.

            </p>

            </div>

            )}

        {/* Viewer */}

        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">

          {loading && (

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70">

              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>

              <p className="text-lg font-semibold text-white">

                🛕
            Loading Virtual Darshan...

              </p>

            </div>

          )}

          <div className="absolute left-6 top-5 z-20 rounded-xl bg-black/60 px-5 py-3 backdrop-blur-md">

            <p className="text-xs uppercase tracking-widest text-orange-300">
              Now Exploring
            </p>

            <h3 className="mt-1 text-2xl font-bold text-white">
              {currentTour.title}
            </h3>

        </div>

          <iframe
            key={currentTour.id}
            src={currentTour.url}
            title={currentTour.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

        </div>

      </div>

    </div>

  );

}
