"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiRoot } from "@/services/api";


const API_ROOT =
  process.env.NEXT_PUBLIC_API_URL || `${apiRoot}`;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}
function StatusBadge({ status }) {
  const styles = {
    scheduled: "bg-blue-50 text-blue-700 ring-blue-600/20",
    completed: "bg-green-50 text-green-700 ring-green-600/20",
    cancelled: "bg-gray-100 text-gray-600 ring-gray-500/20",
  };
  const style = styles[status] || styles.scheduled;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{value || "—"}</dd>
    </div>
  );
}

export default function AdminSpeakingScheduleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchSchedule() {
  setLoading(true);
  setError("");

  try {
    const token = getToken();

    const res = await fetch(`${API_ROOT}/speaking-schedule/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Failed to load schedule");
    }

    setSchedule(data.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
  async function handleComplete() {
  if (!confirm("Mark this presentation as completed?")) return;

  setBusy(true);

  try {
    const token = getToken();

    const res = await fetch(
      `${API_ROOT}/speaking-schedule/${id}/complete`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Failed to complete schedule");
    }

    await fetchSchedule();
  } catch (err) {
    alert(err.message);
  } finally {
    setBusy(false);
  }
}

 async function handleDelete() {
  if (!confirm("Delete this speaking schedule?")) return;

  setBusy(true);

  try {
    const token = getToken();

    const res = await fetch(
      `${API_ROOT}/speaking-schedule/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Delete failed");
    }

    router.push("/admin/speaking-schedule");
  } catch (err) {
    alert(err.message);
    setBusy(false);
  }
}
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-gray-500">
        Loading schedule...
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Schedule not found."}
        </div>
        <Link
          href="/admin/speaking-schedule"
          className="mt-4 inline-block text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Speaking Schedule Details
        </h1>
        <Link
          href="/admin/speaking-schedule"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to list
        </Link>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            {schedule.topic}
          </h2>
          <StatusBadge status={schedule.status} />
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Member Name" value={schedule.member?.name || schedule.memberName} />
          <Field label="Business Name" value={schedule.member?.businessName} />
          <Field label="Email" value={schedule.member?.email} />
          <Field
            label="Presentation Date"
            value={
              schedule.presentationDate
                ? new Date(schedule.presentationDate).toLocaleDateString()
                : null
            }
          />
          <Field label="Duration" value={schedule.duration ? `${schedule.duration} min` : null} />
          <Field label="Created By" value={schedule.createdBy?.name || schedule.createdBy} />
          <Field
            label="Completed Date"
            value={
              schedule.completedDate
                ? new Date(schedule.completedDate).toLocaleDateString()
                : null
            }
          />
        </dl>

        <div className="mt-6">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Remarks
          </dt>
          <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
            {schedule.remarks || "No remarks added."}
          </dd>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Link
          href="/admin/speaking-schedule"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </Link>
        <Link
          href={`/admin/speaking-schedule/${id}/edit`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit
        </Link>
        {schedule.status !== "completed" && (
          <button
            onClick={handleComplete}
            disabled={busy}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50"
          >
            Mark Completed
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={busy}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
