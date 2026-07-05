import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Sparkles, Flame, ChevronDown, ChevronUp } from "lucide-react";

const RAMAYAN_CYCLE = [
  {
    shloka: "मङ्गल भवन अमङ्गल हारी।\nद्रवहु सुदसरथ अजिर बिहारी॥",
    translation: "The home of all blessings and the dispeller of all sorrows; may that Lord Rama, who plays in the courtyard of King Dasharatha, bless us.",
    meaning: "This powerful invocation seeks the divine grace of Shri Ram to bring peace, destroy inner anxieties, and fill the devotee's life with righteous joy and spiritual stability.",
    source: "Ramcharitmanas (Bala Kanda)",
    thought: "Shri Ram's grace removes all inner darkness"
  },
  {
    shloka: "राम कृपा नासहिं सब रोगा।\nजौं एहि भाँति बनै संजौगा॥",
    translation: "By the grace of Shri Rama, all afflictions and mental grief disappear instantly if one stays aligned with truth.",
    meaning: "True surrender to the divine acts as a ultimate medicine for the mind. When you align your daily actions with purity, mental stress transforms into lasting strength.",
    source: "Ramcharitmanas (Uttara Kanda)",
    thought: "Devotion heals the restless mind"
  },
  {
    shloka: "जाकी रही भावना जैसी।\nप्रभु मूरति देखी तिन तैसी॥",
    translation: "In whatever mold a person's faith is cast, they perceive the Divine Lord in that very image.",
    meaning: "The universe mirrors your deepest intentions. When you approach your life, your duties, and the temple with pure love, you discover divine grace everywhere.",
    source: "Ramcharitmanas (Bala Kanda)",
    thought: "Purity of heart reveals the divine truth"
  },
  {
    shloka: "धीरज धरम मित्र अरु नारी।\nआपद काल परखिए चारी॥",
    translation: "Patience, righteousness, a true friend, and one's partner—these four are tested only in times of adversity.",
    meaning: "Difficult times are not punishments; they are spiritual mirrors. Remaining calm and keeping your moral values steady during hardships shapes exceptional character.",
    source: "Ramcharitmanas (Aranya Kanda)",
    thought: "Patience is the anchor of character"
  },
  {
    shloka: "हरि अनन्त हरी कथा अनन्ता।\nकहहिं सुनहिं बहुबिधि सब संता॥",
    translation: "Infinite is the Divine Lord and endless are His sacred stories, sung and contemplated in diverse ways by enlightened souls.",
    meaning: "Divine wisdom cannot be locked into a single rigid perspective. Embrace life with continuous wonder, open learning, and deep humility toward the vast universe.",
    source: "Ramcharitmanas (Bala Kanda)",
    thought: "Wisdom is vast—stay humble and learn"
  },
  {
    shloka: "जहाँ सुमति तहँ संपति नाना।\nजहाँ कुमति तहँ बिपति निदाना॥",
    translation: "Where there is wisdom and unity, all prosperity abounds; where there is discord and ill-intent, hardships follow.",
    meaning: "A beautiful life is built on clear thinking and mutual respect. Keeping a positive, clean mindset naturally attracts health, harmony, and smooth progress.",
    source: "Ramcharitmanas (Sundara Kanda)",
    thought: "Right thinking brings internal wealth"
  },
  {
    shloka: "रघुकुल रीत सदा चलि आई।\nप्रान जाहु बरु बचनु न जाई॥",
    translation: "The timeless tradition of the Raghu clan dictates that integrity is valued far above life itself.",
    meaning: "True honor lies in unwavering integrity. Commit to your responsibilities completely and let your word be a rock-solid foundation that others can always rely on.",
    source: "Ramcharitmanas (Ayodhya Kanda)",
    thought: "Integrity is the highest duty"
  }
];

