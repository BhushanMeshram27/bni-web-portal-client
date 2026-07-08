"use client";

import ChangePasswordForm from "@/components/ChangePasswordForm/ChangePasswordForm";

export default function AdminChangePassword() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Admin Change Password
      </h1>

      <ChangePasswordForm />
    </div>
  );
}