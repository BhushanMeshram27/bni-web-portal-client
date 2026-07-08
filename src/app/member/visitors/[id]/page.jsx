"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function VisitorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVisitor();
    }
  }, [id]);

  const fetchVisitor = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/visitors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVisitor(res.data.visitor);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToMember = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      `${apiRoot}/visitors/${visitor._id}/convert-member`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(
      "Visitor converted to member successfully"
    );

    fetchVisitor();
  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data?.message ||
        "Failed to convert visitor"
    );
  }
};

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading Visitor Details...
          </p>
        </div>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
          <div className="mb-4 text-7xl">❌</div>

          <h2 className="text-3xl font-bold text-gray-800">
            Visitor Not Found
          </h2>

          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const initials = visitor.name
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase();


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
      
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 rounded-xl bg-white px-5 py-3 shadow-md transition hover:shadow-lg"
      >
        ← Back
      </button>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-8 md:p-12 shadow-2xl">

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">

          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-5xl font-bold text-indigo-700 shadow-xl">
            {initials}
          </div>

          <div>
            <p className="text-sm uppercase tracking-[4px] text-blue-100">
              BNI VISITOR PROFILE
            </p>

            <h1 className="mt-2 text-4xl font-bold text-white">
              {visitor.name}
            </h1>

            <p className="mt-2 text-blue-100">
              Visitor Information & Activity Details
            </p>

           
          </div>

        </div>
      </div>

      <div className="mt-6 flex gap-4">

  {visitor.status === "approved" && (
    <button
      onClick={handleConvertToMember}
      className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
    >
      Convert to Member
    </button>
  )}

 

</div>

      {/* Statistics */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">

        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <p className="text-gray-500">Company</p>

          <h3 className="mt-3 text-2xl font-bold text-gray-800">
            {visitor.businessName || "N/A"}
          </h3>
        </div>

      

        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <p className="text-gray-500">Visit Date</p>

          <h3 className="mt-3 text-xl font-bold text-gray-800">
            {visitor.visitDate
              ? new Date(visitor.visitDate).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "N/A"}
          </h3>
        </div>

      </div>

      {/* Details Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

      {/* Contact Information */}
<div className="rounded-3xl bg-white p-8 shadow-xl">
  <h2 className="mb-6 text-2xl font-bold text-gray-800">
    Contact Information
  </h2>

  <div className="space-y-5">

    <div>
      <p className="text-sm text-gray-500">Full Name</p>
      <h3 className="font-semibold text-lg">
        {visitor.name}
      </h3>
    </div>

    <div>
      <p className="text-sm text-gray-500">Email Address</p>
      <h3 className="font-semibold break-all">
        {visitor.email}
      </h3>
    </div>

    <div>
      <p className="text-sm text-gray-500">Mobile Number</p>
      <h3 className="font-semibold">
        {visitor.mobile}
      </h3>
    </div>

    <div>
      <p className="text-sm text-gray-500">Company</p>
      <h3 className="font-semibold">
        {visitor.businessName || "N/A"}
      </h3>
    </div>

    <div>
      <p className="text-sm text-gray-500">Visit Date</p>
      <h3 className="font-semibold">
        {visitor.visitDate
          ? new Date(visitor.visitDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "N/A"}
      </h3>
    </div>

    {/* Put it here */}
    <div>
      <p className="text-sm text-gray-500">Invited By</p>
      <h3 className="font-semibold">
        {visitor.invitedBy?.name || "N/A"}
      </h3>
    </div>

  </div>
</div>

        {/* Visitor Summary */}
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Visitor Summary
          </h2>

          <div className="space-y-4">

            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm text-blue-600">
                Visitor Name
              </p>

              <h3 className="mt-2 font-bold text-blue-800">
                {visitor.name}
              </h3>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-sm text-purple-600">
                Company
              </p>

              <h3 className="mt-2 font-bold text-purple-800">
                {visitor.businessName || "N/A"}
              </h3>
            </div>

           

          </div>
        </div>

      </div>

      {/* Timeline */}
      <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl">

        <h2 className="mb-8 text-2xl font-bold text-gray-800">
          Visitor Timeline
        </h2>

        <div className="space-y-6">

          <div className="flex gap-4">
            <div className="h-4 w-4 rounded-full bg-green-500 mt-2"></div>

            <div>
              <h3 className="font-semibold">
                Visitor Registered
              </h3>

              <p className="text-gray-500">
                Visitor profile created in the system.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="h-4 w-4 rounded-full bg-blue-500 mt-2"></div>

            <div>
              <h3 className="font-semibold">
                Visit Scheduled
              </h3>

              <p className="text-gray-500">
                Visit date assigned and recorded.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="h-4 w-4 rounded-full bg-purple-500 mt-2"></div>

            <div>
              <h3 className="font-semibold">
                Current Status
              </h3>

              <p className="text-gray-500">
                {visitor.status}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}