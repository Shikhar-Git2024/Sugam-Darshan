import React from "react";
import { 
  Sun, Users, Clock, Droplets, Wind, Thermometer 
} from "lucide-react";

export default function DashboardOverview({
  weather = null,
  crowd = null,
  loadingStates = {},
  errorStates = {},
  onRetryWeather,
  onRetryCrowd
}) {

  // Dynamic text color configuration matching backend status values
  const getCrowdColorClass = (status) => {
    const normalized = String(status || "").toUpperCase();
    if (normalized === "LOW" || normalized === "OPEN") return "text-emerald-600";
    if (normalized === "MODERATE" || normalized === "NORMAL") return "text-amber-600";
    if (normalized === "HIGH" || normalized === "BUSY" || normalized === "CRITICAL") return "text-red-600";
    return "text-slate-700";
  };

  // Logic to determine instant real-time advice card helper
  const getLiveRecommendation = () => {
    const status = String(crowd?.status || "NORMAL").toUpperCase();
    const waitTime = crowd?.wait_time ?? 15;

    if (status === "LOW" || status === "OPEN") {
      return {
        banner: "🟢 Good Time to Visit",
        desc: `Crowd density is optimal right now. Expect a swift queue with an estimated waiting time of around ${waitTime} minutes.`
      };
    }
    if (status === "HIGH" || status === "BUSY" || status === "CRITICAL") {
      return {
        banner: "🔴 Peak Hours Active",
        desc: "The temple is currently experiencing high visitor traffic. If possible, consider scheduling your visit for later in the evening."
      };
    }
    return {
      banner: "🟡 Moderate Crowd Flow",
      desc: `Normal queue progression with a standard ${waitTime}-minute waiting threshold. Perfect if you plan to visit in the next hour.`
    };
  };

  const recCard = getLiveRecommendation();
  const cardBaseClass = "bg-gradient-to-br from-white to-slate-50/30 border border-amber-100/60 p-6 rounded-2xl shadow-2xs transition-all duration-300 hover:shadow-md hover:border-orange-200/80 hover:-translate-y-0.5 group";

  // Error state layout fallback
  if (errorStates.weather || errorStates.crowd) {
    return (
      <div className="w-full bg-white border border-amber-100/60 p-8 rounded-2xl text-center flex flex-col items-center justify-center">
        <p className="text-xs font-bold text-slate-500 max-w-sm m-0 leading-relaxed">
          Unable to load live information. Please check your internet connection and try again.
        </p>
        <button
          onClick={() => {
            onRetryWeather?.();
            onRetryCrowd?.();
          }}
          className="mt-4 px-5 py-2 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold tracking-wider uppercase border-0 cursor-pointer shadow-xs transition active:scale-98"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      
      {/* ==================== LIVE VISITING ADVICE BANNER ==================== */}
      {!(loadingStates.crowd || loadingStates.weather) && (
        <div className="w-full bg-[#fffbeb] border border-[#f3e3c3] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 m-0">Today's Recommendation</h4>
            <span className="text-sm font-black block mt-1 text-slate-900">{recCard.banner}</span>
            <p className="text-xs font-medium text-slate-600 m-0 pt-0.5 leading-relaxed">{recCard.desc}</p>
          </div>
        </div>
      )}

      {/* ==================== WEATHER CARD (100% WIDTH) ==================== */}
      {loadingStates.weather ? (
        <div className="w-full bg-white border border-amber-100/40 h-44 rounded-2xl animate-pulse" />
      ) : (
        <div className={`${cardBaseClass} w-full text-left`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Primary Climate Conditions */}
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
              <div>
                <h3 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Today's Weather</h3>
                <h2 className="font-bold text-slate-900 text-sm tracking-tight mt-0.5 flex items-center gap-1.5">🌤 Weather Overview</h2>
              </div>
              
              <div className="flex items-center gap-4 pt-1">
                {weather?.current?.condition?.icon && (
                  <div className="p-1 bg-amber-50/60 rounded-xl border border-amber-100/40 shrink-0">
                    <img src={weather.current.condition.icon} alt="Weather Icon" className="w-12 h-12" />
                  </div>
                )}
                <div>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">
                    {weather?.current?.temp_c ?? "--"}°C
                  </div>
                  <p className="text-xs font-bold text-orange-700 capitalize">
                    {weather?.current?.condition?.text || "Unavailable"}
                  </p>
                </div>
              </div>
            </div>

            {/* Environmental Data Grid */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-500">
              
              <div className="p-3 bg-[#fffbeb] border border-[#f3e3c3] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500"><Thermometer size={14} className="text-[#ea580c]" /><span>Feels Like</span></div>
                <div className="text-slate-900 font-bold text-sm pt-0.5">{weather?.current?.feelslike_c ?? "--"}°C</div>
              </div>

              <div className="p-3 bg-[#fffbeb] border border-[#f3e3c3] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500"><Sun size={14} className="text-amber-500" /><span>UV Index</span></div>
                <div className="text-slate-900 font-bold text-sm pt-0.5">{weather?.current?.uv ?? "--"}</div>
              </div>

              <div className="p-3 bg-[#fffbeb] border border-[#f3e3c3] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500"><Droplets size={14} className="text-blue-500" /><span>Humidity</span></div>
                <div className="text-slate-900 font-bold text-sm pt-0.5">{weather?.current?.humidity ?? "--"}%</div>
              </div>

              <div className="p-3 bg-[#fffbeb] border border-[#f3e3c3] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500"><Wind size={14} className="text-[#ea580c]" /><span>Wind Speed</span></div>
                <div className="text-slate-900 font-bold text-sm pt-0.5">{weather?.current?.wind_kph ?? "--"} km/h</div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==================== CROWD & WAIT TIME SPLIT (50% / 50% WIDTH) ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        
        {/* CARD A: DYNAMIC CROWD LEVEL STATUS */}
        {loadingStates.crowd ? (
          <div className="w-full bg-white border border-amber-100/40 h-36 rounded-2xl animate-pulse" />
        ) : (
          <div className={cardBaseClass}>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Live Crowd Status</h3>
                  <h2 className="font-bold text-slate-900 text-sm tracking-tight mt-0.5 flex items-center gap-1.5">👥 Crowd Level</h2>
                </div>
                <div className="p-2 bg-amber-50/60 border border-amber-100/40 text-orange-700 rounded-xl">
                  <Users size={16} />
                </div>
              </div>

              <div className="pt-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">Current Status</span>
                <div className={`text-2xl font-black tracking-tight mt-1 ${getCrowdColorClass(crowd?.status)}`}>
                  {crowd?.status 
                    ? String(crowd.status).charAt(0).toUpperCase() + String(crowd.status).slice(1).toLowerCase()
                    : "Normal"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CARD B: DYNAMIC WAIT TIME ENGINE */}
        {loadingStates.crowd ? (
          <div className="w-full bg-white border border-amber-100/40 h-36 rounded-2xl animate-pulse" />
        ) : (
          <div className={cardBaseClass}>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Waiting Time</h3>
                  <h2 className="font-bold text-slate-900 text-sm tracking-tight mt-0.5 flex items-center gap-1.5">⏱ Estimated Wait Time</h2>
                </div>
                <div className="p-2 bg-amber-50/60 border border-amber-100/40 text-orange-700 rounded-xl">
                  <Clock size={16} />
                </div>
              </div>

              <div className="pt-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">Estimated Wait Time</span>
                <div className="text-3xl font-black text-orange-800 tracking-tighter flex items-baseline gap-1 mt-1">
                  <span>{crowd?.wait_time ?? "--"}</span>
                  <span className="text-xs font-bold text-slate-500 font-sans tracking-normal uppercase">Minutes</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}