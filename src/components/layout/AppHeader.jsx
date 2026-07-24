"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { ChevronDown, KeyRound, LogOut, Menu, User, X } from "lucide-react";

export default function AppHeader({ sidebarOpen, onToggleSidebar, role = "admin" }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    router.push("/login");
  };

  const profileHref = role === "member" ? "/member/profile" : "/admin/dashboard";
  const changePasswordHref =
    role === "member" ? "/member/change-password" : "/admin/change-password";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="hidden lg:block">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {role === "admin" ? "Admin Portal" : "Member Portal"}
          </p>
        </div>
      </div>

      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <Avatar name={user.name} size="sm" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs capitalize text-slate-500">{user.role}</p>
            </div>
            <ChevronDown
              className={`hidden h-4 w-4 text-slate-400 transition sm:block ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3 sm:hidden">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs capitalize text-slate-500">{user.role}</p>
              </div>

              {role === "member" && (
                <Link
                  href={profileHref}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Profile
                </Link>
              )}

              <Link
                href={changePasswordHref}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <KeyRound className="h-4 w-4 text-slate-400" />
                Change Password
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
