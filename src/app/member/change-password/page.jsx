"use client";

import ChangePasswordForm from "@/components/ChangePasswordForm/ChangePasswordForm";

export default function MemberChangePassword() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">

      <div className="mx-auto max-w-7xl">

      
          {/* Password Form */}
          <div className="lg:col-span-2 rounded-[28px] bg-white shadow-xl border border-gray-100 overflow-hidden">

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b px-8 py-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Update Password
              </h2>

              <p className="mt-2 text-gray-500">
                Enter your current password and create a new secure password.
              </p>
            </div>

            <div className="p-8">
              <ChangePasswordForm />
            </div>

          </div>

        </div>

      

      </div>

  
  );
}