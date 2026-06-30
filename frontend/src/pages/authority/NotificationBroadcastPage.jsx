import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Send,
  AlertTriangle,
  Users,
  CheckCircle2,
  Megaphone,
  Clock3,
  Loader2,
} from "lucide-react";

import api from "../../services/api";

export default function NotificationBroadcastPage() {

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [audience, setAudience] =
    useState("ALL");

  const [priority, setPriority] =
    useState("NORMAL");

  const [sending, setSending] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [sentNotifications, setSentNotifications] =
    useState([]);

  useEffect(() => {

    loadBroadcasts();

  }, []);

  async function loadBroadcasts() {

    try {

      const response =
        await api.get("/notifications/");

      const broadcasts =
        response.data.notifications.filter(
          (notification) =>
            notification.type ===
            "AUTHORITY"
        );

      setSentNotifications(
        broadcasts
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  async function handleBroadcast() {

    if (
      !title.trim() ||
      !message.trim()
    ) {

      alert(
        "Please fill all fields."
      );

      return;

    }

    try {

      setSending(true);

      await api.post(
        "/notifications/create",
        {

          user_id: null,

          title,

          message,

          type: "AUTHORITY",

          priority,

          audience,

        }
      );

      const newNotification = {

        id: Date.now(),

        title,

        message,

        audience,

        priority,

        type: "AUTHORITY",

        created_at:
          new Date().toISOString(),

      };

      setSentNotifications(
        (prev) => [
          newNotification,
          ...prev,
        ]
      );

      setTitle("");

      setMessage("");

      setAudience("ALL");

      setPriority("NORMAL");

      alert(
        "Broadcast sent successfully."
      );

    } catch (error) {

      console.error(error);

      alert(
        "Unable to send broadcast."
      );

    } finally {

      setSending(false);

    }

  }

  function getPriorityColor(
    priority
  ) {

    switch (priority) {

      case "CRITICAL":

        return "bg-red-100 text-red-700";

      case "HIGH":

        return "bg-orange-100 text-orange-700";

      case "LOW":

        return "bg-blue-100 text-blue-700";

      default:

        return "bg-green-100 text-green-700";

    }

  }

  function formatTime(date) {

    if (!date)
      return "";

    return new Date(
      date
    ).toLocaleString();

  }

    if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <Loader2
          className="animate-spin text-violet-600"
          size={40}
        />

      </div>

    );

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
            emergency announcements,
            crowd alerts and public
            notifications to devotees.

          </p>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <StatCard
            title="Total Broadcasts"
            value={sentNotifications.length}
            icon={<Megaphone />}
            color="bg-violet-500"
          />

          <StatCard
            title="Recipients"
            value="All Users"
            icon={<Users />}
            color="bg-blue-500"
          />

          <StatCard
            title="Critical Alerts"
            value={
              sentNotifications.filter(
                (n) =>
                  n.priority ===
                  "CRITICAL"
              ).length
            }
            icon={<AlertTriangle />}
            color="bg-red-500"
          />

          <StatCard
            title="Delivered"
            value="100%"
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

                    className="w-full border rounded-xl px-4 py-3"

                    placeholder="Temple Notice"

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

                    className="w-full border rounded-xl px-4 py-3"

                  >

                    <option value="ALL">

                      All Users

                    </option>

                    <option value="DEVOTEE">

                      Devotees

                    </option>

                    <option value="AUTHORITY">

                      Authorities

                    </option>

                    <option value="ADMIN">

                      Admin

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

                    className="w-full border rounded-xl px-4 py-3"

                  >

                    <option value="LOW">

                      LOW

                    </option>

                    <option value="NORMAL">

                      NORMAL

                    </option>

                    <option value="HIGH">

                      HIGH

                    </option>

                    <option value="CRITICAL">

                      CRITICAL

                    </option>

                  </select>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">

                    Message

                  </label>

                  <textarea

                    rows={6}

                    value={message}

                    onChange={(e) =>
                      setMessage(
                        e.target.value
                      )
                    }

                    className="w-full border rounded-xl px-4 py-3"

                    placeholder="Write your broadcast message..."

                  />

                </div>

                <button

                  disabled={sending}

                  onClick={
                    handleBroadcast
                  }

                  className="w-full py-4 rounded-xl bg-violet-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"

                >

                  {sending ? (

                    <Loader2
                      className="animate-spin"
                      size={18}
                    />

                  ) : (

                    <Send
                      size={18}
                    />

                  )}

                  {

                    sending

                      ? "Sending..."

                      : "Broadcast Notification"

                  }

                </button>

              </div>

            </div>

          </div>

                    {/* Broadcast History */}

          <div className="lg:col-span-3">

            <div className="bg-white rounded-3xl p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-6">

                <Clock3 className="text-violet-600" />

                <h2 className="text-2xl font-bold">

                  Broadcast History

                </h2>

              </div>

              {

                sentNotifications.length === 0 ? (

                  <div className="text-center py-20">

                    <Megaphone
                      size={60}
                      className="mx-auto text-slate-300"
                    />

                    <h3 className="text-xl font-bold mt-5">

                      No Broadcasts Yet

                    </h3>

                    <p className="text-slate-500 mt-2">

                      Broadcasts sent by authorities
                      will appear here.

                    </p>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {

                      sentNotifications.map(
                        (notification) => (

                          <motion.div

                            key={notification.id}

                            whileHover={{
                              y: -2,
                            }}

                            className="border rounded-2xl p-5"

                          >

                            <div className="flex justify-between flex-wrap gap-4">

                              <div>

                                <h3 className="font-bold text-lg">

                                  {notification.title}

                                </h3>

                                <p className="text-slate-600 mt-2">

                                  {notification.message}

                                </p>

                                <div className="flex gap-5 mt-4 text-sm text-slate-500">

                                  <span>

                                    Audience :
                                    {" "}
                                    {notification.audience}

                                  </span>

                                  <span>

                                    Type :
                                    {" "}
                                    {notification.type}

                                  </span>

                                </div>

                              </div>

                              <div className="text-right">

                                <span

                                  className={`

                                    px-3

                                    py-1

                                    rounded-full

                                    text-sm

                                    font-semibold

                                    ${getPriorityColor(
                                      notification.priority
                                    )}

                                  `}

                                >

                                  {notification.priority}

                                </span>

                                <p className="text-xs text-slate-400 mt-4">

                                  {

                                    formatTime(
                                      notification.created_at
                                    )

                                  }

                                </p>

                              </div>

                            </div>

                          </motion.div>

                        )

                      )

                    }

                  </div>

                )

              }

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