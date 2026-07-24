"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { apiRoot } from "@/services/api";
import {
  Handshake,
  Users,
  CalendarDays,
  ChartColumn,
  UserRound,
  LockKeyhole,
} from "lucide-react";
import MemberPageShell, {
  MemberPageHero,
  MemberPageLoading,
  MemberPageSection,

} from "@/components/layout/MemberPageShell";

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
  }, [router]);

  const fetchDashboard = async (token) => {
    try {
      const res = await axios.get(`${apiRoot}/member/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      icon: Handshake,
      accent: "text-blue-600",
      link: "/member/referrals",
    },
    {
      title: "Total Meetings",
      value: stats.totalMeetings,
      icon: Users,
      accent: "text-cyan-600",
      link: "/member/meetings",
    },
    {
      title: "Meetings Attended",
      value: stats.meetingsAttended,
      icon: CalendarDays,
      accent: "text-purple-600",
      link: "/member/meetings",
    },
    {
      title: "Attendance %",
      value: `${stats.attendancePercentage}%`,
      icon: ChartColumn,
      accent: "text-orange-600",
      link: "/member/attendance",
    },
  ];

  const quickActions = [
    {
      href: "/member/referrals",
      label: "My Referrals",
      icon: Handshake,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      href: "/member/visitors",
      label: "My Visitors",
      icon: UserRound,
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      href: "/member/attendance",
      label: "Attendance",
      icon: ChartColumn,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      href: "/member/change-password",
      label: "Change Password",
      icon: LockKeyhole,
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  if (loading) {
    return <MemberPageLoading label="Loading Dashboard..." />;
  }

  return (
    <MemberPageShell>
      <MemberPageHero
        eyebrow="BNI Member Portal"
        title="Welcome Back"
        description="Track referrals, visitors, attendance, and networking performance from one place."
      />

     <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {cards.map((card) => {
    const Icon = card.icon;

    return (
      <Link
        key={card.title}
        href={card.link}
        className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {card.title}
            </p>

            <p
              className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${card.accent}`}
            >
              {card.value}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <Icon className={`h-7 w-7 ${card.accent}`} />
          </div>
        </div>
      </Link>
    );
  })}
</div>

      <MemberPageSection
        title="Attendance Performance"
        description={`Meetings attended: ${stats.meetingsAttended} of ${stats.totalMeetings}`}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">Overall attendance rate</p>
          <span className="text-2xl font-bold text-indigo-600 sm:text-3xl">
            {stats.attendancePercentage}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-700"
            style={{
              width: `${Math.min(Math.max(stats.attendancePercentage, 0), 100)}%`,
            }}
          />
        </div>
      </MemberPageSection>

      <MemberPageSection title="Quick Actions">
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {quickActions.map((action) => {
      const Icon = action.icon;

      return (
        <Link
          key={action.href}
          href={action.href}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 text-center text-sm font-semibold text-white transition ${action.color}`}
        >
          <Icon className="h-8 w-8" />
          <span>{action.label}</span>
        </Link>
      );
    })}
  </div>
</MemberPageSection>
    </MemberPageShell>
  );
}
