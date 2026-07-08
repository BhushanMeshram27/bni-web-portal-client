"use client";

import Link from "next/link";

export default function MemberSidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-6">
        Member Panel
      </h2>

      <ul className="space-y-4">
        <li>
          <Link href="/member/dashboard">
            Dashboard
          </Link>
        </li>

        <li>
          <Link href="/member/profile">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/member/meetings">
            Meetings
          </Link>
        </li>
        <li>
          <Link href="/member/referrals">
            Referrals
          </Link>
        </li>

        <li>
          <Link href="/member/referrals/received">
            Received Referrals
          </Link>
        </li>

        <li>
          <Link href="/member/attendance">
            Attendance
          </Link>
        </li>

        <li>
          <Link href="/member/one-to-one">
            One-to-One Meetings
          </Link>
        </li>

      
<li>
          <Link href="/member/tyfcb">
            TYFCB
          </Link>
        </li>

        <li>
          <Link href="/member/speaking-schedule">
            Speaking Schedule
          </Link>
        </li>

        <li>
          <Link href="/member/change-password">
            Change Password
          </Link>
        </li>

        <li>
          <Link href="/login"
            className="text-red-600 hover:text-red-700"
          >
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}