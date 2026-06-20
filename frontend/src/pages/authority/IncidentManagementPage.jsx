import { useState } from "react";
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
} from "lucide-react";

export default function IncidentManagementPage() {
  const [filter, setFilter] = useState("ALL");

  const incidents = [
    {
      id: "INC001",
      type: "SOS",
      category: "Medical Emergency",
      priority: "CRITICAL",
      location: "Garbh Griha",
      reportedAt: "10:42 AM",
      status: "ACTIVE",
    },
    {
      id: "INC002",
      type: "MISSING",
      category: "Missing Child",
      priority: "HIGH",
      location: "Rang Mandap",
      reportedAt: "11:08 AM",
      status: "ACTIVE",
    },
    {
      id: "INC003",
      type: "SOS",
      category: "Crowd Congestion",
      priority: "MEDIUM",
      location: "Nritya Mandap",
      reportedAt: "11:21 AM",
      status: "IN_PROGRESS",
    },
  ];

  const filteredIncidents =
    filter === "ALL"
      ? incidents
      : incidents.filter(
          (i) => i.type === filter
        );

  const activeIncidents =
    incidents.filter(
      (i) => i.status !== "RESOLVED"
    ).length;

  const sosCount =
    incidents.filter(
      (i) => i.type === "SOS"
    ).length;

  const missingCount =
    incidents.filter(
      (i) => i.type === "MISSING"
    ).length;

  function getPriorityColor(
    priority
  ) {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";

      case "HIGH":
        return "bg-orange-100 text-orange-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Incident Command Center
          </h1>

          <p className="text-slate-600 mt-3">
            Monitor SOS alerts,
            missing persons and
            emergency situations
            across the temple.
          </p>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <StatCard
            title="Active Incidents"
            value={activeIncidents}
            icon={<ShieldAlert />}
            color="bg-red-500"
          />

          <StatCard
            title="SOS Cases"
            value={sosCount}
            icon={<HeartPulse />}
            color="bg-orange-500"
          />

          <StatCard
            title="Missing Persons"
            value={missingCount}
            icon={<UserSearch />}
            color="bg-violet-500"
          />

          <StatCard
            title="Resolved Today"
            value="12"
            icon={<CheckCircle2 />}
            color="bg-green-500"
          />

        </div>

        {/* Filters */}

        <div className="bg-white rounded-3xl p-5 shadow-sm mb-8">

          <div className="flex gap-3 flex-wrap">

            <button
              onClick={() =>
                setFilter("ALL")
              }
              className={`px-5 py-2 rounded-xl ${
                filter === "ALL"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              All Incidents
            </button>

            <button
              onClick={() =>
                setFilter("SOS")
              }
              className={`px-5 py-2 rounded-xl ${
                filter === "SOS"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              SOS Cases
            </button>

            <button
              onClick={() =>
                setFilter("MISSING")
              }
              className={`px-5 py-2 rounded-xl ${
                filter === "MISSING"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              Missing Persons
            </button>

          </div>

        </div>

        {/* Incident List */}

        <div className="space-y-5">

          {filteredIncidents.map(
            (incident) => (
              <motion.div
                key={incident.id}
                whileHover={{
                  y: -3,
                }}
                className="
                  bg-white
                  rounded-3xl
                  p-6
                  shadow-sm
                "
              >

                <div className="flex justify-between flex-wrap gap-4">

                  <div>

                    <div className="flex items-center gap-3">

                      <AlertTriangle
                        className="text-red-500"
                      />

                      <h3 className="text-xl font-bold">
                        {
                          incident.category
                        }
                      </h3>

                    </div>

                    <p className="text-slate-500 mt-2">
                      Incident ID:
                      {" "}
                      {incident.id}
                    </p>

                  </div>

                  <span
                    className={`
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-medium
                      ${getPriorityColor(
                        incident.priority
                      )}
                    `}
                  >
                    {
                      incident.priority
                    }
                  </span>

                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">

                  <InfoItem
                    icon={<MapPin size={16} />}
                    label="Location"
                    value={
                      incident.location
                    }
                  />

                  <InfoItem
                    icon={<Clock3 size={16} />}
                    label="Reported"
                    value={
                      incident.reportedAt
                    }
                  />

                  <InfoItem
                    icon={<Search size={16} />}
                    label="Status"
                    value={
                      incident.status
                    }
                  />

                </div>

                <div className="flex gap-3 mt-6 flex-wrap">

                  <button
                    className="
                      px-5
                      py-2
                      rounded-xl
                      bg-violet-600
                      text-white
                    "
                  >
                    Assign Officer
                  </button>

                  <button
                    className="
                      px-5
                      py-2
                      rounded-xl
                      bg-green-600
                      text-white
                    "
                  >
                    Mark Resolved
                  </button>

                  <button
                    className="
                      px-5
                      py-2
                      rounded-xl
                      bg-orange-500
                      text-white
                    "
                  >
                    Broadcast Alert
                  </button>

                </div>

              </motion.div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div
        className={`
          h-12
          w-12
          rounded-xl
          flex
          items-center
          justify-center
          text-white
          ${color}
        `}
      >
        {icon}
      </div>

      <p className="mt-4 text-slate-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-violet-600">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}