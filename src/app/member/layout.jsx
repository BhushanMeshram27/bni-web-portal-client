"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MemberSidebar from "@/components/member/MemberSidebar";
import AppHeader from "@/components/layout/AppHeader";

export default function MemberLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
      router.push("/login");
      return;
    }

    if (user.role !== "member") {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <MemberSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          role="member"
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
