import tipsBg from "../../assets/SpiritualGuide/dailyHub/tips-bg.png";

import { spiritualTips } from "../../data/SpiritualGuide/dailyHubData";

import {
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function SpiritualTipsCard() {

  return (

    <div id="pilgrim-guide" className="flex h-[520px] flex-col rounded-3xl border border-green-100 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* ================= Header ================= */}

      <div className="mb-4 flex items-center gap-3">

        <div className="rounded-xl bg-green-100 p-3 text-green-600">

          <Leaf size={20} />

        </div>

        <div>

          <h3 className="font-bold text-green-700">

            Pilgrim Guide

          </h3>

          <p className="text-sm text-slate-500">

            Prepare • Respect • Experience

          </p>

        </div>

      </div>

      {/* ================= Banner ================= */}

      <div className="mb-4 overflow-hidden rounded-2xl">

        <img
          src={tipsBg}
          alt="Pilgrim Guide"
          className="h-20 w-full object-cover transition duration-500 hover:scale-105"
        />

      </div>

      {/* ================= Tips ================= */}

      <div className="flex-1 space-y-1.5">

        {spiritualTips.map((tip) => (

          <div
            key={tip.id}
            className="group flex items-start gap-3 rounded-xl border border-green-100 px-3 py-1.5 transition-all duration-300 hover:bg-green-50 hover:shadow-sm"
          >

            <div className="mt-0.5 rounded-full bg-green-100 p-1.5 text-green-600">

              <ShieldCheck size={18} />

            </div>

            <div>

              <h4 className="text-[11] font-semibold text-slate-800 transition group-hover:text-green-700">

                {tip.title}

              </h4>

              <p className="text-[13px] leading-4 text-slate-500">

                {tip.subtitle}

              </p>

            </div>

          </div>

        ))}

      </div>

      {/* ================= Footer ================= */}

      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-50 py-2 text-sm font-semibold text-green-700">

        <Sparkles size={15} />

        Plan Smart • Pray Peacefully

      </div>

    </div>

  );

}