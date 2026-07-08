"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function AdminReferralDetails() {
  const { id } = useParams();

  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading referral...
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="p-6 text-red-600">
        Referral not found
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Referral Details
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">
              Client Name
            </p>
            <h3 className="font-semibold text-lg">
              {referral.clientName}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Client Mobile
            </p>
            <h3 className="font-semibold text-lg">
              {referral.clientMobile}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Referred To
            </p>
            <h3 className="font-semibold text-lg">
              {referral.toMember?.name || "N/A"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Member Email
            </p>
            <h3 className="font-semibold text-lg">
              {referral.toMember?.email || "N/A"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Status
            </p>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                referral.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : referral.status === "Accepted"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {referral.status}
            </span>
          </div>

          <div>
            <p className="text-gray-500">
              Created Date
            </p>

            <h3 className="font-semibold text-lg">
              {new Date(
                referral.createdAt
              ).toLocaleDateString()}
            </h3>
          </div>

        </div>

        <div className="mt-8">

          <p className="text-gray-500 mb-2">
            Referral Details
          </p>

          <div className="bg-gray-50 border rounded-xl p-4">
            {referral.referralDetails}
          </div>

        </div>

      </div>

    </div>
  );
}