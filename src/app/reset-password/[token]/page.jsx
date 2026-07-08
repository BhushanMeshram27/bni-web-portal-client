"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function ResetPasswordPage() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${apiRoot}/auth/reset-password/${token}`,
        { password }
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 border rounded-lg px-4 mb-4"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full h-12 border rounded-lg px-4 mb-4"
          required
        />

        <button
          type="submit"
          className="w-full h-12 bg-blue-600 text-white rounded-lg"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}