"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MemberSidebar from "@/components/member/MemberSidebar";

export default function MemberLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!token) {
      router.push("/login");
      return;
    }

    if (user.role !== "member") {
      router.push("/login");
    }
  }, [router]);

  return (
   <div className="flex min-h-screen bg-gray-100">
  <MemberSidebar />

  <main className="flex-1 overflow-y-auto">
    {children}
  </main>
</div>
  );
}