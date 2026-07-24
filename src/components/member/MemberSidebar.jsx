"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Calendar,
  Handshake,
  Inbox,
  ClipboardCheck,
  UserPlus,
  Users,
  DollarSign,
  Mic,
  KeyRound,
  LogOut,
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/member/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/member/profile", label: "Profile", icon: User },
    ],
  },
  {
    label: "Networking",
    items: [
      { href: "/member/meetings", label: "Meetings", icon: Calendar },
      { href: "/member/referrals", label: "Referrals", icon: Handshake },
      { href: "/member/referrals/received", label: "Received Referrals", icon: Inbox },
      { href: "/member/one-to-one", label: "One-to-One", icon: Users },
      { href: "/member/visitors", label: "My Visitors", icon: UserPlus },
    ],
  },
  {
    label: "Activity",
    items: [
      { href: "/member/attendance", label: "Attendance", icon: ClipboardCheck },
      { href: "/member/tyfcb", label: "TYFCB", icon: DollarSign },
      { href: "/member/speaking-schedule", label: "Speaking Schedule", icon: Mic },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/member/change-password", label: "Change Password", icon: KeyRound },
      { href: null, label: "Logout", icon: LogOut, action: "logout" },
    ],
  },
];

function NavLink({ href, label, icon: Icon, active, onNavigate, onLogout }) {
  if (label === "Logout") {
    return (
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          onLogout?.();
        }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
      >
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </button>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "border-l-2 border-blue-400 bg-white/10 text-white"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export default function MemberSidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const isActive = (href) => {
  // Dashboard
  if (href === "/member/dashboard") {
    return pathname === href;
  }

  // Referrals
  if (href === "/member/referrals") {
    return (
      pathname === "/member/referrals" ||
      pathname === "/member/referrals/create" ||
      pathname.startsWith("/member/referrals/edit/")
    );
  }

  // Received Referrals
  if (href === "/member/referrals/received") {
    return (
      pathname === "/member/referrals/received" ||
      pathname.startsWith("/member/referrals/received/")
    );
  }

  // Default for other routes
  return pathname === href || pathname.startsWith(href + "/");
};
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-linear-to-b from-slate-900 to-slate-950 text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 p-5">
          <Link href="/member/dashboard" className="flex items-center gap-3">
            <Image
              src="/bni-logo.webp"
              alt="BNI Portal"
              width={40}
              height={32}
              className="rounded"
            />
            <div>
              <p className="text-sm font-bold">BNI Portal</p>
              <p className="text-xs text-slate-400">Member Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {section.label}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      {...item}
                      active={item.href ? isActive(item.href) : false}
                      onNavigate={onClose}
                      onLogout={handleLogout}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

      </aside>
    </>
  );
}
