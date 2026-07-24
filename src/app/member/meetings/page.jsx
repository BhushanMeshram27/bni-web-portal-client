"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CalendarClock,
  MapPin,
  FileText,
} from "lucide-react";
import axios from "axios";
import { apiRoot } from "@/services/api";
import MemberPageShell, {
  MemberPageHero,
  MemberPageLoading,
  MemberPageSection,
  MemberStatCard,
} from "@/components/layout/MemberPageShell";

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

      const res = await axios.get(`${apiRoot}/meetings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  const getMeetingStatus = (meetingDate) => {
    const meetingStart = new Date(meetingDate);
    const meetingEnd = new Date(meetingStart.getTime() + 3 * 60 * 60 * 1000);
    return currentTime >= meetingEnd;
  };

  const upcomingMeetings = meetings.filter((meeting) => {
    const meetingStart = new Date(meeting.meetingDate);
    const meetingEnd = new Date(meetingStart.getTime() + 3 * 60 * 60 * 1000);
    return currentTime < meetingEnd;
  }).length;

  const uniqueLocations = new Set(meetings.map((meeting) => meeting.location)).size;

  if (loading) {
    return <MemberPageLoading label="Loading Meetings..." />;
  }

  return (
    <MemberPageShell>
      <MemberPageHero
        eyebrow="BNI Member Portal"
        title="Meetings"
        description="Stay updated with upcoming chapter meetings and networking events."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
       <MemberStatCard
  title="Total Meetings"
  value={meetings.length}
  icon={<CalendarDays className="h-6 w-6 text-blue-600" />}
  accent="text-blue-600"
/>

<MemberStatCard
  title="Upcoming Meetings"
  value={upcomingMeetings}
  icon={<CalendarClock className="h-6 w-6 text-emerald-600" />}
  accent="text-emerald-600"
/>

<MemberStatCard
  title="Locations"
  value={uniqueLocations}
  icon={<MapPin className="h-6 w-6 text-purple-600" />}
  accent="text-purple-600"
/>
      </div>

      {meetings.length === 0 ? (
        <MemberPageSection>
          <div className="py-8 text-center">
           <div className="flex justify-center">
  <CalendarDays className="h-14 w-14 text-blue-600" />
</div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">
              No Meetings Found
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              No meetings have been scheduled yet.
            </p>
          </div>
        </MemberPageSection>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {meetings.map((meeting) => {
            const isCompleted = getMeetingStatus(meeting.meetingDate);

            return (
              <article
                key={meeting._id}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-5 text-white sm:px-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                    Meeting
                  </p>
                  <h2 className="mt-2 text-lg font-semibold sm:text-xl">{meeting.title}</h2>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-1 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Meeting Date
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">
                        {new Date(meeting.meetingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Location
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">
                        {meeting.location}
                      </p>
                    </div>
                  </div>

                  {meeting.description && (
  <div className="flex items-start gap-3">
    <FileText className="mt-1 h-5 w-5 text-slate-500" />

    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Description
      </p>

      <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-slate-600">
        {meeting.description}
      </p>
    </div>
  </div>
)}

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${
                      isCompleted
                        ? "bg-slate-100 text-slate-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {isCompleted ? "Completed" : "Upcoming"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </MemberPageShell>
  );
}
