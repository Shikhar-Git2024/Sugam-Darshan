import footerBg from "../../assets/SpiritualGuide/dailyHub/quote-bg.png";
import { Quote, Sparkles } from "lucide-react";

export default function DailyWisdomFooter() {

  return (

    <section className="mt-8">

      <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50 via-amber-50 to-white shadow-md">

        <img
          src={footerBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="relative z-10 px-8 py-6">

          <div className="flex items-center gap-2 text-orange-600">

            <Quote size={18} />

            <span className="text-xs font-bold uppercase tracking-[0.18em]">

              Daily Divine Wisdom

            </span>

          </div>

          <h2 className="mt-4 text-3xl font-bold text-slate-800">

            धर्मो रक्षति रक्षितः

          </h2>

          <p className="mt-3 max-w-2xl text-base italic text-slate-600">

            "He who protects righteousness is protected by righteousness."

          </p>

          <div className="mt-5 flex items-center justify-between">

            <span className="font-medium text-orange-600">

              — Manusmriti

            </span>

            <div className="flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">

              <Sparkles size={15} />

              May Lord Shri Ram Bless You

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}