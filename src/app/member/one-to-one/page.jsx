"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRoot } from "@/services/api";

const statusStyles = {
  Scheduled: "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OneToOneListPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${apiRoot}/member/one-to-one`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await response.json();

      console.log("Meetings API Response:", res);

      if (!response.ok || res.success === false) {
        throw new Error(res.message || "Failed to load meetings");
      }

      setMeetings(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load meetings.");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  fetchMeetings();
}, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading meetings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          One-to-One Meetings
        </h1>

        <Link
          href="/member/one-to-one/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Schedule Meeting
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {meetings.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-gray-500">
          No One-to-One meetings found.
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => (
            <Link
              key={m._id}
              href={`/member/one-to-one/${m._id}`}
              className="block border rounded-lg p-4 hover:shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">
                    {m.memberA?.name} ↔ {m.memberB?.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {m.meetingDate
                      ? new Date(m.meetingDate).toLocaleDateString()
                      : "No Date"}

                    {m.duration ? ` • ${m.duration} mins` : ""}

                    {m.location ? ` • ${m.location}` : ""}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusStyles[m.status] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {m.status || "Scheduled"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}