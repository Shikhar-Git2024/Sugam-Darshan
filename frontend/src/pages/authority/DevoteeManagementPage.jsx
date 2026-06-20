import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Mail,
  Shield,
  UserCheck,
  User,
} from "lucide-react";

import api from "../../services/api";

export default function DevoteeManagementPage() {
  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response =
        await api.get(
          "/dashboard/users"
        );

      setUsers(
        response.data.users || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers =
    users.filter((user) =>
      JSON.stringify(user)
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const devoteeCount =
    users.filter(
      (u) =>
        u.role === "DEVOTEE"
    ).length;

  const authorityCount =
    users.filter(
      (u) =>
        u.role === "AUTHORITY"
    ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Devotee Management
          </h1>

          <p className="text-slate-600 mt-3">
            Manage registered
            devotees and authority
            accounts.
          </p>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <StatCard
            title="Total Users"
            value={users.length}
            icon={<Users />}
            color="bg-violet-500"
          />

          <StatCard
            title="Devotees"
            value={devoteeCount}
            icon={<User />}
            color="bg-blue-500"
          />

          <StatCard
            title="Authorities"
            value={authorityCount}
            icon={<Shield />}
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
              placeholder="Search users..."
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

        {/* Users Table */}

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">
              Registered Users
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50">

                  <th className="text-left p-4">
                    ID
                  </th>

                  <th className="text-left p-4">
                    Name
                  </th>

                  <th className="text-left p-4">
                    Email
                  </th>

                  <th className="text-left p-4">
                    Role
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => (

                    <motion.tr
                      key={user.id}
                      whileHover={{
                        backgroundColor:
                          "#f8fafc",
                      }}
                      className="border-t"
                    >

                      <td className="p-4 font-medium">
                        {user.id}
                      </td>

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              h-10
                              w-10
                              rounded-full
                              bg-violet-100
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <User
                              size={18}
                              className="text-violet-600"
                            />
                          </div>

                          <div>
                            <div className="font-medium">
                              {user.name}
                            </div>
                          </div>

                        </div>

                      </td>

                      <td className="p-4">

                        <div className="flex items-center gap-2">

                          <Mail
                            size={16}
                            className="text-slate-400"
                          />

                          {user.email}

                        </div>

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
                              user.role ===
                              "AUTHORITY"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }
                          `}
                        >
                          {user.role}
                        </span>

                      </td>

                      <td className="p-4">

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-2
                            text-green-600
                            font-medium
                          "
                        >
                          <UserCheck
                            size={16}
                          />
                          Active
                        </span>

                      </td>

                    </motion.tr>

                  )
                )}

              </tbody>

            </table>

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