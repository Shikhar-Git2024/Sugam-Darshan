import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  TrendingUp,
  Users,
  Clock3,
} from "lucide-react";

import api from "../../services/api";

export default function RiskAnalysisPage() {
  const [risk, setRisk] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadRisk();
  }, []);

  async function loadRisk() {
    try {

      const response =
        await api.get(
          "/dashboard/risk"
        );

      setRisk(
        response.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  if (loading || !risk) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Risk Analysis...
      </div>
    );
  }

  const riskScore =
    risk.risk_score || 0;

  function getRiskColor() {

    if (riskScore <= 30)
      return "text-green-600";

    if (riskScore <= 60)
      return "text-yellow-600";

    if (riskScore <= 80)
      return "text-orange-600";

    return "text-red-600";
  }

  function getRiskBg() {

    if (riskScore <= 30)
      return "bg-green-500";

    if (riskScore <= 60)
      return "bg-yellow-500";

    if (riskScore <= 80)
      return "bg-orange-500";

    return "bg-red-500";
  }

  const factors = [
    {
      title: "Crowd Density",
      value:
        riskScore > 70
          ? "High"
          : riskScore > 40
          ? "Moderate"
          : "Low",
      icon: Users,
    },
    {
      title: "Queue Pressure",
      value:
        riskScore > 60
          ? "Elevated"
          : "Normal",
      icon: Clock3,
    },
    {
      title: "Movement Flow",
      value:
        riskScore > 75
          ? "Restricted"
          : "Stable",
      icon: Activity,
    },
    {
      title: "Operational Risk",
      value:
        risk.risk_level,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Risk Analysis Center
          </h1>

          <p className="text-slate-600 mt-3">
            AI-driven operational risk monitoring.
          </p>

        </div>

        {/* Main Risk Banner */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            bg-white
            rounded-3xl
            p-8
            shadow-sm
            mb-10
          "
        >

          <div className="flex items-center justify-between flex-wrap gap-6">

            <div>

              <div className="flex items-center gap-3">

                <ShieldAlert
                  size={36}
                  className={getRiskColor()}
                />

                <h2 className="text-3xl font-bold">
                  Current Risk Level
                </h2>

              </div>

              <p className="text-slate-500 mt-4">
                Live crowd and operational risk status.
              </p>

            </div>

            <div className="text-center">

              <div
                className={`
                  text-6xl
                  font-bold
                  ${getRiskColor()}
                `}
              >
                {riskScore}
              </div>

              <div className="text-slate-500">
                Risk Score
              </div>

            </div>

          </div>

        </motion.div>

        {/* Risk Meter */}

        <div className="bg-white rounded-3xl p-8 shadow-sm mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Risk Meter
          </h2>

          <div className="h-6 bg-slate-200 rounded-full overflow-hidden">

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${riskScore}%`,
              }}
              transition={{
                duration: 1.5,
              }}
              className={`
                h-full
                ${getRiskBg()}
              `}
            />

          </div>

          <div className="flex justify-between mt-3 text-sm text-slate-500">

            <span>Safe</span>

            <span>Moderate</span>

            <span>High</span>

            <span>Critical</span>

          </div>

        </div>

        {/* Risk Factors */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {factors.map(
            (
              factor,
              index
            ) => {

              const Icon =
                factor.icon;

              return (

                <motion.div
                  key={index}
                  whileHover={{
                    y: -5,
                  }}
                  className="
                    bg-white
                    rounded-3xl
                    p-6
                    shadow-sm
                  "
                >

                  <Icon
                    size={28}
                    className="
                      text-violet-600
                      mb-4
                    "
                  />

                  <p className="text-slate-500">
                    {factor.title}
                  </p>

                  <h3 className="text-2xl font-bold mt-2">
                    {factor.value}
                  </h3>

                </motion.div>

              );
            }
          )}

        </div>

        {/* Recommendations */}

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <TrendingUp
              className="text-violet-600"
            />

            <h2 className="text-2xl font-bold">
              Recommended Actions
            </h2>

          </div>

          <div className="space-y-4">

            {riskScore <= 30 && (
              <>
                <ActionCard
                  text="Current operations are stable."
                />
                <ActionCard
                  text="Continue standard monitoring."
                />
              </>
            )}

            {riskScore > 30 &&
              riskScore <= 60 && (
                <>
                  <ActionCard
                    text="Increase monitoring frequency."
                  />
                  <ActionCard
                    text="Prepare additional staff."
                  />
                </>
              )}

            {riskScore > 60 &&
              riskScore <= 80 && (
                <>
                  <ActionCard
                    text="Deploy extra security personnel."
                  />
                  <ActionCard
                    text="Redirect crowd flow."
                  />
                  <ActionCard
                    text="Open additional queues."
                  />
                </>
              )}

            {riskScore > 80 && (
              <>
                <ActionCard
                  text="Critical alert condition."
                />
                <ActionCard
                  text="Restrict new entries."
                />
                <ActionCard
                  text="Activate emergency crowd protocols."
                />
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

function ActionCard({
  text,
}) {
  return (
    <div
      className="
        p-4
        rounded-2xl
        bg-slate-50
        border
      "
    >
      {text}
    </div>
  );
}