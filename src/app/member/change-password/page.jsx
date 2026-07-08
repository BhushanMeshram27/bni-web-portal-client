"use client";

import ChangePasswordForm from "@/components/ChangePasswordForm/ChangePasswordForm";

export default function MemberChangePassword() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 p-8 md:p-12 text-white shadow-2xl">

          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-md">
                🔒 Security Center
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold">
                Change Password
              </h1>

              <p className="mt-4 max-w-2xl text-blue-100 text-lg">
                Protect your BNI account with a strong password and keep
                your business networking data secure.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 backdrop-blur-lg p-6 border border-white/20">
              <div className="text-center">
                <p className="text-sm text-blue-100">
                  Security Status
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  Protected
                </h3>

                <div className="mt-4 h-3 w-44 rounded-full bg-white/20">
                  <div className="h-3 w-[85%] rounded-full bg-green-400"></div>
                </div>

                <p className="mt-2 text-sm text-blue-100">
                  Security Score: 85%
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                🛡️
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  Account Protected
                </h3>

                <p className="text-sm text-gray-500">
                  Security monitoring active
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                🔐
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  Strong Password
                </h3>

                <p className="text-sm text-gray-500">
                  Recommended 8+ characters
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                🚀
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  Secure Login
                </h3>

                <p className="text-sm text-gray-500">
                  Keep credentials private
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Main Section */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Security Tips */}
          <div className="rounded-[28px] bg-white p-6 shadow-xl border border-gray-100">

            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl text-white">
              🔒
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Security Tips
            </h2>

            <p className="mt-3 text-gray-500">
              Follow these recommendations to keep your account secure.
            </p>

            <div className="mt-8 space-y-4">

              <div className="rounded-2xl bg-green-50 p-4 border border-green-100">
                <h4 className="font-semibold text-green-700">
                  ✓ Minimum 8 Characters
                </h4>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                <h4 className="font-semibold text-blue-700">
                  ✓ Upper & Lower Case Letters
                </h4>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4 border border-purple-100">
                <h4 className="font-semibold text-purple-700">
                  ✓ Numbers & Symbols
                </h4>
              </div>

              <div className="rounded-2xl bg-orange-50 p-4 border border-orange-100">
                <h4 className="font-semibold text-orange-700">
                  ✓ Avoid Common Passwords
                </h4>
              </div>

            </div>

          </div>

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

        {/* Bottom Alert */}
        <div className="mt-8 rounded-[28px] border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-lg">

          <div className="flex items-start gap-4">

            <div className="text-4xl">
              ⚠️
            </div>

            <div>
              <h3 className="text-lg font-bold text-amber-800">
                Security Reminder
              </h3>

              <p className="mt-2 text-amber-700">
                After changing your password, use the new password for
                future logins. Never share your credentials with anyone
                and update your password regularly.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}