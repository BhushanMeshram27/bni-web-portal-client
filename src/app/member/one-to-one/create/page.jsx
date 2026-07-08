"use client";
import { apiRoot } from "@/services/api";

// src/app/member/onetoone/create/page.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const todayStr = () => new Date().toISOString().split("T")[0];

function getCurrentUserId() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id;
  } catch {
    return null;
  }
}

// Normalize any id-ish value (string, ObjectId, {_id}) to a comparable string
const idToString = (id) => {
  if (id === null || id === undefined) return "";
  if (typeof id === "string") return id;
  if (typeof id === "object") {
    if (id._id) return idToString(id._id);
    if (typeof id.toString === "function") return id.toString();
  }
  return String(id);
};

export default function CreateOneToOnePage() {
  const router = useRouter();

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);

  const [form, setForm] = useState({
    memberB: "",
    meetingDate: todayStr(),
    duration: 30,
    location: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  (async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${apiRoot}/member/one-to-one/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await response.json();

      console.log("API Response:", res);

      const currentUserId = getCurrentUserId();

      const memberList = (res.data || []).filter(
        (m) => m._id !== currentUserId
      );

      setMembers(memberList);
    } catch (err) {
      console.error(err);
      setError("Failed to load members");
    } finally {
      setMembersLoading(false);
    }
  })();
}, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.memberB || !form.meetingDate) {
    setError("Member and meeting date are required.");
    return;
  }

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
      `${apiRoot}/member/one-to-one`,
      {
        method: "POST",
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
      throw new Error(res.message || "Failed to schedule meeting");
    }

    router.push(`/member/one-to-one/${res.data._id}`);
  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Schedule a One-to-One
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Member
          </label>
          <select
            name="memberB"
            value={form.memberB}
            onChange={handleChange}
            disabled={membersLoading}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            required
          >
            <option value="">
              {membersLoading
                ? "Loading members…"
                : members.length === 0
                ? "No members available"
                : "Select a member"}
            </option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} {m.businessName ? `· ${m.businessName}` : ""}
              </option>
            ))}
          </select>
        </div>

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
            placeholder="e.g. Coffee Shop / Zoom link"
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
            placeholder="Agenda or talking points…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? "Scheduling…" : "Schedule Meeting"}
        </button>
      </form>
    </div>
  );
}