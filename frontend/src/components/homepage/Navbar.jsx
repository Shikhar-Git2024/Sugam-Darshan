import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", target: "#top" },
    { label: "Platform", target: "#features" },
    { label: "Why Sugam", target: "#why-sugam" },
    { label: "AI Journey", target: "#how-it-works" },
    { label: "Get Started", target: "#contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Background glow effect */}
      <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">

  <div className="w-[700px] h-[220px] rounded-full bg-gradient-to-r from-orange-300/20 via-violet-400/10 to-indigo-400/20 blur-[120px]" />

</div>

      <div
  className={`max-w-[1440px] mx-auto px-5 sm:px-8 transition-all duration-500 ${
    isScrolled ? "pt-3" : "pt-6"
  }`}
>
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`
relative
flex
items-center
justify-between
h-20
px-8
rounded-full
transition-all
duration-500
overflow-visible

${
isScrolled
? "bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
: "bg-white/75 backdrop-blur-2xl border border-white/70 shadow-[0_15px_45px_rgba(15,23,42,0.08)]"
}
`}
        >
          {/* Logo & Brand Details */}
          
<motion.div
  onClick={() => navigate("/")}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
  className="flex items-center gap-4 cursor-pointer z-20 select-none shrink-0"
>
  <div className="relative">

    <div className="absolute inset-0 rounded-full bg-orange-400/20 blur-xl scale-150" />

    <div
  className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500 overflow-hidden ${
    isScrolled
      ? "bg-white/10 border border-white/10"
      : "bg-white border-2 border-orange-200 shadow-xl"
  }`}
>
  <img
    src={logo}
    alt="Sugam Darshan"
    className="w-25 h-25 object-contain scale-125"
  />
</div>

  </div>

  <div className="hidden sm:flex flex-col">

    <h2
      className={`text-2xl font-black tracking-normal transition-colors duration-300 ${
        isScrolled ? "text-white" : "text-slate-900"
      }`}
    >
      Sugam Darshan
    </h2>

    <span
      className={`text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
        isScrolled
          ? "text-orange-300"
          : "text-orange-700"
      }`}
    >
      Smart Pilgrimage Platform
    </span>

  </div>
</motion.div>

          {/* Desktop Links Grid */}
          
<div className="hidden lg:flex items-center">

  <div
    className={`relative flex items-center gap-1 rounded-full px-2 py-2 transition-all duration-500 ${
      isScrolled
        ? "bg-white/5 border border-white/10"
        : "bg-slate-100/70 border border-white"
    }`}
  >
    {navItems.map((item, index) => (
      <a
        key={item.label}
        href={item.target}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        className={`
          relative
          overflow-hidden
          rounded-full
          px-6
          py-3
          text-[15px]
          font-bold
          tracking-wide
          transition-all
          duration-300

          ${
            isScrolled
              ? "text-slate-300 hover:text-white"
              : "text-slate-700 hover:text-orange-700"
          }
        `}
      >
        <span className="relative z-20">
          {item.label}
        </span>

        <AnimatePresence>
          {hoveredIndex === index && (
            <motion.span
              layoutId="premiumNavHover"
              initial={{
                opacity: 0,
                scale: 0.92
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 26
              }}
              className={`absolute inset-0 rounded-full ${
                isScrolled
                  ? "bg-gradient-to-r from-orange-500/15 via-orange-400/10 to-yellow-400/15 border border-orange-400/20"
                  : "bg-white shadow-lg"
              }`}
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-1 left-5 right-5 h-[2px] origin-left rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400"
        />
      </a>
    ))}
  </div>

</div>


          {/* Action Callouts */}
          
<div className="hidden lg:flex items-center gap-3 z-20">

  {/* Devotee */}
  <motion.button
    whileHover={{
      y: -2,
      scale: 1.02
    }}
    whileTap={{
      scale: 0.98
    }}
    transition={{
      duration: 0.2
    }}
    onClick={() => navigate("/devotee/login")}
    className={`
      group
      flex
      flex-col
      items-start
      rounded-3xl
      px-5
      py-2
      border
      transition-all
      duration-300

      ${
        isScrolled
          ? "bg-white/5 border-white/10 hover:bg-white/10"
          : "bg-white border-slate-200 hover:border-orange-300 hover:shadow-xl"
      }
    `}
  >

    <span
      className={`font-bold text-base ${
        isScrolled ? "text-white" : "text-slate-900"
      }`}
    >
      Devotee Portal
    </span>

    <span
      className={`text-xs mt-1 ${
        isScrolled
          ? "text-slate-400"
          : "text-slate-500"
      }`}
    >
      Book • Track • Explore
    </span>

  </motion.button>

  {/* Authority */}
  <motion.button
    whileHover={{
      y: -2,
      scale: 1.03
    }}
    whileTap={{
      scale: 0.98
    }}
    transition={{
      duration: 0.2
    }}
    onClick={() => navigate("/authority/login")}
    className="group relative overflow-hidden rounded-3xl px-4 py-2.5 text-white bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 shadow-[0_15px_35px_rgba(245,158,11,0.35)]"
  >

    {/* Shine Animation */}
    <motion.div
      initial={{
        x: "-120%"
      }}
      whileHover={{
        x: "220%"
      }}
      transition={{
        duration: 0.8
      }}
      className="absolute inset-y-0 w-10 bg-white/30 blur-md rotate-12"
    />

    <div className="relative z-10 flex flex-col items-start">

      <span className="font-bold text-sm">
        Authority Portal
      </span>

      <span className="text-[12px] text-white/80 mt-1">
        Lead • Monitor • Assess
      </span>

    </div>

  </motion.button>

</div>

          {/* Mobile Menu Action Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-full transition-colors ${
              isScrolled ? "text-slate-300 hover:bg-slate-900" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </motion.nav>
      </div>

      {/* Mobile Sidebar Context Dropdown */}
      {/* Premium Mobile Menu */}
<AnimatePresence>
  {mobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="absolute top-[105%] left-4 right-4 lg:hidden"
    >
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.45)]">

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-white/10">

          <h3 className="text-lg font-bold text-white">
            Sugam Darshan
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Smart Pilgrimage Platform
          </p>

        </div>

        {/* Navigation */}
        <div className="p-5 space-y-2">

          {navItems.map((item) => (
            <motion.a
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.98 }}
              key={item.label}
              href={item.target}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-2xl px-4 py-4 text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <span className="font-semibold">
                {item.label}
              </span>

              <span className="text-orange-400">
                →
              </span>

            </motion.a>
          ))}

        </div>

        {/* Divider */}

        <div className="mx-6 h-px bg-white/10" />

        {/* Buttons */}

        <div className="p-5 space-y-4">

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              navigate("/devotee/login");
              setMobileMenuOpen(false);
            }}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:bg-white/10"
          >
            <div className="font-bold text-white">
              Devotee Portal
            </div>

            <div className="text-sm text-slate-400 mt-1">
              Book • Track • Explore
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              navigate("/authority/login");
              setMobileMenuOpen(false);
            }}
            className="relative overflow-hidden w-full rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-4 text-left shadow-[0_15px_40px_rgba(245,158,11,0.35)]"
          >
            <motion.div
              initial={{ x: "-120%" }}
              whileHover={{ x: "220%" }}
              transition={{ duration: 0.8 }}
              className="absolute inset-y-0 w-12 bg-white/30 blur-md rotate-12"
            />

            <div className="relative z-10">

              <div className="font-bold text-white">
                Authority Portal
              </div>

              <div className="text-sm text-white/80 mt-1">
                Manage Crowd AI
              </div>

            </div>

          </motion.button>

        </div>

      </div>
    </motion.div>
  )}
</AnimatePresence>
    </header>
  );
}