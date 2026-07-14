"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { updateReferralStatus } from "@/services/referralService";
import { apiRoot } from "@/services/api";

export default function ReferralDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [businessValue, setBusinessValue] = useState("");

  useEffect(() => {
    if (id) {
      fetchReferral();
    }
  }, [id]);

  const fetchReferral = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/referrals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReferral(res.data.referral);
    } catch (error) {
      console.log(error);
      setReferral(null);
    } finally {
      setLoading(false);
    }
  };

    const handleStatusUpdate = async (status) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${apiRoot}/referrals/status/${referral._id}`,
      {
        status,
        businessValue,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(`Referral updated to ${status}`);

    setBusinessValue("");

    fetchReferral();

  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      "Failed to update status"
    );
  }
};
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading referral details...
        </h2>
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">
          Referral Not Found
        </h2>

        <button
          onClick={() => router.back()}
          className="mt-5 bg-gray-700 text-white px-5 py-2 rounded-lg"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Referral Details
        </h1>

        <div className="space-y-6">

          <div>
            <p className="text-gray-500">Client Name</p>
            <p className="text-lg font-semibold">
              {referral.clientName}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Client Mobile</p>
            <p className="text-lg font-semibold">
              {referral.clientMobile}
            </p>
          </div>

          

          <div>
            <p className="text-gray-500">Client Email</p>
            <p className="text-lg font-semibold">
                {referral.clientEmail}
            </p>
          </div>

          <div>
            <p className="text-gray-500">From Member</p>
            <p className="text-lg font-semibold">
              {referral.fromMember?.name || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">To Member</p>
            <p className="text-lg font-semibold">
              {referral.toMember?.name || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Referral Details</p>
            <p className="text-lg">
              {referral.referralDetails}
            </p>
          </div>


<div>
          <p className="text-gray-500">Status</p>

          <span className="inline-block mt-1 px-3 py-1 rounded bg-blue-100 text-blue-700">
            {referral.status}
          </span>
        </div>

        {/* PUT THE BUTTONS HERE */}

        <div className="flex gap-3 mt-6">

          {referral.status === "Pending" && (
            <button
              onClick={() => handleStatusUpdate("Accepted")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Accept
            </button>
          )}

          {referral.status === "Accepted" && (
            <button
              onClick={() => handleStatusUpdate("Follow-up")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Follow-up
            </button>
          )}

       {referral.status === "Follow-up" && (
  <div className="space-y-3">

    <button
      onClick={() => {
        if (!businessValue) {
          alert("Please enter Business Value");
          return;
        }

        handleStatusUpdate("Converted");
      }}
      className="bg-purple-600 text-white px-4 py-2 rounded"
    >
      Convert & Save Revenue
    </button>

  </div>
)}

          {referral.status === "Converted" && (
            <button
              onClick={() => handleStatusUpdate("Closed")}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          )}

        </div>
        

         
        </div>

      </div>

    </div>
  );
}