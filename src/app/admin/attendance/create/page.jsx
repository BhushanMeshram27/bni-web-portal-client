"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function CreateAttendancePage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [meetings, setMeetings] = useState([]);
const [meeting, setMeeting] = useState({
  title: "",
  meetingDate: "",
  location: "",
}
);

  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
  fetchMembers();
  fetchMeetings();
}, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembers(res.data.members || []);

      // default attendance = all absent
      const initial = (res.data.members || []).map((m) => ({
        memberId: m._id,
        status: "Absent",
      }));

      setAttendance(initial);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${apiRoot}/meetings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMeetings(res.data.meetings || []);
  } catch (err) {
    console.log(err);
  }
};

  const toggleStatus = (memberId) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.memberId === memberId
          ? {
              ...item,
              status:
                item.status === "Present" ? "Absent" : "Present",
            }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

if (!meeting) {
      alert("Please select a meeting");
      return;
    }

const payload = {
  meeting,
  attendance: attendance.map((item) => ({
    attendee: item.memberId,
    attendeeRole: "member",
    status: item.status,
  })),
};

      await axios.post(
        `${apiRoot}/attendance/mark`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Attendance marked successfully!");
    } catch (error) {
  console.log("ERROR RESPONSE:");
  console.log(error.response?.data);

  alert(
    JSON.stringify(
      error.response?.data,
      null,
      2
    )
  );
}finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Members...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Mark Attendance
        </h1>
      </div>

      {/* Meeting Info */}
    <select
  className="border p-2 rounded w-full"
  value={meeting}
  onChange={(e) => setMeeting(e.target.value)}
>
  <option value="">Select Meeting</option>

  {meetings.map((m) => (
    <option key={m._id} value={m._id}>
      {m.title} | {new Date(m.meetingDate).toLocaleDateString()} | {m.location}
    </option>
  ))}
</select>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-4 border-b font-bold">
          Members Attendance
        </div>

        {members.map((member) => {
          const record = attendance.find(
            (a) => a.memberId === member._id
          );

          return (
            <div
              key={member._id}
              className="flex justify-between items-center p-4 border-b"
            >
              <div>
                <p className="font-semibold">
                  {member.name}
                </p>
                <p className="text-sm text-gray-500">
                  {member.email}
                </p>
              </div>

              <button
                onClick={() => toggleStatus(member._id)}
                className={`px-4 py-2 rounded-full text-sm font-bold ${
                  record?.status === "Present"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {record?.status || "Absent"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          {submitting ? "Submitting..." : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
}