import React from "react";
import { Shirt, AlertCircle, Info, Printer, Lightbulb, FileCheck } from "lucide-react";

export default function TempleGuidelines() {
  return (
    <div className="w-full bg-gradient-to-br from-white to-[#FFF6ED]/30 border border-amber-100/60 p-6 rounded-2xl shadow-2xs space-y-5 print:bg-white print:border-none print:p-0 text-left">
      
      {/* ==================== 1. COMPACT HEADER BLOCK ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 print:hidden">
        <div className="space-y-0.5">
          <h2 className="font-bold text-slate-900 text-sm md:text-base tracking-tight m-0">
            Temple Guidelines
          </h2>
          <p className="text-xs font-semibold text-slate-500 m-0 pt-0.5">
            Please follow these guidelines for a smooth Darshan experience.
          </p>
        </div>
        
        <button 
          onClick={() => window.print()}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition shadow-3xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Printer size={11} className="text-[#ea580c]" />
          <span>Download / Print</span>
        </button>
      </div>

      {/* ==================== 2. TWO-BY-TWO GRID MATRIX LAYOUT ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* DRESS CODE CATEGORY */}
        <div className="p-4 bg-[#fffdf8] border border-[#f3e3c3] rounded-xl space-y-2.5 hover:border-orange-200 hover:bg-[#fffbeb] transition-all duration-200 shadow-3xs">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs md:text-sm">
            <div className="p-1.5 bg-emerald-50 rounded-lg"><Shirt size={14} /></div>
            <h3 className="m-0 text-slate-900 font-extrabold text-sm">Dress Code</h3>
          </div>
          <ul className="text-xs font-semibold text-slate-600 space-y-1.5 list-none pl-0 m-0 leading-normal">
            <li className="flex items-start gap-2">
              <span className="text-[#ea580c] mt-0.5">•</span>
              <span>Wear clean and modest clothing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ea580c] mt-0.5">•</span>
              <span>Remove footwear before entering the temple.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ea580c] mt-0.5">•</span>
              <span>Dress respectfully while visiting.</span>
            </li>
          </ul>
        </div>

        {/* REQUIRED DOCUMENTS CATEGORY */}
        <div className="p-4 bg-[#fffdf8] border border-[#f3e3c3] rounded-xl space-y-2.5 hover:border-orange-200 hover:bg-[#fffbeb] transition-all duration-200 shadow-3xs">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs md:text-sm">
            <div className="p-1.5 bg-blue-50 rounded-lg"><FileCheck size={14} /></div>
            <h3 className="m-0 text-slate-900 font-extrabold text-sm">Required Documents</h3>
          </div>
          <ul className="text-xs font-semibold text-slate-600 space-y-1.5 list-none pl-0 m-0 leading-normal">
            <li className="flex items-start gap-2">
              <span className="text-[#ea580c] mt-0.5">•</span>
              <span>Carry a valid Government-issued ID card.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ea580c] mt-0.5">•</span>
              <span>Keep your booking confirmation ready for verification.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ea580c] mt-0.5">•</span>
              <span>Digital copies on smartphones are fully acceptable.</span>
            </li>
          </ul>
        </div>

        {/* PROHIBITED ITEMS CATEGORY */}
        <div className="p-4 bg-[#fffdf8] border border-rose-200 rounded-xl space-y-2.5 hover:border-orange-200 hover:bg-[#fffbeb] transition-all duration-200 shadow-3xs">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs md:text-sm">
            <div className="p-1.5 bg-rose-50 rounded-lg"><AlertCircle size={14} /></div>
            <h3 className="m-0 text-slate-900 font-extrabold text-sm">Strictly Prohibited</h3>
          </div>
          <ul className="text-xs font-semibold text-slate-600 space-y-1.5 list-none pl-0 m-0 leading-normal">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-0.5">•</span>
              <span>Photography is not allowed inside restricted areas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-0.5">•</span>
              <span>Tobacco, alcohol and smoking are prohibited.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-0.5">•</span>
              <span>Carrying weapons or dangerous items is strictly prohibited.</span>
            </li>
          </ul>
        </div>

        {/* PRACTICAL DARSHAN TIPS */}
        <div className="p-4 bg-[#fffdf8] border border-[#f3e3c3] rounded-xl space-y-2.5 hover:border-orange-200 hover:bg-[#fffbeb] transition-all duration-200 shadow-3xs">
          <div className="flex items-center gap-2 text-orange-700 font-bold text-xs md:text-sm">
            <div className="p-1.5 bg-orange-50 rounded-lg"><Lightbulb size={14} /></div>
            <h3 className="m-0 text-slate-900 font-extrabold text-sm">Helpful Tips</h3>
          </div>
          <ul className="text-xs font-semibold text-slate-600 space-y-1.5 list-none pl-0 m-0 leading-normal">
            <li className="flex items-start gap-2">
              <span className="text-[#ea580c] mt-0.5">•</span>
              <span>Arrive at least 15 minutes before your booked slot.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ea580c] mt-0.5">•</span>
              <span>Keep your booking pass and a valid ID ready.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ea580c] mt-0.5">•</span>
              <span>Use the cloakroom facility for restricted items.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* ==================== 3. CONTEXTUAL COMPLIANCE FOOTER ==================== */}
      <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500 print:hidden">
        <p className="m-0 leading-relaxed max-w-xl">
          Need assistance during your visit? Visit the <strong className="text-slate-700 font-bold">Temple Help Desk</strong> or use the <strong className="text-[#ea580c] font-bold">Emergency SOS</strong> feature in the app.
        </p>
      </div>
      
    </div>
  );
}