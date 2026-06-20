import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Send,
  AlertTriangle,
  Users,
  CheckCircle2,
  Megaphone,
  Clock3,
} from "lucide-react";

export default function NotificationBroadcastPage() {
  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [audience, setAudience] =
    useState("ALL");

  const [priority, setPriority] =
    useState("NORMAL");

  const [sentNotifications, setSentNotifications] =
    useState([
      {
        id: 1,
        title: "Heavy Crowd Expected",
        audience: "ALL",
        priority: "HIGH",
        time: "10:30 AM",
      },
      {
        id: 2,
        title: "Gate 2 Opened",
        audience: "ALL",
        priority: "NORMAL",
        time: "09:12 AM",
      },
    ]);

  function handleBroadcast() {
    if (!title || !message) return;

    const newNotification = {
      id: Date.now(),
      title,
      audience,
      priority,
      time: new Date().toLocaleTimeString(),
    };

    setSentNotifications([
      newNotification,
      ...sentNotifications,
    ]);

    setTitle("");
    setMessage("");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Notification Broadcast Center
          </h1>

          <p className="text-slate-600 mt-3">
            Send important updates,
            crowd alerts and emergency
            announcements to devotees.
          </p>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <StatCard
            title="Broadcast Today"
            value="42"
            icon={<Megaphone />}
            color="bg-violet-500"
          />

          <StatCard
            title="Recipients"
            value="12,846"
            icon={<Users />}
            color="bg-blue-500"
          />

          <StatCard
            title="Emergency Alerts"
            value="3"
            icon={<AlertTriangle />}
            color="bg-red-500"
          />

          <StatCard
            title="Delivered"
            value="99.2%"
            icon={<CheckCircle2 />}
            color="bg-green-500"
          />

        </div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* Broadcast Form */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-6">

                <Bell className="text-violet-600" />

                <h2 className="text-2xl font-bold">
                  Create Broadcast
                </h2>

              </div>

              <div className="space-y-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Notification Title
                  </label>

                  <input
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      rounded-xl
                      px-4
                      py-3
                    "
                    placeholder="Temple Notice..."
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Audience
                  </label>

                  <select
                    value={audience}
                    onChange={(e) =>
                      setAudience(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      rounded-xl
                      px-4
                      py-3
                    "
                  >

                    <option value="ALL">
                      All Devotees
                    </option>

                    <option value="TODAY">
                      Today's Visitors
                    </option>

                    <option value="WAITLIST">
                      Waitlist
                    </option>

                    <option value="VIP">
                      VIP Visitors
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      rounded-xl
                      px-4
                      py-3
                    "
                  >

                    <option value="NORMAL">
                      Normal
                    </option>

                    <option value="HIGH">
                      High
                    </option>

                    <option value="CRITICAL">
                      Critical
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>

                  <textarea
                    rows="5"
                    value={message}
                    onChange={(e) =>
                      setMessage(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      rounded-xl
                      px-4
                      py-3
                    "
                    placeholder="Write your announcement..."
                  />

                </div>

                <button
                  onClick={
                    handleBroadcast
                  }
                  className="
                    w-full
                    py-4
                    rounded-xl
                    bg-violet-600
                    text-white
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <Send size={18} />
                  Broadcast Notification
                </button>

              </div>

            </div>

          </div>

          {/* History */}

          <div className="lg:col-span-3">

            <div className="bg-white rounded-3xl p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-6">

                <Clock3 className="text-violet-600" />

                <h2 className="text-2xl font-bold">
                  Broadcast History
                </h2>

              </div>

              <div className="space-y-4">

                {sentNotifications.map(
                  (notification) => (

                    <motion.div
                      key={
                        notification.id
                      }
                      whileHover={{
                        y: -2,
                      }}
                      className="
                        border
                        rounded-2xl
                        p-5
                      "
                    >

                      <div className="flex justify-between items-center flex-wrap gap-3">

                        <div>

                          <h3 className="font-bold text-lg">
                            {
                              notification.title
                            }
                          </h3>

                          <p className="text-slate-500 text-sm mt-1">
                            Audience:
                            {" "}
                            {
                              notification.audience
                            }
                          </p>

                        </div>

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-sm

                            ${
                              notification.priority ===
                              "CRITICAL"
                                ? "bg-red-100 text-red-700"
                                : notification.priority ===
                                  "HIGH"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }
                          `}
                        >
                          {
                            notification.priority
                          }
                        </span>

                      </div>

                      <p className="text-slate-400 text-sm mt-3">
                        Sent at{" "}
                        {
                          notification.time
                        }
                      </p>

                    </motion.div>

                  )
                )}

              </div>

            </div>

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