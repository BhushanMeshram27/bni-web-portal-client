"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { apiRoot } from "@/services/api";
import SiteLayout from "@/components/layout/SiteLayout";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(`${apiRoot}/auth/forgot-password`, { email });

      alert(res.data.message);
      setEmail("");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-100 px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center mb-2">Forgot Password</h1>

          <p className="text-gray-500 text-center mb-6">
            Enter your registered email to receive a password reset link.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <Link
            href="/login"
            className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
          >
            Back to Login
          </Link>
        </form>
      </div>
    </SiteLayout>
  );
}
