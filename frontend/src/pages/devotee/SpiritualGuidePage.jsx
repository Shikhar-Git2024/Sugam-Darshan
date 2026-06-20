import { motion } from "framer-motion";
import {
  BookOpen, Clock3, Landmark, Sparkles, PlayCircle, Heart, ChevronRight
} from "lucide-react";

export default function SpiritualGuidePage() {
  const aartiTimings = [
    { name: "Mangala Aarti", time: "6:30 AM" },
    { name: "Shringar Aarti", time: "8:00 AM" },
    { name: "Rajbhog Aarti", time: "12:00 PM" },
    { name: "Sandhya Aarti", time: "7:00 PM" },
    { name: "Shayan Aarti", time: "10:00 PM" },
  ];

  const facts = [
    "Ram Mandir is built in Nagara architectural style.",
    "The temple is dedicated to Shri Ram Lalla.",
    "The structure is built primarily using sandstone.",
    "The temple complex includes multiple mandaps and shrines.",
  ];

  const architecture = ["Garbh Griha", "Nritya Mandap", "Rang Mandap", "Kirtan Mandap", "Parikrama Path", "Temple Gardens"];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Spiritual Guide</h1>
          <p className="mt-2 text-slate-500">Your digital companion for a meaningful pilgrimage.</p>
        </motion.header>

        {/* Thought of the Day */}
        <div className="bg-gradient-to-br from-amber-700 via-orange-800 to-red-900 text-white rounded-3xl p-8 shadow-lg">
          <Sparkles className="text-amber-300 mb-4" size={32} />
          <h2 className="text-2xl font-bold">Today's Spiritual Thought</h2>
          <p className="mt-4 text-xl font-serif italic text-amber-50">"The greatest strength is righteousness and devotion."</p>
        </div>

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* History */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4 text-orange-800">
              <BookOpen size={24} />
              <h2 className="text-2xl font-bold">Temple History</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Shri Ram Janmabhoomi Temple stands at the sacred birthplace of Lord Rama in Ayodhya. 
              The temple represents centuries of faith, devotion and cultural heritage.
            </p>
          </div>

          {/* Architecture */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 text-orange-800">
              <Landmark size={24} />
              <h2 className="text-2xl font-bold">Architecture</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {architecture.map((item, i) => (
                <div key={i} className="text-sm bg-slate-50 border border-slate-100 p-3 rounded-xl font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aarti & Facts Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 text-green-700">
              <Clock3 size={24} />
              <h2 className="text-2xl font-bold">Aarti Timings</h2>
            </div>
            <div className="space-y-3">
              {aartiTimings.map((a, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl hover:bg-amber-50 transition-colors">
                  <span className="font-semibold text-slate-700">{a.name}</span>
                  <span className="text-orange-800 font-bold">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 text-red-600">
              <Heart size={24} />
              <h2 className="text-2xl font-bold">Ramayana Facts</h2>
            </div>
            <ul className="space-y-4">
              {facts.map((fact, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                  <ChevronRight size={18} className="text-orange-500 shrink-0 mt-0.5" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6 text-slate-900">
            <PlayCircle size={24} className="text-red-500" />
            <h2 className="text-2xl font-bold">Spiritual Videos</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden shadow-md">
                <iframe
                  className="w-full aspect-video"
                  src="https://www.youtube.com/embed/jNQXAC9IVRw"
                  title="Spiritual Video"
                  allowFullScreen
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}