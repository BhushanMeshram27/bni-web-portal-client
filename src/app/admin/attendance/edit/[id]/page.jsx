"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function EditAttendancePage() {
  const { id } = useParams();
  const router = useRouter();

  const [attendance, setAttendance] = useState(null);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAttendance();
    }
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
      setStatus(res.data.attendance.status);
    } catch (error) {
      console.log(error);
      alert("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `${apiRoot}/attendance/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Attendance updated successfully");

      router.push("/admin/attendance");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Edit Attendance
        </h1>

        <form
          onSubmit={handleUpdate}
          className="space-y-6"
        >

          <div>
            <label className="block mb-2 font-semibold">
              Name
            </label>

            <input
              type="text"
              value={attendance.attendee?.name || ""}
              disabled
              className="w-full border rounded-xl p-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Meeting
            </label>

            <input
              type="text"
              value={attendance.meeting?.title || ""}
              disabled
              className="w-full border rounded-xl p-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Attendance Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-xl p-3"
            >
              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>
            </select>
          </div>

          <div className="flex gap-4">

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              {saving ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/attendance")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}