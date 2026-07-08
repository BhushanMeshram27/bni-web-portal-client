"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function CreateSpeakingSchedulePage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    member: "",
    presentationDate: "",
    topic: "",
    duration: "",
    remarks: "",
  });

  useEffect(() => {
    async function loadMembers() {
      try {
        // Assumes a members endpoint exists for populating the dropdown.
        const res = await fetch("/api/members", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load members.");
        const data = await res.json();
        setMembers(Array.isArray(data) ? data : data.members || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingMembers(false);
      }
    }
    loadMembers();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.member || !form.presentationDate || !form.topic || !form.duration) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/speaking-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member: form.member,
          presentationDate: form.presentationDate,
          topic: form.topic,
          duration: Number(form.duration),
          remarks: form.remarks,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create schedule.");
      }

      router.push("/admin/speaking-schedule");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          New Speaking Schedule
        </h1>
        <Link
          href="/admin/speaking-schedule"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to list
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && (
          <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Member *
          </label>
          <select
            name="member"
            value={form.member}
            onChange={handleChange}
            disabled={loadingMembers}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="">
              {loadingMembers ? "Loading members..." : "Select a member"}
            </option>
            {members.map((m) => (
              <option key={m._id || m.id} value={m._id || m.id}>
                {m.name} {m.businessName ? `— ${m.businessName}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Presentation Date *
          </label>
          <input
            type="date"
            name="presentationDate"
            value={form.presentationDate}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Topic *
          </label>
          <input
            type="text"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            placeholder="e.g. Building Local Referral Networks"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration (minutes) *
          </label>
          <input
            type="number"
            name="duration"
            min="1"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 15"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            rows={4}
            placeholder="Optional notes for this schedule"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/speaking-schedule"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}
