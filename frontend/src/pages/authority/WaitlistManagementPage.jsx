import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock3,
  Users,
  Search,
  ArrowUpCircle,
  CalendarCheck,
} from "lucide-react";

import api from "../../services/api";

export default function WaitlistManagementPage() {
  const [waitlist, setWaitlist] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadWaitlist();
  }, []);

  async function loadWaitlist() {
    try {
      const response =
        await api.get(
          "/dashboard/waitlist"
        );

      setWaitlist(
        response.data.waitlist || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredWaitlist =
    waitlist.filter((item) =>
      JSON.stringify(item)
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Waitlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Waitlist Management
          </h1>

          <p className="text-slate-600 mt-3">
            Monitor and manage
            devotees currently
            waiting for slots.
          </p>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <StatCard
            title="Total Waitlist"
            value={waitlist.length}
            icon={<Users />}
            color="bg-orange-500"
          />

          <StatCard
            title="Pending Promotion"
            value={waitlist.length}
            icon={<ArrowUpCircle />}
            color="bg-blue-500"
          />

          <StatCard
            title="Available Slots"
            value="Live"
            icon={<CalendarCheck />}
            color="bg-green-500"
          />

        </div>

        {/* Search */}

        <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">

          <div className="relative">

            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search waitlist..."
              className="
                w-full
                pl-12
                pr-4
                py-3
                border
                rounded-xl
              "
            />

          </div>

        </div>

        {/* Queue */}

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">
              Queue Monitoring
            </h2>

          </div>

          {filteredWaitlist.length ===
          0 ? (

            <div className="py-20 text-center">

              <Clock3
                size={50}
                className="
                  mx-auto
                  text-slate-400
                "
              />

              <p className="mt-4 text-slate-500">
                No devotees are
                currently on the
                waitlist.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-slate-50">

                    <th className="p-4 text-left">
                      Position
                    </th>

                    <th className="p-4 text-left">
                      Name
                    </th>

                    <th className="p-4 text-left">
                      Email
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left">
                      Expected Promotion
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredWaitlist.map(
                    (
                      item,
                      index
                    ) => (

                      <motion.tr
                        key={index}
                        whileHover={{
                          backgroundColor:
                            "#f8fafc",
                        }}
                        className="border-t"
                      >

                        <td className="p-4">

                          <span
                            className="
                              h-8
                              w-8
                              rounded-full
                              bg-orange-100
                              text-orange-600
                              flex
                              items-center
                              justify-center
                              font-bold
                            "
                          >
                            {index + 1}
                          </span>

                        </td>

                        <td className="p-4 font-medium">
                          {item.name ||
                            "Devotee"}
                        </td>

                        <td className="p-4">
                          {item.email ||
                            "-"}
                        </td>

                        <td className="p-4">

                          <span
                            className="
                              px-3
                              py-1
                              rounded-full
                              bg-orange-100
                              text-orange-700
                              text-sm
                            "
                          >
                            WAITLISTED
                          </span>

                        </td>

                        <td className="p-4 text-green-600 font-medium">
                          Next Available Slot
                        </td>

                      </motion.tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

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