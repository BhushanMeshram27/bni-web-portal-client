"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function MemberDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
  totalReferrals: 0,
  totalMeetings: 0,
  meetingsAttended: 0,
  attendancePercentage: 0,
});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchDashboard(token);
  }, []);

  const fetchDashboard = async (token) => {
    try {
      const res = await axios.get(
        `${apiRoot}/member/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     setStats({
  totalReferrals: res.data.totalReferrals || 0,
  totalMeetings: res.data.totalMeetings || 0,
  meetingsAttended: res.data.meetingsAttended || 0,
  attendancePercentage: res.data.attendancePercentage || 0,
});

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

 const cards = [
  {
    title: "Total Referrals",
    value: stats.totalReferrals,
    icon: "🤝",
    color: "text-blue-600",
    bg: "from-blue-500 to-indigo-600",
  },
 {
  title: "Total Meetings",
  value: stats.totalMeetings,
  icon: "👥",
  color: "text-cyan-600",
  bg: "from-cyan-500 to-blue-600",
},
  {
    title: "Meetings Attended",
    value: stats.meetingsAttended,
    icon: "📅",
    color: "text-purple-600",
    bg: "from-purple-500 to-pink-600",
  },
  {
    title: "Attendance %",
    value: `${stats.attendancePercentage}%`,
    icon: "📊",
    color: "text-orange-600",
    bg: "from-orange-500 to-red-500",
  },
];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-600">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 md:p-12 shadow-2xl">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative z-10">
          <p className="uppercase tracking-[5px] text-blue-100 text-sm">
            BNI MEMBER PORTAL
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Welcome Back 👋
          </h1>

          <p className="mt-4 max-w-2xl text-blue-100">
            Track referrals, visitors, attendance and networking performance.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl bg-white p-6 shadow-xl hover:-translate-y-2 transition"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h2 className={`mt-3 text-5xl font-bold ${card.color}`}>
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${card.bg} text-white text-3xl`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Performance */}
<div className="mt-8 rounded-3xl bg-white p-8 shadow-xl">
  <div className="flex justify-between items-center">
    <div>
      <h2 className="text-2xl font-bold">
        Attendance Performance
      </h2>

      <p className="mt-1 text-gray-500">
        Meetings Attended:{" "}
        <span className="font-semibold text-indigo-600">
           {stats.meetingsAttended} / {stats.totalMeetings}
        </span>
      </p>
    </div>

    <span className="text-3xl font-bold text-indigo-600">
      {stats.attendancePercentage}%
    </span>
  </div>

  <div className="mt-6 h-5 overflow-hidden rounded-full bg-gray-200">
    <div
      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-700"
      style={{
        width: `${Math.min(Math.max(stats.attendancePercentage, 0), 100)}%`,
      }}
    />
  </div>
</div>
      {/* Quick Actions */}
      <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold">Quick Actions</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/member/referrals" className="bg-blue-600 text-white p-6 rounded-3xl text-center">
            🤝 My Referrals
          </Link>

          <Link href="/member/visitors" className="bg-green-600 text-white p-6 rounded-3xl text-center">
            👥 My Visitors
          </Link>

          <Link href="/member/attendance" className="bg-purple-600 text-white p-6 rounded-3xl text-center">
            📊 Attendance
          </Link>

          <Link href="/member/change-password" className="bg-orange-500 text-white p-6 rounded-3xl text-center">
            🔒 Change Password
          </Link>
        </div>
      </div>

    </div>
  );
}