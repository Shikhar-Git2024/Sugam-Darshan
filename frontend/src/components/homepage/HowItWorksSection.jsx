import { motion } from "framer-motion";
import {
  Calendar,
  Brain,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import mandala from "../../assets/decorations/mandala.svg";
import mandala2 from "../../assets/decorations/mandala2.svg";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Calendar,
      title: "Choose Your Visit Date",
      description:
        "Select your preferred darshan date and convenient time slot to begin planning your temple visit.",
    },
    {
      number: "02",
      icon: Brain,
      title: "AI Analyzes Crowd",
      description:
        "Our intelligent system studies expected visitor numbers, waiting time and crowd conditions.",
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Receive Best Recommendation",
      description:
        "Get the most suitable time slot for a smooth, comfortable and peaceful darshan experience.",
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Confirm & Visit",
      description:
        "Book your preferred slot and travel confidently with less waiting and better planning.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-24 bg-[#FFFBF5]"
    >
      {/* Decorative Background - Standardized Opacity */}
      <img
        src={mandala}
        alt=""
        className="absolute -top-24 -left-24 w-[600px] opacity-[0.1] pointer-events-none select-none"
      />
      <img
        src={mandala2}
        alt=""
        className="absolute -bottom-20 -right-24 w-[600px] opacity-[0.1] pointer-events-none select-none"
      />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#FAD6A5]/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-20"
        >
          {/* Refined Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FAD6A5]/20 border border-[#FAD6A5]/40 px-5 py-2 text-[#92400E] font-bold text-xs uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles size={14} className="animate-spin [animation-duration:8s]" />
            Easy Booking Journey
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-black text-[#5D3A1A] leading-tight">
            Plan Your Darshan
            <br />
            <span className="text-[#92400E]">In Four Simple Steps</span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#8B7355] font-medium">
            Sugam Darshan helps devotees plan a peaceful temple visit by 
            recommending the best time based on crowd predictions and slot 
            availability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[28px] border border-[#FAD6A5]/40 bg-[#FFFBF5]/80 backdrop-blur-md p-8 shadow-[0_20px_45px_rgba(217,119,6,0.08)] hover:shadow-[0_30px_60px_rgba(217,119,6,0.15)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#FAD6A5]/20 blur-3xl opacity-50 group-hover:opacity-80 transition-all" />

              {/* Step Number - Refined for elegance */}
              <div className="absolute top-8 right-8 text-5xl font-black text-[#FAD6A5]/60 select-none">
                {step.number}
              </div>

              {/* Icon */}
              <div className="relative h-16 w-16 rounded-2xl bg-[#FAD6A5]/30 border border-[#FAD6A5]/60 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Icon size={28} className="text-[#92400E]" />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-black text-[#5D3A1A] tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-[#8B7355] min-h-[120px] font-medium">
                  {step.description}
                </p>
              </div>

              {/* Bottom Area */}
              <div className="relative mt-8 pt-6 border-t border-[#FAD6A5]/40 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#92400E]">
                  Step {step.number}
                </span>
                <div className="h-10 w-10 rounded-full bg-[#FAD6A5]/20 border border-[#FAD6A5]/50 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-[#92400E]" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      </div>

    </section>

  );

}