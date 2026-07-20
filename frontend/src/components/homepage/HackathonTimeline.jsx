import { motion } from "framer-motion";
import {
  Lightbulb,
  Code2,
  Clock3,
  Presentation,
  Trophy,
} from "lucide-react";

const journey = [
  {
    icon: Lightbulb,
    title: "Idea",
    desc: "Identify real pilgrimage problems",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: Code2,
    title: "Prototype",
    desc: "Built AI models & core system",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Clock3,
    title: "24 Hours",
    desc: "Non-stop building & testing",
    color: "from-sky-500 to-cyan-500",
  },
  {
    icon: Presentation,
    title: "Presentation",
    desc: "Presented before judges",
    color: "from-pink-500 to-purple-500",
  },
  {
    icon: Trophy,
    title: "Victory",
    desc: "1st Place Grand Winner",
    color: "from-orange-400 to-yellow-400",
  },
];

export default function HackathonTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .6 }}
      className="relative h-[248x] w-full overflow-hidden rounded-[28px]
      border border-white/10
      bg-gradient-to-br
      from-[#0d1126]
      via-[#11162b]
      to-[#0d1126]
      p-6"
    >
          <div className="flex items-center gap-3">

        <Lightbulb
          size={18}
          className="text-violet-400"
        />

        <h2 className="whitespace-nowrap text-base font-semibold uppercase tracking-[0.18em] text-violet-300">

          Our Winning Journey

        </h2>

      </div>

      <div className="relative mt-5 flex justify-evenly">
              <div className="absolute left-10 right-10 top-6 h-[2px] rounded-full
        bg-gradient-to-r
        from-violet-500
        via-blue-500
        to-orange-400" />

                {journey.map((item, index) => {

          const Icon = item.icon;

          return (

            <motion.div
              key={index}
              whileHover={{
                y:-8,
                scale:1.08,
              }}
              className="relative z-10 flex flex-1 flex-col items-center text-center"
            >
                <div
                className={`flex h-11 w-11 items-center justify-center rounded-full
                bg-gradient-to-br
                ${item.color}
                shadow-[0_0_30px_rgba(168,85,247,.45)]`}
              >

                <Icon
                  size={20}
                  className="text-white"
                />

              </div>

              <h3 className="mt-4 text-lm font-semibold text-white">

                {item.title}

              </h3>

              <p className="mt-2 text-[12px] max-w-[75px] leading-4 text-slate-400">

                {item.desc}

              </p>

            </motion.div>

          );

        })}

              </div>

    </motion.div>

  );
}