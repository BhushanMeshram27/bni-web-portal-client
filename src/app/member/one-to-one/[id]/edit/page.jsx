"use client";
import { apiRoot } from "@/services/api";

// src/app/member/onetoone/[id]/edit/page.jsx
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const todayStr = () => new Date().toISOString().split("T")[0];
const toDateInputValue = (isoDate) =>
  isoDate ? new Date(isoDate).toISOString().split("T")[0] : "";

export default function EditOneToOnePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Only these fields are editable — the backend rejects status, outcome,
  // palmsUpdated, memberA and memberB on this endpoint.
  const [form, setForm] = useState({
    meetingDate: "",
    duration: 30,
    location: "",
    notes: "",
  });

 useEffect(() => {
  (async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${apiRoot}/member/one-to-one/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await response.json();

      if (!response.ok || res.success === false) {
        throw new Error(res.message || "Failed to load meeting");
      }

      const m = res.data;

      if (m.status !== "Scheduled") {
        setError("Only a scheduled meeting can be edited.");
        return;
      }

      setForm({
        meetingDate: toDateInputValue(m.meetingDate),
        duration: m.duration,
        location: m.location || "",
        notes: m.notes || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  })();
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const numericDuration = Number(form.duration);

  if (
    Number.isNaN(numericDuration) ||
    numericDuration < 15 ||
    numericDuration > 240
  ) {
    setError("Duration must be between 15 and 240 minutes.");
    return;
  }

  setSubmitting(true);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${apiRoot}/member/one-to-one/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          duration: numericDuration,
        }),
      }
    );

    const res = await response.json();

    if (!response.ok || res.success === false) {
      throw new Error(res.message || "Failed to update meeting");
    }

    router.push(`/member/one-to-one/${id}`);
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};
  if (loading) {
    return <p className="max-w-lg mx-auto px-4 py-8 text-gray-500 text-sm">Loading…</p>;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link
        href={`/member/one-to-one/${id}`}
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Back to meeting
      </Link>

      <h1 className="text-2xl font-semibold text-gray-900 mt-4 mb-6">
        Edit Meeting
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error || form.meetingDate ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Date
              </label>
              <input
                type="date"
                name="meetingDate"
                value={form.meetingDate}
                onChange={handleChange}
                min={todayStr()}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (mins)
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                min={15}
                max={240}
                step={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
