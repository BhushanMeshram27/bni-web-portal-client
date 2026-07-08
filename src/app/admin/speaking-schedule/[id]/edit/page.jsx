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
  const url = `${apiRoot}/speaking-schedule${path}`;

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
      `Expected JSON but got "${contentType}" (${res.status})`
    );
  }

  const data = text ? JSON.parse(text) : {};

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export default function EditSpeakingSchedulePage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    presentationDate: "",
    topic: "",
    duration: 10,
    remarks: "",
    status: "scheduled",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
  if (!id) return;

  const loadSchedule = async () => {
    try {
      setLoading(true);

      const data = await apiRequest(`/${id}`);
      const s = data.data;

      setForm({
        presentationDate: s.presentationDate
          ? new Date(s.presentationDate).toISOString().split("T")[0]
          : "",
        topic: s.topic || "",
        duration: s.duration || 10,
        remarks: s.remarks || "",
        status: s.status || "scheduled",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadSchedule();
}, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
  e.preventDefault();

  setSaving(true);
  setError("");
  setSuccess("");

  try {
    await apiRequest(`/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...form,
        duration: Number(form.duration),
      }),
    });

    setSuccess("Schedule updated successfully.");

    setTimeout(() => {
      router.push(`/admin/speaking-schedule/${id}`);
    }, 1000);
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
};

 const handleDelete = async () => {
  if (!window.confirm("Delete this speaking schedule?")) return;

  try {
    await apiRequest(`/${id}`, {
      method: "DELETE",
    });

    router.replace("/admin/speaking-schedule");
  } catch (err) {
    setError(err.message);
  }
};

  if (loading) {
    return <p className="max-w-lg mx-auto px-4 py-8 text-sm text-gray-500">Loading…</p>;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Presentation</h1>
        <button
          onClick={handleDelete}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presentation Date
            </label>
            <input
              type="date"
              name="presentationDate"
              value={form.presentationDate}
              onChange={handleChange}
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
              min={1}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
          <input
            type="text"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
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
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}