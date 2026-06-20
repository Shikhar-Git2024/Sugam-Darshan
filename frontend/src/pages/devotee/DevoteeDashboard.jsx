import DashboardNavbar from "../../components/devotee/DashboardNavbar";
import WelcomeSection from "../../components/devotee/WelcomeSection";
import UpcomingVisitCard from "../../components/devotee/UpcomingVisitCard";
import RecentNotifications from "../../components/devotee/RecentNotifications";

import { motion } from "framer-motion";
import { CameraOff, VolumeX, HeartHandshake, ShieldCheck } from "lucide-react";
const TempleGuidelines = () => {
  const rules = [
    { icon: CameraOff, title: "No Photography", desc: "Prohibited in sanctum." },
    { icon: VolumeX, title: "Maintain Silence", desc: "Keep noise levels low." },
    { icon: HeartHandshake, title: "Dress Modestly", desc: "Traditional attire required." },
    { icon: ShieldCheck, title: "Security Check", desc: "Cooperate with staff." }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mt-8"
    >
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        Temple Code of Conduct
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {rules.map((rule, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl transition-colors hover:bg-violet-50/50"
          >
            <div className="p-3 bg-white rounded-xl shadow-sm text-violet-600">
              <rule.icon size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{rule.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{rule.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default function DevoteeDashboard() {
  return (
    <>
      <DashboardNavbar />

      <main className="ml-72">
        <WelcomeSection />
        <UpcomingVisitCard />
        <RecentNotifications />
        <TempleGuidelines />
      </main>
    </>
  );
}