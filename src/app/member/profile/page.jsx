"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiRoot } from "@/services/api";
import MemberPageShell, {
  MemberPageHero,
  MemberPageLoading,
  MemberPageSection,
} from "@/components/layout/MemberPageShell";

export default function MemberProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${apiRoot}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
    return <MemberPageLoading label="Loading Profile..." />;
  }

  if (!user) {
    return (
      <MemberPageShell>
        <MemberPageSection>
          <h2 className="text-xl font-semibold text-red-600">Profile Not Found</h2>
          <p className="mt-2 text-sm text-slate-500">
            We could not load your profile. Please try again later.
          </p>
        </MemberPageSection>
      </MemberPageShell>
    );
  }

  const infoFields = [
    { label: "Full Name", value: user.name },
    { label: "Email Address", value: user.email },
    { label: "Role", value: user.role, accent: "text-indigo-600 capitalize" },
    { label: "Mobile Number", value: user.mobile || "-" },
  { label: "Company Name", value: user.businessName || "-" },
  { label: "Profession", value: user.profession || "-" },
  ];

  return (
    <MemberPageShell>
      <MemberPageHero
        eyebrow="BNI Member Profile"
        title={user.name}
        description="Manage your account information and membership details."
        action={
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-3xl font-bold text-white shadow-lg backdrop-blur-sm sm:h-24 sm:w-24 sm:text-4xl">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <MemberPageSection className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-3xl font-bold text-white shadow-md">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

           

           <div className="mt-6 w-full space-y-3">

  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs uppercase text-slate-500">
      Company
    </p>
    <p className="mt-1 font-semibold text-slate-900">
      {user.businessName || "-"}
    </p>
  </div>

  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs uppercase text-slate-500">
      Profession
    </p>
    <p className="mt-1 font-semibold text-slate-900">
      {user.profession || "-"}
    </p>
  </div>

 

</div>
          </div>
        </MemberPageSection>

        <div className="space-y-6 lg:col-span-2">
         <MemberPageSection
  title="Profile Information"
  description="Your account details and membership information."
>
  <div className="grid gap-4 md:grid-cols-2">

  {/* Left Column */}
  <div className="space-y-4">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Full Name
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900">
        {user.name}
      </p>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Role
      </p>

      <span
        className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
          user.role === "admin"
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {user.role === "admin" ? "Administrator" : "Member"}
      </span>
    </div>
  </div>

  {/* Right Column */}
  <div className="space-y-4">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Mobile Number
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900">
        {user.mobile || "-"}
      </p>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Email Address
      </p>
      <p className="mt-2 break-all text-lg font-semibold text-slate-900">
        {user.email}
      </p>
    </div>
  </div>

</div>
</MemberPageSection>

       
        </div>
      </div>
    </MemberPageShell>
  );
}
