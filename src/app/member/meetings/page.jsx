"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function MemberMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const res = await axios.get(
        `${apiRoot}/meetings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMeetings(res.data.meetings || []);
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const upcomingMeetings = meetings.filter((meeting) => {
    const meetingStart = new Date(meeting.meetingDate);
    const meetingEnd = new Date(
      meetingStart.getTime() + 3 * 60 * 60 * 1000
    );

    return currentTime < meetingEnd;
  }).length;

  // 👇 Put it here
  const getMeetingStatus = (meetingDate) => {
    const meetingStart = new Date(meetingDate);

    const meetingEnd = new Date(
      meetingStart.getTime() + 3 * 60 * 60 * 1000
    );

    return currentTime >= meetingEnd;
  };


  if (loading) {
    return (<div className="flex min-h-screen items-center justify-center bg-slate-50"> <div className="text-center"> <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>


      <p className="mt-4 text-lg font-semibold text-gray-600">
        Loading Meetings...
      </p>
    </div>
    </div>
    );


  }

  return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">


    {/* Hero Banner */}
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 md:p-12 shadow-2xl">

      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[5px] text-blue-100">
          BNI MEMBER PORTAL
        </p>

        <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
          Meetings
        </h1>

        <p className="mt-4 max-w-2xl text-blue-100">
          Stay updated with upcoming chapter meetings and networking events.
        </p>
      </div>

    </div>

    {/* Statistics */}
    <div className="mt-8 grid gap-6 md:grid-cols-3">

      <div className="rounded-3xl bg-white p-6 shadow-xl">
        <p className="text-sm text-gray-500">
          Total Meetings
        </p>

        <h2 className="mt-3 text-5xl font-bold text-blue-600">
          {meetings.length}
        </h2>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-xl">
        <p className="text-sm text-gray-500">
          Upcoming Meetings
        </p>

        <h2 className="mt-3 text-5xl font-bold text-green-600">
          {upcomingMeetings}
        </h2>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-xl">
        <p className="text-sm text-gray-500">
          Locations
        </p>

        <h2 className="mt-3 text-5xl font-bold text-purple-600">
          {
            new Set(
              meetings.map(
                (meeting) => meeting.location
              )
            ).size
          }
        </h2>
      </div>

    </div>

    {/* Meetings Grid */}
    <div className="mt-8">

      {meetings.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-xl">

          <div className="mb-4 text-7xl">
            📅
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            No Meetings Found
          </h2>

          <p className="mt-3 text-gray-500">
            No meetings have been scheduled yet.
          </p>

        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {meetings.map((meeting) => (
            <div
              key={meeting._id}
              className="
              group
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-xl
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-2xl
            "
            >

              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-wider text-blue-100">
                      Meeting
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {meeting.title}
                    </h2>
                  </div>

                  <div className="text-4xl">
                    📅
                  </div>

                </div>

              </div>

              {/* Card Body */}
              <div className="p-6">

                <div className="space-y-4">

                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      🗓️
                    </span>

                    <div>
                      <p className="text-xs text-gray-500">
                        Meeting Date
                      </p>

                      <p className="font-semibold text-gray-800">
                        {new Date(
                          meeting.meetingDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      📍
                    </span>

                    <div>
                      <p className="text-xs text-gray-500">
                        Location
                      </p>

                      <p className="font-semibold text-gray-800">
                        {meeting.location}
                      </p>
                    </div>
                  </div>

                  {meeting.description && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Description
                      </p>

                      <p className="line-clamp-3 text-sm text-gray-600">
                        {meeting.description}
                      </p>
                    </div>
                  )}

                </div>

                {/* Status Badge */}
                <div className="mt-6">
                  {(() => {
                    const meetingStart = new Date(meeting.meetingDate);
                    const meetingEnd = new Date(
                      meetingStart.getTime() + 3 * 60 * 60 * 1000
                    );

const isCompleted = getMeetingStatus(meeting.meetingDate);
                    return (
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${isCompleted
                            ? "bg-gray-100 text-gray-700"
                            : "bg-green-100 text-green-700"
                          }`}
                      >
                        {isCompleted ? "Completed" : "Upcoming"}
                      </span>
                    );
                  })()}
                </div>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>

  </div>

  );
}
