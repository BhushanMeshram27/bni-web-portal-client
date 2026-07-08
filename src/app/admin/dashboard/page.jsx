"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";
import DashboardCharts from "@/components/DashboardCharts/DashboardCharts";
import { apiRoot } from "@/services/api";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
  totalMembers: 0,
  totalMeetings: 0,
  totalReferrals: 0,
  totalVisitors: 0,

  totalRecords: 0,
  totalPresent: 0,
  totalAbsent: 0,
  attendancePercentage: 0,

  approvedReferrals: 0,
  pendingReferrals: 0,
  rejectedReferrals: 0,
});

  const [meetings, setMeetings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const addActivity = (message) => {
    setActivities((prev) => [
      {
        id: Date.now(),
        message,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ].slice(0, 10));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // Initial dashboard load
    fetchDashboard(token);
    fetchActivities(token);

    // Listen for realtime updates
    socket.on("memberCreated", () => {
      fetchDashboard(token);
      addActivity("👤 New member registered");
    });

    socket.on("meetingCreated", () => {
      fetchDashboard(token);
      addActivity("📅 New meeting created");
    });

    socket.on("meetingUpdated", () => {
      fetchDashboard(token);
      addActivity("✏️ Meeting updated");
    });

    socket.on("meetingDeleted", () => {
      fetchDashboard(token);
      addActivity("🗑️ Meeting deleted");
    });

    socket.on("referralCreated", () => {
      fetchDashboard(token);
      addActivity("🤝 New referral submitted");
    });

    socket.on("referralUpdated", () => {
      fetchDashboard(token);
      addActivity("✏️ Referral updated");
    });

    socket.on("referralDeleted", () => {
      fetchDashboard(token);
      addActivity("🗑️ Referral deleted");
    });

    socket.on("visitorCreated", () => {
      fetchDashboard(token);
      addActivity("👥 New visitor added");
    });

    socket.on("visitorUpdated", () => {
      fetchDashboard(token);
      addActivity("✏️ Visitor updated");
    });

    socket.on("visitorDeleted", () => {
      fetchDashboard(token);
      addActivity("🗑️ Visitor deleted");
    });

    socket.on("attendanceCreated", () => {
      fetchDashboard(token);
      addActivity("✅ Attendance marked");
    });

    socket.on("attendanceUpdated", () => {
      fetchDashboard(token);
      addActivity("✏️ Attendance updated");
    });

    socket.on("attendanceDeleted", () => {
      fetchDashboard(token);
      addActivity("🗑️ Attendance deleted");
    });

    socket.on("activityCreated", () => {
      fetchActivities(token);
    });


    // Cleanup
    return () => {
      socket.off("memberCreated");

      socket.off("meetingCreated");
      socket.off("meetingUpdated");
      socket.off("meetingDeleted");

      socket.off("referralCreated");
      socket.off("referralUpdated");
      socket.off("referralDeleted");

      socket.off("visitorCreated");
      socket.off("visitorUpdated");
      socket.off("visitorDeleted");

      socket.off("attendanceCreated");
      socket.off("attendanceUpdated");
      socket.off("attendanceDeleted");

      socket.off("activityCreated");
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  const fetchDashboard = async (token) => {
    try {
      const res = await axios.get(
        `${apiRoot}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data.stats || {});
      setMeetings(res.data.recentMeetings || []);
    } catch (error) {
      console.log("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (token) => {
    try {
      const res = await axios.get(
        `${apiRoot}/activity`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setActivities(res.data.activities);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome to BNI Management System
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/change-password"
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow hover:bg-blue-700"
          >
            Change Password
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white shadow hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold">
          Welcome Back, Admin 👋
        </h2>

        <p className="mt-2 text-blue-100">
          Manage meetings, members, referrals,
          visitors, and attendance from one place.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Members",
            value: stats.totalMembers,
            link: "/admin/members",
            color: "text-blue-600",
          },
          {
            title: "Total Meetings",
            value: stats.totalMeetings,
            link: "/admin/meetings",
            color: "text-green-600",
          },
          {
            title: "Total Referrals",
            value: stats.totalReferrals,
            link: "/admin/referrals",
            color: "text-purple-600",
          },
          {
            title: "Total Visitors",
            value: stats.totalVisitors,
            link: "/admin/visitors",
            color: "text-orange-600",
          },
        ].map((card) => (
          <Link key={card.title} href={card.link}>
            <div className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>

              <h3
                className={`mt-3 text-4xl font-bold ${card.color}`}
              >
                {card.value}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Records Summary */}

      <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition">

          <p className="text-sm text-gray-500">
            Total Records
          </p>

          <h2 className="mt-3 text-4xl font-bold text-indigo-600">
            {stats.totalRecords}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition">

          <p className="text-sm text-gray-500">
            Present Members
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {stats.totalPresent}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition">

          <p className="text-sm text-gray-500">
            Absent Members
          </p>

          <h2 className="mt-3 text-4xl font-bold text-red-600">
            {stats.totalAbsent}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition">

          <p className="text-sm text-gray-500">
            Attendance %
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {stats.attendancePercentage}%
          </h2>

        </div>

      </div>

      {/* Attendance Progress */}

      <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">
            Attendance Performance
          </h2>

          <span className="text-3xl font-bold text-blue-600">
            {stats.attendancePercentage}%
          </span>

        </div>

        <div className="h-5 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-indigo-600 transition-all duration-700"
            style={{
              width: `${stats.attendancePercentage}%`,
            }}
          />

        </div>

      </div>


      {/* Dashboard Charts */}
      <div className="mb-8">
        <DashboardCharts stats={stats} />
      </div>

      {/* Quick Actions */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Quick Actions
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Link
            href="/admin/meetings"
            className="rounded-xl bg-blue-600 p-4 text-center font-medium text-white hover:bg-blue-700"
          >
            Meetings
          </Link>

          <Link
            href="/admin/meetings/create"
            className="rounded-xl bg-green-600 p-4 text-center font-medium text-white hover:bg-green-700"
          >
            Create Meeting
          </Link>

          <Link
            href="/admin/members"
            className="rounded-xl bg-gray-700 p-4 text-center font-medium text-white hover:bg-gray-800"
          >
            Members
          </Link>

          <Link
            href="/admin/referrals"
            className="rounded-xl bg-yellow-600 p-4 text-center font-medium text-white hover:bg-yellow-700"
          >
            Referrals
          </Link>

          <Link
            href="/admin/visitors"
            className="rounded-xl bg-orange-500 p-4 text-center font-medium text-white hover:bg-orange-600"
          >
            Visitors
          </Link>

          <Link
            href="/admin/attendance"
            className="rounded-xl bg-indigo-600 p-4 text-center font-medium text-white hover:bg-indigo-700"
          >
            Attendance
          </Link>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Recent Meetings
          </h2>

          <Link
            href="/admin/meetings"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            View All →
          </Link>
        </div>

        {meetings.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-500">
              No meetings available
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-6 py-4 font-semibold">
                    Title
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Location
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {meetings.map((meeting) => (
                  <tr
                    key={meeting._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {meeting.title}
                    </td>

                    <td className="px-6 py-4">
                      {meeting.meetingDate
                        ? new Date(
                          meeting.meetingDate
                        ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      {meeting.location}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/meetings/${meeting._id}`}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/meetings/edit/${meeting._id}`}
                          className="rounded-lg bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Recent Activities */}

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">
          Recent Activities
        </h2>

        {activities.length === 0 ? (
          <p className="text-gray-500">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">
                    {activity.message}
                  </p>

                  <p className="text-sm text-gray-500">
                    {activity.type}
                  </p>
                </div>

                <span className="text-sm text-gray-400">
                  {new Date(
                    activity.createdAt
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}