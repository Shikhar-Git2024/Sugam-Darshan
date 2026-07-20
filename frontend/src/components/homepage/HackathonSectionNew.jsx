/*import { motion } from "framer-motion";*/

import HackathonHero from "./HackathonHero";
import HackathonTimeline from "./HackathonTimeline";
import HackathonGallery from "./HackathonGallery";
import HackathonFooter from "./HackathonFooter";

export default function HackathonSectionNew() {
  return (
    <section
      id="achievements"
      className="relative overflow-hidden bg-slate-950 py-32 text-white"
    >
      {/* Background */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-40 pointer-events-none" />

      <div className="absolute left-[-120px] top-[-120px] w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[180px]" />

      <div className="absolute right-[-120px] bottom-[-120px] w-[700px] h-[700px] rounded-full bg-violet-500/10 blur-[220px]" />

      <div className="relative mx-auto max-w-[1450px] px-6 flex flex-col gap-4">

        <HackathonHero />

        <section
    className="
    mt-10
    grid
    gap-6
    lg:grid-cols-[1fr_1.35fr]
    "
>

    <HackathonTimeline />

    <HackathonGallery />

</section>

        <HackathonFooter />

      </div>

    </section>
  );
}