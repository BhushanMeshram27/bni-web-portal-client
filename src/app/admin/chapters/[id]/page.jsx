"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

const positions = [
  { key: "president", label: "President" },
  { key: "vp", label: "VP" },
  { key: "secretary", label: "Secretary" },
  { key: "treasurer", label: "Treasurer" },
];

export default function AdminChapterDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [chapter, setChapter] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    meetingDay: "Monday",
    meetingTime: "",
    currency: "USD",
    status: "active",
  });

  const loadChapter = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/${id}`);
      setChapter(data.data);
      setForm({
        name: data.data.name || "",
        location: data.data.location || "",
        meetingDay: data.data.meetingDay || "Monday",
        meetingTime: data.data.meetingTime || "",
        currency: data.data.currency || "USD",
        status: data.data.status || "active",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load members belonging to this chapter, for the leadership dropdowns.
  // Assumes GET /api/members?chapter=<id> exists — adjust the path if yours differs.
  const loadMembers = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${apiRoot}/members?chapter=${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      setMembers(data.data || []);
    } catch {
      setMembers([]);
    }
  };

  useEffect(() => {
    if (id) {
      loadChapter();
      loadMembers();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const data = await apiRequest(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setChapter(data.data);
      setSuccess("Chapter details updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAssignLeadership = async (position, memberId) => {
    setError("");
    setSuccess("");
    try {
      const data = await apiRequest(`/${id}/leadership`, {
        method: "PUT",
        body: JSON.stringify({ position, memberId: memberId || null }),
      });
      setChapter((prev) => ({
        ...prev,
        leadership: { ...prev.leadership, [position]: data.data.leadership[position] },
      }));
      setSuccess(`${position.toUpperCase()} assignment updated.`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this chapter? This cannot be undone.")) return;
    setError("");
    try {
      await apiRequest(`/${id}`, { method: "DELETE" });
      router.push("/admin/chapters");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="max-w-3xl mx-auto px-4 py-8 text-sm text-gray-500">Loading…</p>;
  }

  if (!chapter) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-sm text-red-600">Chapter not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{chapter.name}</h1>
        <button
          onClick={handleDelete}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete Chapter
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-600">
          Total Revenue:{" "}
          <span className="font-medium text-gray-900">
            {chapter.currency} {chapter.totalRevenue?.toLocaleString() || 0}
          </span>
        </p>
      </div>

      {/* Edit chapter details */}
      <form onSubmit={handleSave} className="space-y-4 rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900">Chapter Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Day</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>

      {/* Leadership assignment */}
      <div className="space-y-4 rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900">Leadership Positions</h2>

        {positions.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
              value={chapter.leadership?.[key]?._id || ""}
              onChange={(e) => handleAssignLeadership(key, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Not assigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} {m.businessName ? `· ${m.businessName}` : ""}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}