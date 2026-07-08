"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function MemberProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${apiRoot}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-600">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-2xl font-bold text-red-600">
            Profile Not Found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 md:p-12 shadow-2xl">

          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center">

            {/* Avatar */}
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-5xl font-bold text-white shadow-xl backdrop-blur-lg">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <p className="text-sm uppercase tracking-[5px] text-blue-100">
                BNI MEMBER PROFILE
              </p>

              <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
                {user.name}
              </h1>

              <p className="mt-3 text-lg text-blue-100">
                Manage your account information and membership details.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm font-medium text-green-100 backdrop-blur-lg">
                  Active Member
                </span>

                <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-lg">
                  {user.role}
                </span>

              </div>
            </div>

          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Left Card */}
          <div className="rounded-[32px] bg-white p-8 shadow-xl">

            <div className="text-center">

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-4xl font-bold text-white shadow-lg">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>

              <h2 className="mt-5 text-2xl font-bold text-gray-800">
                {user.name}
              </h2>

              <p className="mt-1 text-gray-500">
                {user.email}
              </p>

              <div className="mt-6 rounded-2xl bg-green-50 p-4">
                <p className="font-semibold text-green-700">
                  Membership Active
                </p>
              </div>

            </div>

          </div>

          {/* Right Information */}
          <div className="lg:col-span-2">

            <div className="rounded-[32px] bg-white p-8 shadow-xl">

              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">
                  Profile Information
                </h2>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                  Member
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 transition hover:shadow-lg">
                  <p className="text-sm font-medium text-gray-500">
                    Full Name
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-gray-800">
                    {user.name}
                  </h3>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 transition hover:shadow-lg">
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-gray-800 break-all">
                    {user.email}
                  </h3>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 transition hover:shadow-lg">
                  <p className="text-sm font-medium text-gray-500">
                    Role
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-indigo-600 capitalize">
                    {user.role}
                  </h3>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 transition hover:shadow-lg">
                  <p className="text-sm font-medium text-gray-500">
                    Account Status
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-green-600">
                    Active
                  </h3>
                </div>

              </div>

            </div>

            {/* Security Card */}
            <div className="mt-8 rounded-[32px] bg-white p-8 shadow-xl">

              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Security Information
              </h2>

              <div className="space-y-4">

                <div className="flex items-center gap-4 rounded-2xl bg-green-50 p-4">
                  <div className="text-2xl">🔒</div>

                  <div>
                    <h3 className="font-semibold text-green-700">
                      Account Protected
                    </h3>

                    <p className="text-sm text-green-600">
                      Your account is secured with authentication.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-blue-50 p-4">
                  <div className="text-2xl">🛡️</div>

                  <div>
                    <h3 className="font-semibold text-blue-700">
                      Member Access
                    </h3>

                    <p className="text-sm text-blue-600">
                      Access granted according to your role permissions.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}