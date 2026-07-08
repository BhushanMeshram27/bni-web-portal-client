"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/referrals/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReferrals(res.data.referrals || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-lg">
        Loading referrals...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          All Referrals
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Client Name</th>
              <th className="p-4 text-left">Mobile</th>
              <th className="p-4 text-left">To Member</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {referrals.length > 0 ? (
              referrals.map((referral) => (
                <tr key={referral._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{referral.clientName}</td>

                  <td className="p-4">{referral.clientMobile}</td>

                  <td className="p-4">
                    {referral.toMember?.name || "N/A"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        referral.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : referral.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {referral.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <Link
                      href={`/admin/referrals/${referral._id}`}
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-gray-500"
                >
                  No referrals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}