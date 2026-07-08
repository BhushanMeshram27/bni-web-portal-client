"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function AdminAttendancePage() {
const [attendance, setAttendance] = useState([]);
const [filteredAttendance, setFilteredAttendance] =
useState([]);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
fetchAttendance();
}, []);

useEffect(() => {
const filtered = attendance.filter((item) =>
item.attendee?.name
?.toLowerCase()
.includes(search.toLowerCase())
);

setFilteredAttendance(filtered);

}, [search, attendance]);

const fetchAttendance = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${apiRoot}/attendance`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAttendance(res.data.attendance || []);
    setFilteredAttendance(res.data.attendance || []);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (id) => {
const confirmDelete = window.confirm(
"Delete attendance record?"
);


if (!confirmDelete) return;

try {
  const token = localStorage.getItem("token");

  await axios.delete(
    `${apiRoot}/attendance/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  fetchAttendance();
} catch (error) {
  console.log(error);
  alert("Failed to delete attendance");
}


};

const presentCount = attendance.filter(
(item) => item.status === "Present"
).length;

const absentCount = attendance.filter(
(item) => item.status === "Absent"
).length;

const attendancePercentage =
attendance.length > 0
? Math.round(
(presentCount / attendance.length) * 100
)
: 0;

if (loading) {
return ( <div className="min-h-screen flex items-center justify-center"> <h2 className="text-2xl font-semibold">
Loading Attendance... </h2> </div>
);
}

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">

    {/* Header */}
    <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Attendance Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage attendance records and monitor participation.
        </p>
      </div>

      <Link
        href="/admin/attendance/create"
        className="
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          text-white
          px-6
          py-3
          rounded-xl
          shadow-lg
          hover:scale-105
          transition
        "
      >
        + Mark Attendance
      </Link>

    </div>

    {/* Statistics */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

      <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition">
        <h3 className="text-gray-500">
          Total Records
        </h3>

        <h2 className="text-4xl font-bold text-slate-800 mt-3">
          {attendance.length}
        </h2>
      </div>

      <div className="bg-green-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition">
        <h3 className="text-green-700">
          Present
        </h3>

        <h2 className="text-4xl font-bold text-green-600 mt-3">
          {presentCount}
        </h2>
      </div>

      <div className="bg-red-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition">
        <h3 className="text-red-700">
          Absent
        </h3>

        <h2 className="text-4xl font-bold text-red-600 mt-3">
          {absentCount}
        </h2>
      </div>

      <div className="bg-blue-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition">
        <h3 className="text-blue-700">
          Attendance %
        </h3>

        <h2 className="text-4xl font-bold text-blue-600 mt-3">
          {attendancePercentage}%
        </h2>
      </div>

    </div>

    {/* Search */}
    <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">

      <input
        type="text"
        placeholder="🔍 Search Member..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          border
          border-gray-300
          rounded-xl
          px-4
          py-3
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

    </div>

    {/* Attendance Cards */}

    {filteredAttendance.length === 0 ? (
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

        <div className="text-6xl mb-4">
          📋
        </div>

        <h2 className="text-2xl font-bold text-gray-700">
          No Attendance Found
        </h2>

        <p className="text-gray-500 mt-2">
          Start marking attendance records.
        </p>

      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredAttendance.map((item) => (
          <div
            key={item._id}
            className="
              bg-white
              rounded-3xl
              p-6
              shadow-lg
              hover:shadow-2xl
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >

            <div className="flex justify-between items-start">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {item.attendee?.name || "Unknown User"}
                </h2>

                <p className="text-sm text-gray-500">
  {item.attendee?.email}
</p>

<p className="text-sm text-blue-600 font-medium">
  Role: {item.attendeeRole}
</p>

  <p className="text-gray-500 mt-1">
                  {item.meeting?.title || "No Meeting"}
                </p>


                 <p className="text-gray-500 text-sm">
    Date:{" "}
    {item.meeting?.meetingDate
      ? new Date(item.meeting.meetingDate).toLocaleDateString()
      : "-"}
  </p>


   <p className="text-gray-500 text-sm">
    Location: {item.meeting?.location}
  </p>


              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  item.status === "Present"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.status}
              </span>

            </div>

            <div className="mt-6 border-t pt-4">

              <div className="flex flex-wrap gap-3">

                <Link
                  href={`/admin/attendance/${item._id}`}
                  className="
                    flex-1
                    text-center
                    bg-green-600
                    text-white
                    px-4
                    py-2
                    rounded-xl
                    hover:bg-green-700
                  "
                >
                  View
                </Link>


                <button
                  onClick={() => handleDelete(item._id)}
                  className="
                    flex-1
                    bg-red-600
                    text-white
                    px-4
                    py-2
                    rounded-xl
                    hover:bg-red-700
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>
    )}

  </div>



);
}
