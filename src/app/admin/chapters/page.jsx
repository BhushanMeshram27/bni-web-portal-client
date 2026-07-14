"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRoot } from "@/services/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const url = `${apiRoot}/chapters${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but got "${contentType || "unknown"}" (status ${res.status}).\nURL: ${url}`
    );
  }

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid JSON response from server.");
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed with status ${res.status}.`);
  }

  return data;
}

const weekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    meetingDay: "Monday",
    meetingTime: "",
    currency: "USD",
  });

  const loadChapters = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("");
      setChapters(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChapters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Chapter name is required.");
      return;
    }

    setCreating(true);
    try {
      await apiRequest("", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", location: "", meetingDay: "Monday", meetingTime: "", currency: "USD" });
      setShowForm(false);
      await loadChapters();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Chapters</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {showForm ? "Cancel" : "+ New Chapter"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 space-y-4 rounded-lg border border-gray-200 p-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapter Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Downtown Business Chapter"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City / venue"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Day
              </label>
              <select
                name="meetingDay"
                value={form.meetingDay}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {weekdays.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Time
              </label>
              <input
                type="text"
                name="meetingTime"
                value={form.meetingTime}
                onChange={handleChange}
                placeholder="07:30 AM"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {creating ? "Creating…" : "Create Chapter"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : chapters.length === 0 ? (
        <p className="text-sm text-gray-500">No chapters yet.</p>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter) => (
  <Link
    key={chapter._id}
    href={`/admin/chapters/${chapter._id}`}
    className="block rounded-lg border border-gray-200 p-4 hover:border-indigo-300 hover:shadow transition"
  >
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">
        {chapter.name}
      </h2>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          chapter.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {chapter.status}
      </span>
    </div>

    <div className="mt-3 space-y-1 text-sm text-gray-600">
      <p>
        <strong>Location:</strong>{" "}
        {chapter.location || "Not specified"}
      </p>

      <p>
        <strong>Meeting:</strong>{" "}
        {chapter.meetingDay} {chapter.meetingTime}
      </p>

      <p>
        <strong>Currency:</strong>{" "}
        {chapter.currency}
      </p>
    </div>
  </Link>
          ))}
        </div>
      )}
    </div>
  );
}