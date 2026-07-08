"use client";
import { apiRoot } from "@/services/api";

// src/app/member/onetoone/[id]/page.jsx
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const statusStyles = {
  Scheduled: "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OneToOneDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);

  const [showComplete, setShowComplete] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [palmsUpdated, setPalmsUpdated] = useState(false);

  const load = async () => {
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

    setMeeting(res.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
  if (!confirm("Delete this meeting? This cannot be undone.")) return;

  setBusy(true);
  setActionError("");

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${apiRoot}/member/one-to-one/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const res = await response.json();

    if (!response.ok || res.success === false) {
      throw new Error(res.message || "Failed to delete meeting");
    }

    router.push("/member/one-to-one");
  } catch (err) {
    setActionError(err.message);
  } finally {
    setBusy(false);
  }
};

 const handleComplete = async (e) => {
  e.preventDefault();

  if (!outcome.trim()) {
    setActionError("Outcome is required.");
    return;
  }

  setBusy(true);
  setActionError("");

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${apiRoot}/member/one-to-one/${id}/complete`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          outcome,
          palmsUpdated,
        }),
      }
    );

    const res = await response.json();

    if (!response.ok || res.success === false) {
      throw new Error(res.message || "Failed to complete meeting");
    }

    setMeeting(res.data);
    setShowComplete(false);
  } catch (err) {
    setActionError(err.message);
  } finally {
    setBusy(false);
  }
};

  if (loading) {
    return <p className="max-w-2xl mx-auto px-4 py-8 text-gray-500 text-sm">Loading…</p>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {meeting.memberA?.name} ↔ {meeting.memberB?.name}
          </h1>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              statusStyles[meeting.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {meeting.status}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-gray-500">Date</dt>
          <dd className="text-gray-900">
            {new Date(meeting.meetingDate).toLocaleDateString()}
          </dd>
          <dt className="text-gray-500">Duration</dt>
          <dd className="text-gray-900">{meeting.duration} mins</dd>
          <dt className="text-gray-500">Location</dt>
          <dd className="text-gray-900">{meeting.location || "—"}</dd>
          <dt className="text-gray-500">Notes</dt>
          <dd className="text-gray-900">{meeting.notes || "—"}</dd>
          {meeting.status === "Completed" && (
            <>
              <dt className="text-gray-500">Outcome</dt>
              <dd className="text-gray-900">{meeting.outcome}</dd>
              <dt className="text-gray-500">Palms Updated</dt>
              <dd className="text-gray-900">{meeting.palmsUpdated ? "Yes" : "No"}</dd>
            </>
          )}
        </dl>

        {actionError && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        {meeting.status === "Scheduled" && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/member/one-to-one/${id}/edit`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowComplete((s) => !s)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              Mark Completed
            </button>
            <button
              onClick={handleDelete}
              disabled={busy}
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        )}

        {showComplete && (
          <form onSubmit={handleComplete} className="mt-5 space-y-4 border-t border-gray-100 pt-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outcome
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                rows={3}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="What was discussed / decided?"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={palmsUpdated}
                onChange={(e) => setPalmsUpdated(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              PALMS updated
            </label>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              {busy ? "Saving…" : "Confirm Completion"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
