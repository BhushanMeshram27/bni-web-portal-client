"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      const res = await axios.get(
        `${apiRoot}/member/attendance/my-attendance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAttendance(res.data.attendance || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const attendancePercentage =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;

  const filteredAttendance =
  filter === "all"
    ? attendance
    : attendance.filter((item) => {
        if (!item.meeting?.meetingDate) return false;

        const date = new Date(item.meeting.meetingDate);
        const now = new Date();

        if (filter === "month") {
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        }

        if (filter === "week") {
          const diff = (now - date) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 7;
        }

        return true;
      });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading Attendance...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-semibold text-red-600">{error}</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">

      {/* Banner */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold">My Attendance</h1>
        <p className="mt-2 text-blue-100">
          Track your attendance performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Present" value={presentCount} color="text-green-600" />
        <StatCard label="Absent" value={absentCount} color="text-red-600" />
        <StatCard label="Attendance %" value={`${attendancePercentage}%`} color="text-blue-600" />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
        <div className="flex justify-between mb-3">
          <h2 className="text-xl font-bold">Attendance Performance</h2>
          <span className="font-bold text-blue-600">
            {attendancePercentage}%
          </span>
        </div>

        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-600"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-4 flex gap-3">
        <select
          className="border p-2 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Attendance Records</h2>
        </div>

        {attendance.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No Attendance Records Found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left">Meeting</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.map((item) => {
                  return (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <td className="px-6 py-4">
                        {item.meeting?.title || "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        {item.meeting?.meetingDate
                          ? new Date(item.meeting.meetingDate).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        {item.meeting?.location || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${item.status === "Present"
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

/* Small reusable component */
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <p className="text-gray-500">{label}</p>
      <h2 className={`text-5xl font-bold mt-2 ${color}`}>{value}</h2>
    </div>
  );
}