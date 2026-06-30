import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  UserSearch,
  HeartPulse,
  ShieldAlert,
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCw,
  Navigation,
  UserCheck,
  Loader2,
  FileText,
} from "lucide-react";

import api from "../../services/api";

// Sub-component to translate reporter's GPS coordinates into a clean text address
function ReverseGeocodedAddress({ lat, lon, fallbackName }) {
  const [address, setAddress] = useState("Calculating address...");

  useEffect(() => {
    if (!lat || !lon) {
      setAddress(fallbackName || "Location Coordinates Unavailable");
      return;
    }

    let isMounted = true;
    async function fetchAddress() {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        if (isMounted) {
          setAddress(data.display_name || data.name || fallbackName || `Lat: ${lat}, Lon: ${lon}`);
        }
      } catch (err) {
        if (isMounted) setAddress(fallbackName || `Lat: ${lat}, Lon: ${lon}`);
      }
    }

    fetchAddress();
    return () => {
      isMounted = false;
    };
  }, [lat, lon, fallbackName]);

  return <span className="text-slate-800 font-medium">{address}</span>;
}

export default function IncidentManagementPage() {
  const authority = JSON.parse(localStorage.getItem("user") || "{}");

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [processingId, setProcessingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
      loadIncidents(true);
      const interval = setInterval(() => {
          loadIncidents(false);
      }, 3000); // Relaxed interval slightly to avoid server/network spam
      return () => clearInterval(interval);
  }, []);

  async function loadIncidents(showLoader = true) {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      const response = await api.get("/incident/all");
      setIncidents(response.data.incidents || response.data || []);
    } catch (err) {
      console.error("Failed pulling incident collection feeds:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function takeOwnership(incidentId) {
    if (!authority?.id) {
      alert("Error: You must be logged in as an authority to take ownership.");
      return;
    }
    try {
      setProcessingId(incidentId);
      await api.put(`/incident/assign/${incidentId}/${authority.id}`);
      await loadIncidents(false);
    } catch (err) {
      console.error(err);
      alert("Unable to assign incident.");
    } finally {
      setProcessingId(null);
    }
  }

  async function resolveIncident(incidentId) {
    try {
      setProcessingId(incidentId);
      await api.put(`/incident/resolve/${incidentId}`);
      await loadIncidents(false);
    } catch (err) {
      console.error(err);
      alert("Unable to resolve incident.");
    } finally {
      setProcessingId(null);
    }
  }

  function openLocation(latitude, longitude) {
    if (!latitude || !longitude) return;
    window.open(
      `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}`,
      "_blank"
    );
  }

  function statusColor(status) {
    switch (status) {
      case "ACTIVE": return "bg-red-100 text-red-700";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-700";
      case "RESOLVED": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-700";
    }
  }

  function priorityColor(priority) {
    switch (priority) {
      case "CRITICAL": return "bg-red-100 text-red-700";
      case "HIGH": return "bg-orange-100 text-orange-700";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700";
      case "LOW": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-700";
    }
  }

  const filteredIncidents = useMemo(() => {
    let data = [...incidents];

    if (filter !== "ALL") {
      if (filter === "SOS") {
        data = data.filter((i) => i.type === "SOS");
      } else if (filter === "MISSING_PERSON") {
        data = data.filter((i) => i.type === "MISSING_PERSON");
      } else {
        data = data.filter((i) => i.status === filter);
      }
    }

    if (search.trim()) {
      const value = search.toLowerCase();
      data = data.filter((incident) =>
        incident.incident_id?.toLowerCase().includes(value) ||
        incident.category?.toLowerCase().includes(value) ||
        incident.description?.toLowerCase().includes(value) ||
        incident.location_name?.toLowerCase().includes(value) ||
        incident.missing_person_name?.toLowerCase().includes(value) ||
        incident.last_seen_location?.toLowerCase().includes(value)
      );
    }

    return data;
  }, [incidents, filter, search]);

  const stats = useMemo(() => {
    return {
      active: incidents.filter((i) => i.status === "ACTIVE").length,
      progress: incidents.filter((i) => i.status === "IN_PROGRESS").length,
      resolved: incidents.filter((i) => i.status === "RESOLVED").length,
      sos: incidents.filter((i) => i.type === "SOS").length,
      missing: incidents.filter((i) => i.type === "MISSING_PERSON").length,
      critical: incidents.filter((i) => i.priority === "CRITICAL").length,
    };
  }, [incidents]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="animate-spin text-violet-600" size={32} />
        <span className="text-slate-600 font-semibold text-lg">Loading Incident Center...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Incident Command Center</h1>
            <p className="text-slate-600 mt-2">
              Real-time emergency monitoring, SOS response and missing person management.
            </p>
          </div>
          <button
            onClick={() => loadIncidents(false)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition-all shadow-sm font-semibold"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ================= STATISTICS ================= */}
        <div className="grid xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-5 mb-8">
          <StatCard title="Active" value={stats.active} color="bg-red-500" icon={<ShieldAlert />} />
          <StatCard title="In Progress" value={stats.progress} color="bg-yellow-500" icon={<Loader2 className="animate-spin" />} />
          <StatCard title="Resolved" value={stats.resolved} color="bg-green-500" icon={<CheckCircle2 />} />
          <StatCard title="SOS Cases" value={stats.sos} color="bg-orange-500" icon={<HeartPulse />} />
          <StatCard title="Missing" value={stats.missing} color="bg-violet-500" icon={<UserSearch />} />
          <StatCard title="Critical" value={stats.critical} color="bg-red-700" icon={<AlertTriangle />} />
        </div>

        {/* ================= SEARCH ================= */}
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-6 border border-slate-100">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Category, Missing Person Name, Last Seen Location..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["ALL", "SOS", "MISSING_PERSON", "ACTIVE", "IN_PROGRESS", "RESOLVED"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-5 py-2 rounded-full transition-all font-medium border text-sm ${
                filter === item 
                  ? "bg-violet-600 border-violet-600 text-white shadow-sm" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* ================= INCIDENT LIST ================= */}
        <div className="space-y-6">
          {filteredIncidents.length === 0 && (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-200">
              <ShieldAlert className="mx-auto text-slate-300 animate-pulse" size={70} />
              <h2 className="text-2xl font-bold mt-6 text-slate-800">No Incidents Found</h2>
              <p className="text-slate-500 mt-2">No active emergencies match your criteria.</p>
            </div>
          )}

          {filteredIncidents.map((incident) => (
            <motion.div 
              key={incident.id} 
              layout 
              className="bg-white rounded-3xl shadow-sm border border-slate-200 p-7 transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-5">
                <div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={incident.status === 'RESOLVED' ? 'text-green-500' : 'text-red-500'} size={26} />
                    <h2 className="text-2xl font-bold text-slate-900">{incident.category}</h2>
                  </div>
                  <p className="mt-2 text-slate-500">
                    Incident ID : <span className="font-semibold text-slate-700 ml-2">{incident.incident_id}</span>
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${priorityColor(incident.priority)}`}>
                    {incident.priority}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColor(incident.status)}`}>
                    {incident.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* ================= GRID DETAILS: REPORTER / DEVOTEE WHO FILLED THE FORM ================= */}
              <div className="grid lg:grid-cols-2 gap-5 mt-8 border-t border-b border-slate-100 py-6">
                <div className="space-y-4">
                  <InfoItem label="Incident Type" value={incident.type} icon={<AlertTriangle size={17} />} />
                  <InfoItem label="Reporter ID" value={incident.user_id} icon={<UserCheck size={17} />} />
                  <InfoItem label="Form Sent On" value={new Date(incident.created_at).toLocaleString()} icon={<Clock3 size={17} />} />
                </div>
                
                <div className="flex items-start gap-3 bg-violet-50/50 p-4 rounded-2xl border border-violet-100">
                  <div className="mt-1 text-violet-600"><MapPin size={18} /></div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-violet-500 font-bold">Reporter's Physical Location</p>
                    <ReverseGeocodedAddress 
                      lat={incident.latitude} 
                      lon={incident.longitude} 
                      fallbackName={incident.location_name} 
                    />
                    <div className="text-xs text-slate-400 font-mono mt-1">
                      GPS: {incident.latitude || "-"}, {incident.longitude || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= ORANGE BOX: MISSING PERSON SPECIFICS ================= */}
              {incident.type === "MISSING_PERSON" && (
                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-orange-700 mb-5">
                    Missing Person Details
                  </h3>

                  <div className="grid lg:grid-cols-4 gap-6">
                    {/* Person Image */}
                    <div className="flex justify-center items-start">
                      {incident.image_path ? (
                        <img
                          src={`http://127.0.0.1:8000/${incident.image_path}`}
                          alt="Missing Person"
                          onClick={() =>
                            setPreviewImage(
                              `http://127.0.0.1:8000/${incident.image_path}`
                            )
                          }
                          className="w-40 h-40 rounded-2xl object-cover border-2 border-orange-300 cursor-pointer hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-40 h-40 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500 border border-slate-300">
                          No Image Provided
                        </div>
                      )}
                    </div>

                    {/* Meta Fields Grid */}
                    <div className="lg:col-span-3 grid md:grid-cols-2 gap-5">
                      <InfoItem
                        label="Missing Person Name"
                        value={incident.missing_person_name}
                        icon={<UserCheck size={17} />}
                      />
                      <InfoItem
                        label="Age"
                        value={incident.missing_person_age}
                        icon={<UserCheck size={17} />}
                      />
                      <InfoItem
                        label="Gender"
                        value={incident.missing_person_gender}
                        icon={<UserCheck size={17} />}
                      />
                      <InfoItem
                        label="Emergency Contact Number"
                        value={incident.contact_number}
                        icon={<UserCheck size={17} />}
                      />
                      <InfoItem
                        label="Last Seen Location"
                        value={incident.last_seen_location || incident.location_name}
                        icon={<MapPin size={17} />}
                      />
                      <InfoItem
                        label="Last Seen Date & Time"
                        value={incident.last_seen_time ? new Date(incident.last_seen_time).toLocaleString() : "-"}
                        icon={<Clock3 size={17} />}
                      />
                    </div>
                  </div>

                  {/* Description Context completely tucked inside the missing person block */}
                  <div className="mt-6 bg-white/90 rounded-xl p-5 border border-orange-100 shadow-inner">
                    <p className="text-xs uppercase tracking-wider text-orange-700 font-bold flex items-center gap-1.5">
                      <FileText size={14} /> Description / Identification Marks
                    </p>
                    <p className="mt-2 text-slate-700 leading-relaxed text-sm">{incident.description}</p>
                  </div>
                </div>
              )}

              {/* Standard generic Description Box for everything else (like instant SOS clicks) */}
              {incident.type !== "MISSING_PERSON" && (
                <div className="mt-6 bg-slate-50 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Incident Description</p>
                  <p className="mt-2 text-slate-700 leading-relaxed">{incident.description}</p>
                </div>
              )}
            
              {/* Action Footer */}
              <div className="mt-8 flex flex-wrap gap-4">
                {incident.status === "ACTIVE" && (
                  <button
                    disabled={processingId !== null}
                    onClick={() => takeOwnership(incident.id)}
                    className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold transition-colors min-w-[140px]"
                  >
                    {processingId === incident.id ? "Assigning..." : "Take Ownership"}
                  </button>
                )}

                {incident.status !== "RESOLVED" && (
                  <button
                    disabled={processingId !== null}
                    onClick={() => resolveIncident(incident.id)}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold transition-colors min-w-[140px]"
                  >
                    {processingId === incident.id ? "Resolving..." : "Mark Resolved"}
                  </button>
                )}

                {previewImage && (
                  <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setPreviewImage(null)}
                  >
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-[90vh] max-w-[90vw] rounded-3xl shadow-2xl"
                    />
                  </div>
                )}

                <button
                  onClick={() => openLocation(incident.latitude, incident.longitude)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  <Navigation size={16} /> Route to Reporter
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between"
    >
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-md ${color}`}>
        {icon}
      </div>
      <div>
        <p className="mt-5 text-slate-500 text-sm font-semibold uppercase tracking-wider text-xs">{title}</p>
        <h2 className="text-4xl font-black mt-1 text-slate-900">{value}</h2>
      </div>
    </motion.div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-violet-600">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">{label}</p>
        <p className="text-slate-800 font-medium break-all mt-0.5">{value || "-"}</p>
      </div>
    </div>
  );
}