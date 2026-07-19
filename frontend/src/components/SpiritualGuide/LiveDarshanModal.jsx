import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveDarshanModal({
  isOpen,
  onClose,
}) {
  return (
    <AnimatePresence>

      {isOpen && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
        >

          <motion.div
            initial={{
              scale: 0.88,
              opacity: 0,
              y: 40,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.92,
              opacity: 0,
              y: 30,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
            }}
            className="relative w-[94%] max-w-6xl overflow-hidden rounded-3xl bg-black shadow-2xl"
          >

            {/* Header */}

            <div className="flex items-center justify-between bg-slate-900 px-6 py-4">

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Latest Darshan
                </h2>

                <p className="text-sm text-slate-300">
                  Shri Ram Janmabhoomi Temple
                </p>

              </div>

              <button
                onClick={onClose}
                className="rounded-full bg-white/10 p-3 backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:scale-110 hover:bg-red-500"
              >

                <X
                  size={24}
                  className="text-white"
                />

              </button>

            </div>

            {/* Player */}

            <div className="aspect-video bg-black">

              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/2WEJCmOW-ZA?autoplay=1&rel=0"
                title="Latest Darshan"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen

              />

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}