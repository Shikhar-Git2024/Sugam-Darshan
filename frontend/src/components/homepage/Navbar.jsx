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
    { label: "Features", target: "#features" },
    { label: "Why Sugam", target: "#why-sugam" },
    { label: "How It Works", target: "#how-it-works" },
    { label: "Contact", target: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] bg-violet-500/10 blur-[100px] pointer-events-none" />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-300 ${isScrolled ? "pt-3" : "pt-6"}`}>
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`
            relative flex items-center justify-between h-20 px-6 rounded-full transition-all duration-300 overflow-visible
            ${isScrolled 
              ? "bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white" 
              : "bg-white/90 backdrop-blur-md border border-white/50 shadow-[0_10px_30px_rgba(15,23,42,0.04)] text-slate-900"
            }
          `}
        >
          {/* Logo & Brand Details */}
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer z-10 select-none shrink-0"
          >
            <img src={logo} alt="Sugam Darshan" className="w-10 h-10 object-contain" />
            <div className="hidden sm:block">
              <h2 className={`font-black text-lg tracking-tight leading-none transition-colors ${isScrolled ? "text-white" : "text-slate-900"}`}>
                Sugam Darshan
              </h2>
              <p className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase mt-1">
                AI Crowd Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Links Grid */}
          <div className="hidden lg:flex items-center gap-1 z-10">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.target}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`
                  relative px-5 py-2.5 text-sm font-semibold tracking-wide rounded-full transition-colors duration-200
                  ${isScrolled ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-950"}
                `}
              >
                <span className="relative z-10">{item.label}</span>
                
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      layoutId="navHoverId"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className={`absolute inset-0 rounded-full -z-0 ${isScrolled ? "bg-slate-800/70" : "bg-slate-100"}`}
                    />
                  )}
                </AnimatePresence>
              </a>
            ))}
          </div>

          {/* Action Callouts */}
          <div className="hidden lg:flex items-center gap-3 z-10">
            <button
              onClick={() => navigate("/devotee/login")}
              className={`
                px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-200
                ${isScrolled 
                  ? "bg-transparent border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900" 
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }
              `}
            >
              Devotee Login
            </button>

            <button
              onClick={() => navigate("/authority/login")}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md transition-all"
            >
              Authority Login
            </button>
          </div>

          {/* Mobile Menu Action Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-full transition-colors ${isScrolled ? "text-slate-300 hover:bg-slate-900" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </motion.nav>
      </div>

      {/* Mobile Sidebar Context Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-slate-950 border-b border-slate-900 px-6 py-8 flex flex-col gap-6 lg:hidden shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.target}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white font-semibold text-base transition-colors py-1.5"
                >
                  {item.label}
                </a>
              ))}
            </div>
            
            <div className="h-[1px] bg-slate-900 w-full" />
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { navigate("/devotee/login"); setMobileMenuOpen(false); }}
                className="w-full py-3.5 rounded-xl border border-slate-800 text-slate-300 font-bold text-sm bg-slate-900/40"
              >
                Devotee Login
              </button>
              <button
                onClick={() => { navigate("/authority/login"); setMobileMenuOpen(false); }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm"
              >
                Authority Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}