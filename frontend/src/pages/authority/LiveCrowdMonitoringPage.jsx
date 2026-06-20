import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Clock3,
  AlertTriangle,
  Activity,
  Shield,
  Megaphone,
  ArrowRightLeft,
  UserCheck,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import api from "../../services/api";

export default function LiveCrowdMonitoringPage() {
  const [crowd, setCrowd] = useState(null);
  const [risk, setRisk] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const [
        crowdRes,
        riskRes,
        forecastRes,
      ] = await Promise.all([
        api.get("/dashboard/crowd"),
        api.get("/dashboard/risk"),
        api.get("/public/forecast"),
      ]);

      setCrowd(crowdRes.data);
      setRisk(riskRes.data);

      if (Array.isArray(forecastRes.data)) {
        setForecast(forecastRes.data);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !crowd || !risk) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Crowd Monitoring...
      </div>
    );
  }

  const zones = [
    {
      name: "Garbh Griha",
      value: 92,
    },
    {
      name: "Nritya Mandap",
      value: 74,
    },
    {
      name: "Rang Mandap",
      value: 55,
    },
    {
      name: "Kirtan Mandap",
      value: 38,
    },
    {
      name: "Garden Area",
      value: 22,
    },
  ];

  function getRiskColor(score) {
    if (score <= 30)
      return "bg-green-500";

    if (score <= 60)
      return "bg-yellow-500";

    if (score <= 80)
      return "bg-orange-500";

    return "bg-red-500";
  }

  function getCrowdColor(status) {
    switch (status) {
      case "LOW":
        return "bg-green-500";

      case "MODERATE":
        return "bg-yellow-500";

      case "HIGH":
        return "bg-orange-500";

      default:
        return "bg-red-500";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-10"
        >
          <h1 className="text-5xl font-bold text-slate-900">
            Live Crowd Monitoring
          </h1>

          <p className="text-slate-600 mt-3">
            Real-time temple crowd intelligence and risk tracking.
          </p>
        </motion.div>

        {/* Top Stats */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <StatCard
            title="Estimated Visitors"
            value={crowd.estimated_visitors?.toLocaleString()}
            icon={<Users />}
            gradient="from-violet-500 to-purple-600"
          />

          <StatCard
            title="Wait Time"
            value={`${crowd.wait_time} Min`}
            icon={<Clock3 />}
            gradient="from-orange-500 to-amber-600"
          />

          <StatCard
            title="Risk Score"
            value={risk.risk_score}
            icon={<Shield />}
            gradient="from-red-500 to-rose-600"
          />

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
                ${getCrowdColor(
                  crowd.crowd_status
                )}
              `}
            >
              <Activity />
            </div>

            <p className="mt-4 text-slate-500">
              Crowd Status
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {crowd.crowd_status}
            </h2>

          </div>

        </div>

        {/* Risk Banner */}

        <div className="bg-white rounded-3xl p-6 shadow-sm mb-10">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-xl font-bold">
                Current Risk Level
              </h3>

              <p className="text-slate-500 mt-2">
                Live operational risk assessment.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <span
                className={`
                  h-4
                  w-4
                  rounded-full
                  animate-pulse
                  ${getRiskColor(
                    risk.risk_score
                  )}
                `}
              />

              <span className="text-2xl font-bold">
                {risk.risk_level}
              </span>

            </div>

          </div>

        </div>

        {/* Chart + Zones */}

        <div className="grid lg:grid-cols-2 gap-8 mb-10">

          {/* Forecast Chart */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-2xl font-bold mb-6">
              Crowd Forecast
            </h2>

            <div className="h-[350px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={forecast}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="day"
                  />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="crowd"
                    stroke="#7c3aed"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* Zones */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-2xl font-bold mb-6">
              Temple Zones
            </h2>

            <div className="space-y-6">

              {zones.map(
                (zone) => (
                  <div
                    key={zone.name}
                  >

                    <div className="flex justify-between mb-2">

                      <span className="font-medium">
                        {zone.name}
                      </span>

                      <span>
                        {zone.value}%
                      </span>

                    </div>

                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width:
                            `${zone.value}%`,
                        }}
                        transition={{
                          duration: 1,
                        }}
                        className={`
                          h-full

                          ${
                            zone.value >
                            80
                              ? "bg-red-500"
                              : zone.value >
                                60
                              ? "bg-orange-500"
                              : zone.value >
                                40
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }
                        `}
                      />

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Authority Actions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            <ActionCard
              icon={<Megaphone />}
              title="Broadcast Alert"
            />

            <ActionCard
              icon={<UserCheck />}
              title="Deploy Security"
            />

            <ActionCard
              icon={<ArrowRightLeft />}
              title="Redirect Crowd"
            />

            <ActionCard
              icon={<AlertTriangle />}
              title="Open Queue"
            />

          </div>

        </div>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  gradient,
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div
        className={`
          h-12
          w-12
          rounded-xl
          bg-gradient-to-r
          ${gradient}
          text-white
          flex
          items-center
          justify-center
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

function ActionCard({
  icon,
  title,
}) {
  return (
    <motion.button
      whileHover={{
        y: -5,
      }}
      className="
        bg-slate-50
        rounded-2xl
        p-5
        text-left
        hover:bg-slate-100
      "
    >
      <div className="mb-3">
        {icon}
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>
    </motion.button>
  );
}