"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Handshake,
  UserPlus,
  ClipboardCheck,
  DollarSign,
  Mic,
  Building2,
  Mail,
  KeyRound,
  LogOut,
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/members", label: "Members", icon: Users },
      { href: "/admin/meetings", label: "Meetings", icon: Calendar },
      { href: "/admin/referrals", label: "Referrals", icon: Handshake },
      { href: "/admin/visitors", label: "Visitors", icon: UserPlus },
      { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
      { href: "/admin/tyfcb", label: "TYFCB", icon: DollarSign },
      { href: "/admin/speaking-schedule", label: "Speaking Schedule", icon: Mic },
      { href: "/admin/chapters", label: "Chapters", icon: Building2 },
      { href: "/admin/contacts", label: "Contacts", icon: Mail },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/admin/change-password", label: "Change Password", icon: KeyRound },
    ],
  },
];

function NavLink({ href, label, icon: Icon, active, onNavigate }) {
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

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const isActive = (href) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

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
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Image
              src="/bni-logo.webp"
              alt="BNI Portal"
              width={40}
              height={32}
              className="rounded"
            />
            <div>
              <p className="text-sm font-bold">BNI Portal</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
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
                      active={isActive(item.href)}
                      onNavigate={onClose}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
