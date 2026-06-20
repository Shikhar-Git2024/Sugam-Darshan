import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock3,
  CheckCircle,
  XCircle,
  Users,
  Search,
} from "lucide-react";

import api from "../../services/api";

export default function BookingManagementPage() {
  const [bookings, setBookings] =
    useState([]);

  const [waitlist, setWaitlist] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {

      const [
        bookingsRes,
        waitlistRes,
      ] = await Promise.all([
        api.get(
          "/dashboard/bookings"
        ),
        api.get(
          "/dashboard/waitlist"
        ),
      ]);

      setBookings(
        bookingsRes.data.bookings || []
      );

      setWaitlist(
        waitlistRes.data.waitlist || []
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredBookings =
    bookings.filter(
      (booking) =>
        JSON.stringify(
          booking
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const confirmedCount =
    bookings.filter(
      (b) =>
        b.status ===
        "CONFIRMED"
    ).length;

  const cancelledCount =
    bookings.filter(
      (b) =>
        b.status ===
        "CANCELLED"
    ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Booking Management
          </h1>

          <p className="text-slate-600 mt-3">
            Manage all darshan
            bookings and waitlists.
          </p>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <StatCard
            title="Total Bookings"
            value={bookings.length}
            icon={<CalendarCheck />}
            color="bg-violet-500"
          />

          <StatCard
            title="Confirmed"
            value={confirmedCount}
            icon={<CheckCircle />}
            color="bg-green-500"
          />

          <StatCard
            title="Cancelled"
            value={cancelledCount}
            icon={<XCircle />}
            color="bg-red-500"
          />

          <StatCard
            title="Waitlist"
            value={waitlist.length}
            icon={<Clock3 />}
            color="bg-orange-500"
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
              placeholder="Search booking..."
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

        {/* Booking Table */}

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-10">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">
              Booking Records
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50">

                  <th className="text-left p-4">
                    Booking ID
                  </th>

                  <th className="text-left p-4">
                    Date
                  </th>

                  <th className="text-left p-4">
                    Slot
                  </th>

                  <th className="text-left p-4">
                    People
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredBookings.map(
                  (
                    booking,
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

                      <td className="p-4 font-medium">
                        {booking.booking_id}
                      </td>

                      <td className="p-4">
                        {booking.visit_date}
                      </td>

                      <td className="p-4">
                        {booking.slot}
                      </td>

                      <td className="p-4">
                        {booking.people_count}
                      </td>

                      <td className="p-4">

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium

                            ${
                              booking.status ===
                              "CONFIRMED"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                        >
                          {
                            booking.status
                          }
                        </span>

                      </td>

                    </motion.tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Waitlist */}

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">
              Waitlist Queue
            </h2>

          </div>

          <div className="p-6">

            {waitlist.length ===
            0 ? (

              <div className="text-center py-10">

                <Users
                  size={40}
                  className="
                    mx-auto
                    text-slate-400
                  "
                />

                <p className="mt-4 text-slate-500">
                  No devotees in
                  waitlist.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {waitlist.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        p-4
                        border
                        rounded-2xl
                      "
                    >
                      <div className="font-medium">
                        {
                          item.name
                        }
                      </div>

                      <div className="text-sm text-slate-500 mt-1">
                        Queue Position:
                        {" "}
                        {index + 1}
                      </div>

                    </div>

                  )
                )}

              </div>

            )}

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