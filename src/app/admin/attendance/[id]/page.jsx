"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function AttendanceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchAttendance();
  }, [id]);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/attendance/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAttendance(res.data.attendance);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-bold">
          Loading Attendance...
        </h2>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-bold text-red-600">
          Attendance Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Attendance Details
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500 text-sm">
              Name
            </p>

            <h2 className="text-xl font-semibold">
              {attendance.attendee?.name || "-"}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Email
            </p>

            <h2 className="text-xl font-semibold">
              {attendance.attendee?.email || "-"}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              User Role
            </p>

            <h2 className="text-xl font-semibold capitalize">
              {attendance.attendeeRole}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Business
            </p>

            <h2 className="text-xl font-semibold">
              {attendance.attendee?.businessName || "-"}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Meeting
            </p>

            <h2 className="text-xl font-semibold">
              {attendance.meeting?.title || "-"}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Location
            </p>

            <h2 className="text-xl font-semibold">
              {attendance.meeting?.location || "-"}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Meeting Date
            </p>

            <h2 className="text-xl font-semibold">
              {attendance.meeting?.meetingDate
                ? new Date(
                    attendance.meeting.meetingDate
                  ).toLocaleDateString()
                : "-"}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Status
            </p>

            <span
              className={`px-5 py-2 rounded-full font-semibold ${
                attendance.status === "Present"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {attendance.status}
            </span>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Created At
            </p>

            <h2 className="text-lg">
              {new Date(attendance.createdAt).toLocaleString()}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Updated At
            </p>

            <h2 className="text-lg">
              {new Date(attendance.updatedAt).toLocaleString()}
            </h2>
          </div>

        </div>

        <div className="mt-10 flex gap-4">

          <button
            onClick={() =>
              router.push(`/admin/attendance/edit/${attendance._id}`)
            }
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl"
          >
            Edit
          </button>

          <button
            onClick={() => router.push("/admin/attendance")}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl"
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}