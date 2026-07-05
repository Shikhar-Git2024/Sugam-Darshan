import React, { useEffect } from "react";
import { useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { CheckCircle2, Home, CalendarCheck, Info, ShieldCheck, Compass, Download } from "lucide-react";

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  // Auto-scroll viewport cleanly to the top on page initialization
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If no booking data exists, safely redirect to dashboard
  if (!bookingData) return <Navigate to="/devotee/dashboard" />;

  // Destructure available fields safely, including layout selections passed from state context
  const { booking_id, transaction_id, status, visitDate, slot } = bookingData;

  // Automated client-side HTML pass generation and direct download
  const handleDownloadPass = () => {
    const passHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sugam Darshan Pass</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #fffdf6; color: #334155; padding: 24px; display: flex; justify-content: center; margin: 0; }
    .card { background: white; border: 2px solid #f3e3c3; border-radius: 24px; padding: 32px; max-w: 420px; w: 100%; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); box-sizing: border-box; }
    .header { text-align: center; border-bottom: 2px dashed #f3e3c3; padding-bottom: 20px; margin-bottom: 20px; }
    .title { color: #ea580c; font-size: 22px; font-weight: 900; margin: 0; uppercase; tracking-wider; }
    .status { background: #f0fdf4; color: #166534; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 6px; border: 1px solid #bbf7d0; display: inline-block; margin-top: 8px; letter-spacing: 0.05em; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; font-size: 14px; border-bottom: 1px solid #fffdf6; }
    .label { color: #475569; font-weight: bold; font-size: 12px; uppercase; tracking-wide; }
    .value { color: #0f172a; font-weight: 800; text-align: right; }
    .highlight { color: #b45309; }
    .footer { font-size: 12px; color: #475569; text-align: left; margin-top: 24px; padding-top: 16px; border-top: 2px dashed #f3e3c3; line-height: 1.6; background: #fffbeb; padding: 12px; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 class="title">Sugam Darshan Pass</h2>
      <span class="status">${status || "CONFIRMED"}</span>
    </div>
    <div class="row"><span class="label">Booking ID</span><span class="value">${booking_id}</span></div>
    <div class="row"><span class="label">Visit Date</span><span class="value">${visitDate || "N/A"}</span></div>
    <div class="row"><span class="label">Time Slot</span><span class="value highlight">${slot || "N/A"}</span></div>
    <div class="row"><span class="label">Transaction ID</span><span class="value" style="font-size:11px; font-family: monospace; word-break: break-all;">${transaction_id || "Direct Allocation"}</span></div>
    <div class="footer">
      <strong style="color: #ea580c; display: block; margin-bottom: 4px;">Important Information:</strong>
      Please reach the entry checkpoint gate 15 minutes prior to your slot window with a valid identification card.
    </div>
  </div>
</body>
</html>`;

    // Convert raw HTML layout string into a browser-downloadable data blob object
    const element = document.createElement("a");
    const file = new Blob([passHtmlContent], { type: "text/html;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Sugam_Darshan_Pass_${booking_id || "Ticket"}.html`;
    
    // Append to document, execute direct disk drop trigger, and clean trace footprints
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-gradient-to-b from-[#FFFDF8] via-[#FFF9F2] to-[#F8FAFC] w-full p-4 md:p-8 flex items-center justify-center antialiased selection:bg-orange-100 text-slate-800 text-left">
      <div className="max-w-2xl w-full space-y-6">

        {/* ==================== 1. FINAL PROGRESS INDICATOR ==================== */}
        <div className="w-full bg-white rounded-xl border border-[#f3e3c3] p-4 shadow-xs max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative px-6 md:px-12">
            <div className="absolute left-12 right-12 top-4 h-[2px] bg-[#f3e3c3] z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-[#ea580c] text-white flex items-center justify-center shadow-sm ring-4 ring-[#fffbeb]">
                <CheckCircle2 size={16} className="stroke-[3]" />
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-600">
                Plan Visit
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-[#ea580c] text-white flex items-center justify-center shadow-sm ring-4 ring-[#fffbeb]">
                <CheckCircle2 size={16} className="stroke-[3]" />
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-600">
                Booking
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-black text-sm shadow-sm ring-4 ring-[#fffbeb]">
                3
              </div>
              <span className="mt-2 text-xs font-bold text-slate-900">
                Confirmation
              </span>
            </div>

          </div>
        </div>

        {/* ==================== MAIN SUCCESS DISPLAY CARD ==================== */}
        <div className="bg-white border border-[#f3e3c3] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          
          {/* Success Badge */}
          <div className="w-20 h-24 mx-auto rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-3xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          {/* Heading and Success Celebration Text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight m-0">Booking Confirmed</h1>
            <div className="space-y-1">
              <p className="text-sm md:text-base font-bold text-slate-800 m-0">
                Your Darshan has been booked successfully. We look forward to welcoming you at the temple.
              </p>
              <p className="text-xs font-medium text-slate-500 m-0">
                Thank you for choosing Sugam Darshan. We wish you a peaceful and comfortable visit.
              </p>
            </div>
          </div>

          {/* ==================== HORIZONTAL SUMMARY ROW / GRID ==================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Booking ID Pass */}
            <div className="p-3.5 bg-gradient-to-b from-[#FFFDF8] to-[#FFF9F2] border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Booking ID</span>
              <span className="text-sm font-black text-slate-900 truncate">{booking_id}</span>
            </div>

            {/* Visit Date Pass */}
            <div className="p-3.5 bg-gradient-to-b from-[#FFFDF8] to-[#FFF9F2] border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Visit Date</span>
              <span className="text-sm font-black text-slate-900">{visitDate || "Checked Card Pass"}</span>
            </div>

            {/* Time Slot Pass */}
            <div className="p-3.5 bg-gradient-to-b from-[#FFFDF8] to-[#FFF9F2] border border-[#f3e3c3] rounded-xl flex flex-col justify-between h-20 shadow-3xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Time Slot</span>
              <span className="text-sm font-black text-amber-700 truncate">{slot || "Checked Card Pass"}</span>
            </div>

          </div>

          {/* Transaction Metadata Log Box */}
          <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 truncate">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-3xs shrink-0 text-slate-500">
                <ShieldCheck size={14} />
              </div>
              <div className="truncate">
                <span className="text-slate-500 font-bold block uppercase tracking-wider text-[9px]">Transaction ID</span>
                <span className="font-extrabold text-slate-700 truncate block max-w-[280px]">{transaction_id || "System Allocated"}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-slate-500 font-bold block uppercase tracking-wider text-[9px]">Booking Status</span>
              <span className="font-black text-emerald-700 tracking-wide uppercase text-[11px]">{status || "CONFIRMED"}</span>
            </div>
          </div>

          {/* ==================== IMPROVED INFORMATION TRAY ==================== */}
          <div className="bg-[#fffbeb] border border-[#f3e3c3] p-5 rounded-2xl space-y-3 shadow-3xs">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs uppercase tracking-wider">
              <Info size={15} className="text-[#ea580c]" />
              Important Information
            </div>
            <ul className="text-xs font-semibold text-slate-600 space-y-2 pl-0 m-0 list-none text-left">
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] font-black">•</span>
                <span>Arrive 15 minutes before your selected slot window for validation procedures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] font-black">•</span>
                <span>Carry a valid identification card to present at checkpoint terminals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] font-black">•</span>
                <span>You can view or download your digital pass details at any point inside your account logs.</span>
              </li>
            </ul>
          </div>

          {/* ==================== ACTIONS AREA CONTROL ==================== */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/devotee/my-bookings")}
                className="w-full py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs tracking-widest transition uppercase border-0 shadow-xs flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.995]"
              >
                <CalendarCheck size={16} />
                View My Bookings
              </button>
              
              <button
                onClick={handleDownloadPass}
                className="w-full py-3.5 rounded-xl border-2 border-[#ea580c] bg-transparent text-[#ea580c] hover:bg-[#fffbeb] font-black text-xs tracking-widest transition uppercase flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.995]"
              >
                <Download size={16} />
                Download Pass
              </button>
            </div>

            <button
              onClick={() => navigate("/devotee/dashboard")}
              className="w-full py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-extrabold text-xs tracking-widest hover:bg-slate-100 hover:text-slate-900 transition uppercase flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-[0.995]"
            >
              <Home size={14} />
              Return to Dashboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}