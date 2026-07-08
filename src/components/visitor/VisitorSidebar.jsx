"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function VisitorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/visitor/dashboard",
      icon: "🏠",
    },
    {
      name: "Meetings",
      href: "/visitor/meetings",
      icon: "📅",
    },
    {
      name: "Profile",
      href: "/visitor/profile",
      icon: "👤",
    },
    {
      name: "Change Password",
      href: "/visitor/change-password",
      icon: "🔒",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-xl">
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-2xl font-bold text-blue-400">
            Visitor Panel
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Business Network India
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-700 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </aside>
  );
}