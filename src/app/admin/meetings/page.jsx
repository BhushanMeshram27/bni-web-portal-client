"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getMeetings,
  deleteMeeting,
} from "@/services/meetingService";

export default function AdminMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    const filtered = meetings.filter(
      (meeting) =>
        meeting.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        meeting.location
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredMeetings(filtered);
  }, [search, meetings]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);

      const data = await getMeetings();

      setMeetings(data.meetings || []);
      setFilteredMeetings(data.meetings || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this meeting?"
    );

    if (!confirmed) return;

    try {
      await deleteMeeting(id);

      setMeetings((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.meetingDate);
    meetingDate.setHours(0, 0, 0, 0);

    return meetingDate.getTime() > today.getTime();
  }).length;

  const completedMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.meetingDate);
    meetingDate.setHours(0, 0, 0, 0);

    return meetingDate.getTime() <= today.getTime();
  }).length;


  const locations = new Set(
    meetings.map((m) => m.location)
  ).size;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col lg:flex-row justify-between gap-4">

        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Meetings Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all BNI meetings from one place
          </p>
        </div>

        <Link
          href="/admin/meetings/create"
          className="
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            text-white
            px-6
            py-3
            rounded-2xl
            shadow-xl
            hover:scale-105
            transition
            font-semibold
          "
        >
          + Create Meeting
        </Link>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border">
          <p className="text-gray-500">
            Total Meetings
          </p>

          <h2 className="text-5xl font-bold text-blue-600 mt-2">
            {meetings.length}
          </h2>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border">
          <p className="text-gray-500">
            Upcoming Meetings
          </p>

          <h2 className="text-5xl font-bold text-green-600 mt-2">
            {upcomingMeetings}
          </h2>
        </div>

        {/* Completed Meetings */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border">
          <p className="text-gray-500">Completed Meetings</p>

          <h2 className="text-5xl font-bold text-gray-600 mt-2">
            {completedMeetings}
          </h2>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border">
          <p className="text-gray-500">
            Locations
          </p>

          <h2 className="text-5xl font-bold text-purple-600 mt-2">
            {locations}
          </h2>
        </div>

      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl p-5 shadow-xl mb-8">

        <input
          type="text"
          placeholder="Search meeting title or location..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            border
            border-gray-300
            rounded-2xl
            px-5
            py-3
            outline-none
            focus:ring-4
            focus:ring-blue-200
          "
        />

      </div>

      {/* Empty State */}
      {filteredMeetings.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-xl">

          <div className="text-7xl mb-4">
            📅
          </div>

          <h2 className="text-3xl font-bold text-gray-700">
            No Meetings Found
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first meeting.
          </p>

        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="bg-gray-100">

                  <th className="px-6 py-5 text-left">
                    Title
                  </th>

                  <th className="px-6 py-5 text-left">
                    Date
                  </th>

                  <th className="px-6 py-5 text-left">
                    Location
                  </th>

                  <th className="px-6 py-5 text-left">
                    Status
                  </th>

                  <th className="px-6 py-5 text-left">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredMeetings.map((meeting) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const meetingDate = new Date(meeting.meetingDate);
                  meetingDate.setHours(0, 0, 0, 0);

                  const isUpcoming = meetingDate.getTime() > today.getTime();

                  return (
                    <tr
                      key={meeting._id}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <td className="px-6 py-5 font-semibold">
                        {meeting.title}
                      </td>

                      <td className="px-6 py-5">
                        {meeting.meetingDate
                          ? new Date(
                            meeting.meetingDate
                          ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                      <td className="px-6 py-5">
                        {meeting.location}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${isUpcoming
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {isUpcoming
                            ? "Upcoming"
                            : "Completed"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-2 flex-wrap">
                          <Link
                            href={`/admin/meetings/${meeting._id}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl"
                          >
                            View
                          </Link>

                          <Link
                            href={`/admin/meetings/edit/${meeting._id}`}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(meeting._id)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}