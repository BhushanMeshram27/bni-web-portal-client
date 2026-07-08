"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiRoot } from "@/services/api";


function StatusBadge({ status }) {
  const styles = {
    scheduled: "bg-blue-50 text-blue-700 ring-blue-600/20",
    completed: "bg-green-50 text-green-700 ring-green-600/20",
    cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {(status || "scheduled").toUpperCase()}
    </span>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">
        {value || "—"}
      </dd>
    </div>
  );
}

export default function MemberSpeakingScheduleDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again.");
        }

        const response = await fetch(
          `${apiRoot}/speaking-schedule/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data = await response.json().catch(() => ({}));

        console.log("Schedule Response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to load speaking schedule.");
        }

        if (!data.success) {
          throw new Error(data.message || "Unable to fetch schedule.");
        }

        setSchedule(data.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        Loading speaking schedule...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="rounded-lg bg-red-100 text-red-700 p-4">
          {error}
        </div>

        <Link
          href="/member/speaking-schedule"
          className="mt-5 inline-block text-indigo-600 hover:underline"
        >
          ← Back to My Speaking Schedule
        </Link>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="rounded-lg bg-yellow-100 text-yellow-700 p-4">
          Speaking schedule not found.
        </div>

        <Link
          href="/member/speaking-schedule"
          className="mt-5 inline-block text-indigo-600 hover:underline"
        >
          ← Back to My Speaking Schedule
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Speaking Schedule Details
        </h1>

        <Link
          href="/member/speaking-schedule"
          className="text-indigo-600 hover:underline"
        >
          ← Back
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {schedule.topic}
          </h2>

          <StatusBadge status={schedule.status} />
        </div>

        <dl className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <Field
            label="Member"
            value={schedule.member?.name}
          />

          <Field
            label="Business"
            value={schedule.member?.businessName}
          />

          <Field
            label="Presentation Date"
            value={
              schedule.presentationDate
                ? new Date(schedule.presentationDate).toLocaleDateString()
                : null
            }
          />

          <Field
            label="Duration"
            value={
              schedule.duration
                ? `${schedule.duration} Minutes`
                : null
            }
          />

          <Field
            label="Status"
            value={schedule.status?.toUpperCase()}
          />

          <Field
            label="Completed Date"
            value={
              schedule.completedAt
                ? new Date(schedule.completedAt).toLocaleDateString()
                : "Not Completed"
            }
          />

          <Field
            label="Created By"
            value={schedule.createdBy?.name}
          />

        </dl>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-700">
            Remarks
          </h3>

          <p className="mt-2 whitespace-pre-wrap text-gray-700">
            {schedule.remarks || "No remarks available."}
          </p>
        </div>

      </div>
    </div>
  );
}