export default function DailyInspiration({ spiritualContent = null, onSaveFavorite = null }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dailyChaupai = useMemo(() => {
    if (spiritualContent?.shloka || spiritualContent?.verse) {
      return {
        shloka: spiritualContent.shloka || spiritualContent.verse,
        translation: spiritualContent.translation || "",
        meaning: spiritualContent.meaning || "",
        source: spiritualContent.source || "Ramcharitmanas",
        thought: spiritualContent.thought || "Jai Shri Ram."
      };
    }
    const dayIndex = new Date().getDay(); 
    return RAMAYAN_CYCLE[dayIndex];
  }, [spiritualContent]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    if (onSaveFavorite) onSaveFavorite(dailyChaupai);
  };

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full bg-gradient-to-br from-white via-[#FFFDF8] to-white border border-amber-100/60 p-6 rounded-2xl relative text-left transition-all duration-300 shadow-2xs hover:shadow-lg hover:border-orange-200/80 hover:-translate-y-1"
    >
      {/* Decorative Aura Background Elements */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Floating Sparkle/Particle Effects on Hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div 
              initial={{ opacity: 0, x: 10, y: 10 }}
              animate={{ opacity: 0.6, x: 0, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-16 text-amber-400 pointer-events-none"
            >
              <Sparkles size={14} className="animate-pulse" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -10, y: -10 }}
              animate={{ opacity: 0.5, x: 0, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-6 text-orange-400 pointer-events-none"
            >
              <Sparkles size={12} className="animate-ping" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header Info Panel Layout */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-50 border border-amber-100/40 text-[#ea580c] rounded-lg">
            <Flame size={15} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm tracking-tight m-0">
              Today's Chaupai
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-wider block text-slate-400 m-0 mt-0.5">
              Sri Ramcharitmanas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-widest bg-orange-50 text-amber-800 border border-amber-200/60 px-2.5 py-0.5 rounded-full uppercase hidden sm:inline-block">
            Daily Inspiration
          </span>
          <button
            onClick={handleFavoriteClick}
            className="p-1.5 rounded-lg border border-slate-200/60 bg-slate-50/80 text-slate-400 hover:text-slate-700 hover:bg-white transition cursor-pointer"
          >
            <Bookmark size={13} fill={isFavorited ? "#ea580c" : "none"} className={isFavorited ? "text-[#ea580c]" : ""} />
          </button>
        </div>
      </div>

      {/* Central Content Panel Grid Container */}
      <div className="space-y-4">
        
        {/* Sanskrit Text Centerpiece Box Container with Radiant Soft Gold Glow */}
        <motion.div 
          animate={{ 
            boxShadow: isHovered 
              ? "0 0 20px 2px rgba(245, 158, 11, 0.25)" 
              : "0 1px 2px 0 rgba(0, 0, 0, 0.05)" 
          }}
          transition={{ duration: 0.3 }}
          className="w-full p-5 bg-[#fffbeb] border border-[#f3e3c3] rounded-xl relative transition-all"
        >
          {/* Subtle Inner Glow Layer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/5 via-transparent to-orange-500/5 rounded-xl pointer-events-none" />
          
          <p className="font-serif text-lg md:text-xl font-black leading-loose tracking-wide text-center text-amber-950 m-0 whitespace-pre-line relative z-10 drop-shadow-[0_1px_1px_rgba(251,191,36,0.15)]">
            {dailyChaupai.shloka}
          </p>
        </motion.div>

        {/* Subtle Section Break Divider Component Layout */}
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="h-[1px] bg-amber-200/60 flex-1" />
          <Sparkles size={12} className="text-[#ea580c]/50 shrink-0" />
          <div className="h-[1px] bg-amber-200/60 flex-1" />
        </div>

        {/* Localized Verse Translations Block */}
        {dailyChaupai.translation && (
          <div className="space-y-1.5">
            <p className="text-xs md:text-sm font-semibold tracking-tight leading-relaxed italic text-slate-600 border-l-2 border-[#ea580c] pl-3 m-0">
              "{dailyChaupai.translation}"
            </p>
            {dailyChaupai.source && (
              <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-400 pl-3">
                — {dailyChaupai.source}
              </span>
            )}
          </div>
        )}

      </div>

      {/* Footer Navigation Tray Grid Area */}
      <div className="mt-5 pt-3 border-t border-slate-100/80 flex flex-row items-center justify-between gap-3">
        
        <div className="text-xs font-black tracking-widest text-[#ea580c] flex items-center gap-1.5 cursor-default select-none">
          <span>🙏</span>
          <span>JAI SHRI RAM</span>
        </div>

        {dailyChaupai.meaning && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#ea580c] transition-colors cursor-pointer border-0 bg-transparent"
          >
            <span>{isExpanded ? "Hide Meaning" : "View Full Meaning"}</span>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>

      {/* Collapsible Meta Commentary Engine Segment */}
      <AnimatePresence>
        {isExpanded && dailyChaupai.meaning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium leading-relaxed text-slate-600 text-justify">
              {dailyChaupai.meaning}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}