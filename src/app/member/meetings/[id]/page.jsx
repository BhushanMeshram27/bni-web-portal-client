"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMeetingById } from "@/services/meetingService";

export default function MeetingDetails({ params }) {
const [meeting, setMeeting] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
fetchMeeting();
}, []);

const fetchMeeting = async () => {
try {
const data = await getMeetingById(params.id);
setMeeting(data.meeting);
} catch (error) {
console.error(error);
} finally {
setLoading(false);
}
};

if (loading) {
return ( <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center"> <div className="text-center"> <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>


      <p className="mt-4 text-lg font-semibold text-gray-600">
        Loading Meeting Details...
      </p>
    </div>
  </div>
);


}

if (!meeting) {
return ( <div className="min-h-screen flex items-center justify-center bg-slate-50"> <div className="rounded-3xl bg-white p-10 shadow-xl text-center"> <div className="text-6xl mb-4">📅</div>

      <h2 className="text-2xl font-bold text-gray-800">
        Meeting Not Found
      </h2>

      <p className="mt-2 text-gray-500">
        The requested meeting does not exist.
      </p>

      <Link
        href="/admin/meetings"
        className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Back to Meetings
      </Link>
    </div>
  </div>
);


}

return ( <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">

  {/* Hero Banner */}
  <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 md:p-12 shadow-2xl">

    <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

    <div className="relative z-10">

      <p className="uppercase tracking-[4px] text-blue-100 text-sm">
        BNI MEETING DETAILS
      </p>

      <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">
        {meeting.title}
      </h1>

      <p className="mt-3 text-blue-100">
        View complete meeting information and details.
      </p>

    </div>
  </div>

  {/* Meeting Details Card */}
  <div className="mt-8 rounded-[32px] bg-white shadow-xl overflow-hidden">

    <div className="border-b border-gray-100 px-8 py-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Meeting Information
      </h2>
    </div>

    <div className="grid gap-6 p-8 md:grid-cols-2">

      {/* Date */}
      <div className="rounded-2xl bg-blue-50 p-6">
        <p className="text-sm font-semibold text-blue-600">
          Meeting Date
        </p>

        <h3 className="mt-2 text-xl font-bold text-gray-800">
          {new Date(
            meeting.meetingDate
          ).toLocaleDateString()}
        </h3>
      </div>

      {/* Location */}
      <div className="rounded-2xl bg-green-50 p-6">
        <p className="text-sm font-semibold text-green-600">
          Location
        </p>

        <h3 className="mt-2 text-xl font-bold text-gray-800">
          {meeting.location}
        </h3>
      </div>

      {/* Status */}
      <div className="rounded-2xl bg-purple-50 p-6">
        <p className="text-sm font-semibold text-purple-600">
          Status
        </p>

        <span
          className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
            meeting.status === "Completed"
              ? "bg-green-100 text-green-700"
              : meeting.status === "Upcoming"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {meeting.status || "Pending"}
        </span>
      </div>

      {/* Description */}
      <div className="rounded-2xl bg-orange-50 p-6">
        <p className="text-sm font-semibold text-orange-600">
          Description
        </p>

        <p className="mt-2 text-gray-700">
          {meeting.description ||
            "No description available"}
        </p>
      </div>

    </div>
  </div>

  {/* Action Buttons */}
  <div className="mt-8 flex flex-wrap gap-4">

    <Link
      href="/admin/meetings"
      className="
        rounded-2xl
        bg-gray-700
        px-6
        py-3
        font-semibold
        text-white
        shadow-lg
        transition
        hover:bg-gray-800
      "
    >
      ← Back to Meetings
    </Link>

    <Link
      href={`/admin/meetings/edit/${meeting._id}`}
      className="
        rounded-2xl
        bg-gradient-to-r
        from-amber-500
        to-orange-500
        px-6
        py-3
        font-semibold
        text-white
        shadow-lg
        transition
        hover:scale-105
      "
    >
      ✏️ Edit Meeting
    </Link>

  </div>

</div>


);
}
