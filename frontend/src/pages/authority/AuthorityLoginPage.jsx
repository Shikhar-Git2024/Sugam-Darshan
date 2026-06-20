import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  AlertTriangle,
} from "lucide-react";

import api from "../../services/api";

export default function AuthorityLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await api.post(
          "/login",
          {
            email,
            password,
          }
        );

      const data =
        response.data;

      if (
        data.user.role !==
        "AUTHORITY"
      ) {
        setError(
          "Unauthorized Access"
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );

      navigate(
        "/authority/dashboard"
      );

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data
          ?.detail ||
          "Invalid credentials"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        min-h-screen
        bg-slate-950
        flex
        items-center
        justify-center
        p-6
        relative
        overflow-hidden
      "
    >

      {/* Background Glow */}

      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[700px]
          h-[700px]
          bg-violet-600/10
          blur-[180px]
        "
      />

      <div
        className="
          absolute
          bottom-0
          right-0
          w-[500px]
          h-[500px]
          bg-cyan-500/10
          blur-[180px]
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          w-full
          max-w-md
          bg-slate-900/80
          backdrop-blur-xl
          border
          border-slate-800
          rounded-3xl
          p-8
          shadow-2xl
          relative
          z-10
        "
      >

        {/* Logo */}

        <div className="text-center mb-8">

          <div
            className="
              h-20
              w-20
              rounded-3xl
              bg-gradient-to-br
              from-violet-600
              to-indigo-600
              mx-auto
              flex
              items-center
              justify-center
            "
          >
            <Shield
              size={40}
              className="text-white"
            />
          </div>

          <h1
            className="
              text-3xl
              font-bold
              text-white
              mt-5
            "
          >
            Authority Portal
          </h1>

          <p
            className="
              text-slate-400
              mt-2
            "
          >
            Restricted Administrative
            Access
          </p>

        </div>

        {/* Security Notice */}

        <div
          className="
            bg-red-500/10
            border
            border-red-500/20
            rounded-2xl
            p-4
            mb-6
            flex
            gap-3
          "
        >

          <AlertTriangle
            size={20}
            className="
              text-red-400
              shrink-0
            "
          />

          <p
            className="
              text-red-300
              text-sm
            "
          >
            Authorized personnel only.
            All login attempts are
            monitored and recorded.
          </p>

        </div>

        {error && (
          <div
            className="
              bg-red-500/10
              border
              border-red-500/20
              rounded-xl
              p-3
              mb-5
              text-red-300
              text-sm
            "
          >
            {error}
          </div>
        )}

        <form
          onSubmit={
            handleLogin
          }
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label
              className="
                text-slate-400
                text-sm
              "
            >
              Authority Email
            </label>

            <div className="relative mt-2">

              <Mail
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="
                  w-full
                  pl-12
                  pr-4
                  py-3
                  bg-slate-950
                  border
                  border-slate-800
                  rounded-xl
                  text-white
                  outline-none
                  focus:border-violet-500
                "
                placeholder="authority@rammandir.org"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label
              className="
                text-slate-400
                text-sm
              "
            >
              Password
            </label>

            <div className="relative mt-2">

              <Lock
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  pl-12
                  pr-4
                  py-3
                  bg-slate-950
                  border
                  border-slate-800
                  rounded-xl
                  text-white
                  outline-none
                  focus:border-violet-500
                "
                placeholder="••••••••"
              />

            </div>

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-indigo-600
              text-white
              font-semibold
              hover:shadow-xl
              hover:shadow-violet-600/30
              transition-all
            "
          >
            {loading
              ? "Authenticating..."
              : "Access Command Center"}
          </button>

        </form>

      </motion.div>

    </div>
  );
}