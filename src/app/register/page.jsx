"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import SiteLayout from "@/components/layout/SiteLayout";
import { apiRoot } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "member",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "email"
          ? value.trim().toLowerCase()
          : value,
    }));
  };

  const validateForm = () => {
    const nameRegex =
      /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;

    if (!nameRegex.test(formData.name.trim())) {
      alert(
        "Please enter your full name (First & Last Name)."
      );
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email.");
      return false;
    }

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(formData.mobile)) {
      alert("Please enter a valid mobile number.");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must contain uppercase, lowercase, number and special character."
      );
      return false;
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${apiRoot}/auth/register`,
        {
          name: formData.name.trim(),
          businessName:
            formData.businessName.trim(),
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          role: "member",
        },
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      alert(
        data.message ||
        "Registration Successful"
      );

      router.replace("/login");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-7xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-2">

          {/* Left Section */}
          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-14">

            <span className="inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
              Welcome to TYFCB
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Grow Your
              <br />
              Business Network
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              Join thousands of entrepreneurs and professionals
              building trusted business relationships and quality
              referrals.
            </p>

            <div className="grid grid-cols-2 gap-5 mt-12">

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <h2 className="text-3xl font-bold">10K+</h2>
                <p className="mt-2 text-blue-100">
                  Active Members
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <h2 className="text-3xl font-bold">250+</h2>
                <p className="mt-2 text-blue-100">
                  Chapters
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <h2 className="text-3xl font-bold">5000+</h2>
                <p className="mt-2 text-blue-100">
                  Referrals
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <h2 className="text-3xl font-bold">₹50Cr+</h2>
                <p className="mt-2 text-blue-100">
                  Business Generated
                </p>
              </div>

            </div>

          </div>

          {/* Right Section */}
          <div className="bg-white p-8 md:p-12">

            <div className="mx-auto max-w-xl">

              <h2 className="text-center text-4xl font-bold text-gray-900">
                Create Account
              </h2>

              <p className="mt-3 text-center text-gray-500">
                Register to start growing your business
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-10 grid gap-5 md:grid-cols-2"
              >

                {/* Full Name */}
                <div>
                  <label className="mb-2 block font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                    autoComplete="name"
                    className="h-14 w-full rounded-xl border border-gray-300 px-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Business */}
                <div>
                  <label className="mb-2 block font-medium">
                    Business Name
                  </label>

                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    required
                    disabled={loading}
                    autoComplete="organization"
                    className="h-14 w-full rounded-xl border border-gray-300 px-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    autoComplete="email"
                    className="h-14 w-full rounded-xl border border-gray-300 px-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="mb-2 block font-medium">
                    Mobile
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter your mobile number"
                    required
                    disabled={loading}
                    autoComplete="tel"
                    className="h-14 w-full rounded-xl border border-gray-300 px-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block font-medium">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      autoComplete="new-password"
                      className="h-14 w-full rounded-xl border border-gray-300 px-4 pr-12 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block font-medium">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      placeholder="confirm your password"
                      required
                      disabled={loading}
                      autoComplete="new-password"
                      className="h-14 w-full rounded-xl border border-gray-300 px-4 pr-12 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>
                </div>
                {/* Terms & Conditions */}
                <div className="md:col-span-2">
                  <label className="flex items-start gap-3 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      required
                      disabled={loading}
                      className="mt-1 h-4 w-4 accent-blue-600"
                    />

                    <span>
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="md:col-span-2 flex h-14 items-center justify-center rounded-xl bg-blue-600 text-lg font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <svg
                        className="mr-2 h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>

                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?
                </p>

                <Link
                  href="/login"
                  className="mt-2 inline-block text-lg font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Sign In
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}