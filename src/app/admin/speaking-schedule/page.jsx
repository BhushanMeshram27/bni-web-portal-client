"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRoot } from "@/services/api";

const API_ROOT =
  process.env.NEXT_PUBLIC_API_URL || `${apiRoot}`;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}
async function apiRequest(path = "", options = {}) {
  const token = getToken();

  const res = await fetch(`${API_ROOT}/speaking-schedule${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Server returned invalid response (${res.status})`);
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}
const statusStyles = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};

const today = () => new Date().toISOString().split("T")[0];

export default function AdminSpeakingSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);

  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    member: "",
    presentationDate: today(),
    topic: "",
    duration: 10,
    remarks: "",
  });

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("");
      setSchedules(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
  try {
    setMembersLoading(true);

    const token = getToken();

    const res = await fetch(`${API_ROOT}/members`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const text = await res.text();

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Invalid JSON returned from server");
    }

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Failed to load members");
    }

    setMembers(data.data || []);
  } catch (err) {
    console.error(err);
    setError(err.message);
    setMembers([]);
  } finally {
    setMembersLoading(false);
  }
};
  useEffect(() => {
    loadSchedules();
    loadMembers();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.member || !form.presentationDate || !form.topic) {
      setError("Member, date, and topic are required");
      return;
    }

    try {
      setCreating(true);

      await apiRequest("", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          duration: Number(form.duration),
        }),
      });

      setForm({
        member: "",
        presentationDate: today(),
        topic: "",
        duration: 10,
        remarks: "",
      });

      setShowForm(false);
      await loadSchedules();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this schedule?")) return;

    try {
      await apiRequest(`/${id}`, { method: "DELETE" });
      setSchedules((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      const data = await apiRequest(`/${id}/complete`, {
        method: "PUT",
      });

      setSchedules((prev) =>
        prev.map((s) => (s._id === id ? data.data : s))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Speaking Schedule</h1>

        <button
          onClick={() => setShowForm((p) => !p)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? "Cancel" : "+ Schedule"}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 border p-4 rounded space-y-3"
        >
          <select
            name="member"
            value={form.member}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">
              {membersLoading ? "Loading..." : "Select Member"}
            </option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="presentationDate"
            value={form.presentationDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            placeholder="Topic"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Remarks"
          />

          <button
            disabled={creating}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : schedules.length === 0 ? (
        <p>No schedules found</p>
      ) : (
        <div className="space-y-3">
          {schedules.map((s) => (
            <div key={s._id} className="border p-4 rounded">
              <div className="flex justify-between">
                <h2 className="font-semibold">{s.topic}</h2>

                <span
                  className={`px-2 py-1 text-xs rounded ${
                    statusStyles[s.status]
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                {s.member?.name} •{" "}
                {new Date(s.presentationDate).toLocaleDateString()} •{" "}
                {s.duration} mins
              </p>

              <div className="flex gap-3 mt-3">
                <Link
                  href={`/admin/speaking-schedule/${s._id}`}
                  className="text-indigo-600 text-sm"
                >
                  View
                </Link>

                {s.status === "scheduled" && (
                  <button
                    onClick={() => handleComplete(s._id)}
                    className="text-green-600 text-sm"
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}