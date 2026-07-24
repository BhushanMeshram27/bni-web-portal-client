"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import SiteLayout from "@/components/layout/SiteLayout";
import { apiRoot } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${apiRoot}/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        alert("Invalid response from server.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else if (user.role === "member") {
        router.replace("/member/dashboard");
      } else {
        router.replace("/");
      }
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 px-4 py-10">
        <div className="grid w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

          {/* Left */}
          <div className="hidden lg:flex lg:flex-col lg:justify-center bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-16 text-white">
            <h1 className="text-6xl font-bold leading-tight">
              Grow Your
              <br />
              Business Network
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              Connect with professionals, generate referrals,
              attend meetings and build powerful business
              relationships.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-5">
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <h2 className="text-3xl font-bold">10K+</h2>
                <p>Members</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">
                <h2 className="text-3xl font-bold">5000+</h2>
                <p>Referrals</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="p-8 md:p-12">
           <div className="mx-auto w-full max-w-xl">

              <h2 className="text-center text-4xl font-bold text-gray-900">
                Welcome Back
              </h2>

              <p className="mt-3 text-center text-gray-500">
                Sign in to access your account
              </p>

              <form
                onSubmit={handleSubmit}
              className="mt-10 space-y-6"
              >
                {/* Email */}
                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="h-14 w-full rounded-xl border border-gray-300 px-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      className="h-14 w-full rounded-xl border border-gray-300 px-4 pr-12 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    Remember Me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <p className="mt-8 text-center text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Create Account
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}