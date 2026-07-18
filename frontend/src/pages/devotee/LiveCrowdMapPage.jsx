import React from "react";
import { motion } from "framer-motion";
import { Brain, Users, Clock3, TrendingUp, Sparkles, MapPin } from "lucide-react";
import crowdMapBanner from "../../assets/images/crowd-map-banner.png";

const IS_MAP_LIVE = false;

export default function EnhancedCrowdMap() {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-slate-900">
        
        {/* Header Block - Consistent with SOS Page */}
        <section className="relative h-[200px] overflow-hidden">
          {/* Background */}
          <img
              src={crowdMapBanner}
              alt="Live Crowd Map"
              className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center px-8">
              <div className="max-w-2xl">
                  <h1
                      className="text-4xl md:text-5xl font-black text-white"
                      style={{
                          textShadow: "0 2px 10px rgba(0,0,0,0.25)",
                      }}
                  >
                      Live Crowd Map
                  </h1>
                  <p className="mt-4 text-[#FFF7EA] text-lg leading-relaxed">
                      View live crowd conditions across the temple premises and plan a smoother, more comfortable Darshan.
                  </p>
              </div>
          </div>
        </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* Architectural View Container */}
        <div className="bg-white rounded-2xl border border-[#f3e3c3] shadow-3xs overflow-hidden min-h-[400px] flex items-center justify-center p-6">
          
          {!IS_MAP_LIVE ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-lg py-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6 border border-amber-100">
                <Sparkles size={36} />
              </div>

              <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">
                Coming Soon
              </span>

              <h2 className="text-2xl font-black text-slate-950">Intelligent Crowd Mapping</h2>
              <p className="text-sm font-medium text-slate-700 mt-3 leading-relaxed">
                We are currently integrating real-time sensor data and AI-navigation models. 
                This feature will allow you to view congestion density and receive 
                optimal path suggestions for a peaceful Darshan.
              </p>
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {/* Map SVG/Canvas component goes here */}
            </div>
          )}
        </div>

        {/* Features Grid - Refined to match SOS Card styles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Users, title: "Live Occupancy", text: "Real-time density analytics per zone." },
            { icon: Clock3, title: "Smart Wait-Times", text: "Estimated queue duration for entry." },
            { icon: TrendingUp, title: "Crowd Heatmaps", text: "Visual guidance on congestion levels." },
            { icon: Brain, title: "AI-Route Planning", text: "Dynamic pathing to avoid heavy crowds." },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-[#f3e3c3] shadow-3xs flex gap-4 items-start">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-[#f3e3c3] text-rose-600 shrink-0">
                <feature.icon size={20} />
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-slate-950 block">{feature.title}</span>
                <p className="text-xs font-medium text-slate-700 leading-snug">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}