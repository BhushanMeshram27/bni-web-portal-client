"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function MemberAttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${apiRoot}/attendance/member/my-attendance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAttendance(res.data.attendance || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Stats
  const presentCount = attendance.filter(
    (a) => a.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (a) => a.status === "Absent"
  ).length;

  const percentage =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Attendance...
        </h2>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-red-600 text-lg font-semibold">
          {error}
        </h2>
        <button
          onClick={fetchAttendance}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow mb-6">
        <h1 className="text-3xl font-bold">
          My Attendance
        </h1>
        <p className="text-blue-100 mt-1">
          Track your meeting participation
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Present</p>
          <h2 className="text-3xl font-bold text-green-600">
            {presentCount}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Absent</p>
          <h2 className="text-3xl font-bold text-red-600">
            {absentCount}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Attendance %</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {percentage}%
          </h2>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">
          Attendance Progress
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-4 border-b font-bold text-lg">
          Attendance Records
        </div>

        {attendance.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No attendance records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Meeting</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {attendance.map((item) => {
                  const meeting = item.meeting;

                  return (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">
                        {meeting?.title || "N/A"}
                      </td>

                      <td className="p-3">
                        {meeting?.meetingDate
                          ? new Date(
                              meeting.meetingDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="p-3">
                        {meeting?.location || "N/A"}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>

    </div>
  );
}