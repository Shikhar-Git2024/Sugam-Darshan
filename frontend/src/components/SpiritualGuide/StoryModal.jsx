import { X, BookOpen, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import story1 from "../../assets/SpiritualGuide/dailyHub/story-1.png";
import story2 from "../../assets/SpiritualGuide/dailyHub/story-2.png";
import story3 from "../../assets/SpiritualGuide/dailyHub/story-3.png";
import story4 from "../../assets/SpiritualGuide/dailyHub/story-4.png";

export default function StoryModal({
  story,
  onClose,
}) {

  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const max = container.scrollHeight - container.clientHeight;

      const percent =
        max <= 0 ? 0 : (container.scrollTop / max) * 100;

      setProgress(percent);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [story]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

 useEffect(() => {
  if (!story) return;

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = previousOverflow;
  };
}, [story]);

  if (!story) return null;

  const storyImages = {
    story1,
    story2,
    story3,
    story4,
  };

  return (
    <AnimatePresence>

      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"

        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}

        transition={{
          duration: .25,
        }}
      >

        <motion.div
          initial={{
            scale: .9,
            opacity: 0,
            y: 40,
          }}

          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}

          exit={{
            scale: .95,
            opacity: 0,
            y: 30,
          }}

          transition={{
            type: "spring",
            stiffness: 120,
            damping: 18,
          }}

          className="relative w-[92%] max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        >

          {/* Header */}

          <div className="h-1 bg-orange-100">
  <motion.div
    className="h-full rounded-full bg-orange-500"
    animate={{
      width: `${progress}%`,
    }}
  />
</div>

          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-orange-100 bg-white/95 px-7 py-5 backdrop-blur">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-orange-100 p-3 text-orange-600">

                <BookOpen size={24} />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-800">

                  {story.title}

                </h2>

                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                  <Clock size={15} />

                  <span>{story.readTime}</span>

                </div>

              </div>

            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 p-3 transition hover:rotate-90 hover:bg-red-500 hover:text-white"
            >

              <X size={22} />

            </button>

          </div>

          {/* Image */}

          <img
            src={storyImages[story.image]}
            alt={story.title}
            className="h-72 w-full object-fill"
          />

          {/* Story */}

          <div
  id="story-scroll"
  ref={scrollRef}
  className="max-h-[420px] overflow-y-auto px-8 py-7 scroll-smooth"
>

            <h3 className="mb-4 text-xl font-bold text-orange-600">

              {story.subtitle}

            </h3>

            <div className="space-y-5 leading-8 text-slate-700">

              {story.content
                .trim()
                .split("\n")
                .map((paragraph, index) => (

                  paragraph.trim() && (

                    <p key={index}>

                      {paragraph}

                    </p>

                  )

              ))}

            </div>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
}