"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
   <div className="flex min-h-screen bg-gray-100">
  <AdminSidebar />

  <main className="flex-1 overflow-y-auto">
    {children}
  </main>
</div>
  );
}