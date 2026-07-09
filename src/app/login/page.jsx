"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { apiRoot } from "@/services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${apiRoot}/auth/login`,
        formData
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "member") {
        router.push("/member/dashboard");
      } else {
        router.push("/visitor/dashboard");
      }
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-6xl bg-white rounded-4xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-center p-14 bg-linear-to-br from-blue-700 via-indigo-700 to-gray-900 text-white">

          <h1 className="text-6xl font-bold leading-tight">
            Grow Your
            <br />
            Business Network
          </h1>

          <p className="mt-6 text-lg text-blue-100 leading-8">
            Connect with professionals, generate referrals,
            attend meetings and build powerful business
            relationships through our portal.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md">
              <h2 className="text-3xl font-bold">10K+</h2>
              <p>Members</p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md">
              <h2 className="text-3xl font-bold">5000+</h2>
              <p>Referrals</p>
            </div>
          </div>

        </div>

        {/* Right Section */}
        <div className="relative bg-white p-8 md:p-12">

          {/* Logo */}
          <div className="absolute top-8 right-8">
            <Image
              src="/bni-logo.webp"
              alt="BNI Logo"
              width={140}
              height={50}
              priority
              className="w-25 h-auto"
            />
          </div>

          <div className="max-w-md mx-auto mt-16">

            <h2 className="text-4xl font-bold text-gray-900">
              Welcome Back
            </h2>

            <p className="text-gray-700 mt-3">
              Sign in to access your account
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5"
            >

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full h-14 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Password */}
              <div>
  <label className="block mb-2 text-sm font-medium text-gray-700">
    Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Enter your password"
      required
      className="w-full h-14 px-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
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

                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" />
                  Remember Me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Forgot Password?
                </Link>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300 disabled:opacity-70"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

            </form>

            <p className="text-center mt-8 text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Create Account
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}