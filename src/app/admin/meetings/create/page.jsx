"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createMeeting } from "@/services/meetingService";

export default function CreateMeeting() {
const router = useRouter();

const [loading, setLoading] = useState(false);

const [formData, setFormData] = useState({
title: "",
meetingDate: "",
meetingTime: "",
location: "",
description: "",
});

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();


try {
  setLoading(true);

  await createMeeting(formData);

  alert("Meeting Created Successfully");

  router.push("/admin/meetings");
} catch (error) {
  console.log(error);

  alert(
    error?.response?.data?.message ||
      "Failed to create meeting"
  );
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">


  {/* Header */}
  <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div>
      <h1 className="text-4xl font-bold text-gray-900">
        Create Meeting
      </h1>

      <p className="mt-2 text-gray-500">
        Schedule a new BNI meeting
      </p>
    </div>

    <Link
      href="/admin/meetings"
      className="rounded-xl bg-gray-800 px-5 py-3 text-white shadow hover:bg-gray-900"
    >
      ← Back to Meetings
    </Link>

  </div>

  {/* Form Card */}
  <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">

    {/* Top Banner */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

      <h2 className="text-3xl font-bold">
        Meeting Information
      </h2>

      <p className="mt-2 text-blue-100">
        Fill in the details below to create a meeting.
      </p>

    </div>

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-8"
    >

      {/* Title */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700">
          Meeting Title
        </label>

        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter meeting title"
          className="w-full rounded-xl border border-gray-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700">
          Meeting Date
        </label>

        <input
          type="date"
          name="meetingDate"
          required
          value={formData.meetingDate}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>


      <div>
  <label className="mb-2 block font-semibold text-gray-700">
    Meeting Time
  </label>

  <input
    type="time"
    name="meetingTime"
    required
    value={formData.meetingTime}
    onChange={handleChange}
    className="w-full rounded-xl border border-gray-300 p-4"
  />
   <p className="mt-2 text-sm text-gray-500">
    Note: Meeting Time should be in 24-hour format (e.g., 09:30, 14:00, 18:45).
  </p>
</div>

      {/* Location */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700">
          Meeting Location
        </label>

        <input
          type="text"
          name="location"
          required
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter meeting location"
          className="w-full rounded-xl border border-gray-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block font-semibold text-gray-700">
          Description
        </label>

        <textarea
          rows={5}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Meeting agenda, notes, speaker details..."
          className="w-full rounded-xl border border-gray-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 pt-4">

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            px-8
            py-4
            font-semibold
            text-white
            shadow-lg
            transition
            hover:scale-105
            hover:shadow-xl
            disabled:cursor-not-allowed
            disabled:opacity-70
          "
        >
          {loading
            ? "Creating..."
            : "Create Meeting"}
        </button>

        <Link
          href="/admin/meetings"
          className="
            rounded-xl
            bg-gray-200
            px-8
            py-4
            font-semibold
            text-gray-800
            hover:bg-gray-300
          "
        >
          Cancel
        </Link>

      </div>

    </form>
  </div>
</div>


);
}
