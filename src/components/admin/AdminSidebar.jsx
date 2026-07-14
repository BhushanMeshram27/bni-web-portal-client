"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";



export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-6">
        Admin Panel
      </h2>

      <ul className="space-y-4">
        <li>
          <Link href="/admin/dashboard">
            Dashboard
          </Link>
        </li>

        <li>
          <Link href="/admin/members">
            Members
          </Link>
        </li>

        <li>
          <Link href="/admin/meetings">
            Meetings
          </Link>
        </li>

        <li>
          <Link href="/admin/referrals">
            Referrals
          </Link>
        </li>

        <li>
          <Link href="/admin/visitors">
            Visitors
          </Link>
        </li>

        <li>
          <Link href="/admin/attendance">
            Attendance
          </Link>
        </li>
        <li>
          <Link href="/admin/tyfcb">
            TYFCB
          </Link>
        </li>

        <li>
          <Link href="/admin/speaking-schedule">
            Speaking Schedule
          </Link>
        </li>


        <li>
          <Link href="/admin/chapters">
            Chapters
          </Link>
        </li>

        <li>
          <Link href="/admin/contacts">
            Contacts
          </Link>
        </li>


        <li>
          <Link href="/admin/change-password">
            Change Password
          </Link>
        </li>

        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-400"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}