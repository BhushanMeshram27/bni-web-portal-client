"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMeetingById } from "@/services/meetingService";

export default function MeetingDetails() {
const params = useParams();

const [meeting, setMeeting] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
if (params?.id) {
fetchMeeting();
}
}, [params]);

const fetchMeeting = async () => {
try {
const data = await getMeetingById(params.id);


  setMeeting(data.meeting);
} catch (error) {
  console.log(error);
} finally {
  setLoading(false);
}


};

if (loading) {
return ( <div className="flex min-h-screen items-center justify-center bg-slate-50"> <h2 className="text-2xl font-bold text-gray-700">
Loading Meeting... </h2> </div>
);
}

if (!meeting) {
return ( <div className="flex min-h-screen items-center justify-center bg-slate-50"> <div className="rounded-3xl bg-white p-10 shadow-xl"> <h2 className="text-2xl font-bold text-red-600">
Meeting Not Found </h2> </div> </div>
);
}

return ( <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">


  {/* Header */}
  <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

    <div>
      <h1 className="text-4xl font-bold text-gray-900">
        Meeting Details
      </h1>

      <p className="mt-2 text-gray-500">
        View complete meeting information
      </p>
    </div>

    <div className="flex gap-3">
      <Link
        href="/admin/meetings"
        className="rounded-xl bg-gray-700 px-5 py-3 text-white shadow hover:bg-gray-800"
      >
        Back
      </Link>

      <Link
        href={`/admin/meetings/edit/${meeting._id}`}
        className="rounded-xl bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700"
      >
        Edit Meeting
      </Link>
    </div>

  </div>

  {/* Main Card */}
  <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

    {/* Top Banner */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

      <h2 className="text-3xl font-bold">
        {meeting.title}
      </h2>

      <p className="mt-2 text-blue-100">
        Meeting Information & Schedule
      </p>

    </div>

    {/* Details */}
    <div className="grid gap-6 p-8 md:grid-cols-2">

      <div className="rounded-2xl bg-slate-50 p-5">
        <p className="text-sm text-gray-500">
          Meeting Title
        </p>

        <h3 className="mt-2 text-xl font-bold">
          {meeting.title}
        </h3>
      </div>

      <div className="rounded-2xl bg-slate-50 p-5">
        <p className="text-sm text-gray-500">
          Location
        </p>

        <h3 className="mt-2 text-xl font-bold">
          {meeting.location || "N/A"}
        </h3>
      </div>

      <div className="rounded-2xl bg-slate-50 p-5">
        <p className="text-sm text-gray-500">
          Meeting Date
        </p>

        <h3 className="mt-2 text-xl font-bold">
          {meeting.meetingDate
            ? new Date(
                meeting.meetingDate
              ).toLocaleDateString()
            : "N/A"}
        </h3>
      </div>

      <div className="rounded-2xl bg-slate-50 p-5">
        <p className="text-sm text-gray-500">
          Status
        </p>

        <span
          className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
            new Date(meeting.meetingDate) >
            new Date()
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {new Date(meeting.meetingDate) >
          new Date()
            ? "Upcoming"
            : "Completed"}
        </span>
      </div>

    </div>

    {/* Description */}
    <div className="px-8 pb-8">

      <div className="rounded-2xl bg-slate-50 p-6">

        <h3 className="mb-4 text-xl font-bold">
          Description
        </h3>

        <p className="leading-8 text-gray-700">
          {meeting.description ||
            "No description available."}
        </p>

      </div>

    </div>

    {/* Footer */}
    <div className="border-t bg-gray-50 px-8 py-5">

      <p className="text-sm text-gray-500">
        Created:
        {" "}
        {meeting.createdAt
          ? new Date(
              meeting.createdAt
            ).toLocaleDateString()
          : "N/A"}
      </p>

    </div>

  </div>

</div>

);
}
