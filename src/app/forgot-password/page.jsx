"use client";

import { useState } from "react";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${apiRoot}/auth/forgot-password`,
        { email }
      );

      alert(res.data.message);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full h-12 border rounded-xl px-4"
          required
        />

        <button
          type="submit"
          className="w-full h-12 mt-5 bg-blue-600 text-white rounded-xl"
        >
          Send Reset Link
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = "/login")}
          className="w-full h-12 mt-3 bg-gray-300 text-black rounded-xl hover:bg-gray-500"
        >
          Back to Login
        </button>
      </form>

    </div>
  );
}