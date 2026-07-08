"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRoot } from "@/services/api";


const statusStyles = {
  scheduled: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function MySpeakingSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again.");
        }

        const response = await fetch(
          `${apiRoot}/speaking-schedule/my`,
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

        console.log("Speaking Schedule Response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to load speaking schedules.");
        }

        if (!data.success) {
          throw new Error(data.message || "Unable to fetch schedules.");
        }

        setSchedules(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-gray-500">Loading speaking schedules...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          My Speaking Schedule
        </h1>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-100 border border-red-300 p-4 text-red-700">
          {error}
        </div>
      )}

      {!error && schedules.length === 0 ? (
        <div className="rounded-lg border border-gray-300 p-8 text-center text-gray-500">
          No speaking schedules found.
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <Link
              key={schedule._id}
              href={`/member/speaking-schedule/${schedule._id}`}
            >
              <div className="rounded-lg border p-5 shadow-sm hover:shadow-md transition cursor-pointer">

                <div className="flex justify-between items-start">

                  <div>
                    <h2 className="text-lg font-semibold">
                      {schedule.topic}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {schedule.presentationDate
                        ? new Date(
                            schedule.presentationDate
                          ).toLocaleDateString()
                        : "No Date"}

                      {schedule.duration
                        ? ` • ${schedule.duration} mins`
                        : ""}
                    </p>

                    {schedule.remarks && (
                      <p className="mt-2 text-sm text-gray-600">
                        {schedule.remarks}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[schedule.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {(schedule.status || "scheduled").toUpperCase()}
                  </span>

                </div>

                {schedule.completedAt && (
                  <p className="mt-4 text-sm text-green-600">
                    Completed on{" "}
                    {new Date(
                      schedule.completedAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}