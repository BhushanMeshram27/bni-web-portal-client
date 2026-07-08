"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyReferrals } from "@/services/referralService";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const data = await getMyReferrals();
      setReferrals(data?.referrals || []);
    } catch (error) {
      console.log(error);
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
            Approved
          </span>
        );

      case "Rejected":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
            Rejected
          </span>
        );

      default:
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return <div className="p-6">Loading referrals...</div>;
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Referrals</h1>

        <Link
          href="/member/referrals/create"
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Create Referral
        </Link>
      </div>

      {/* Empty State */}
      {referrals.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">
          No referrals found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">

          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">To Member</th>

                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {referrals.map((referral) => (
                <tr key={referral._id} className="border-t">
                  <td className="p-3">{referral.clientName}</td>

                  <td className="p-3">{referral.clientMobile}</td>

                  <td className="p-3">
                    {referral.toMember?.name || "N/A"}
                  </td>

                  <td className="p-3">
                    {getStatusBadge(referral.status)}
                  </td>

                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/member/referrals/${referral._id}`}
                      className="bg-blue-600 text-white px-3 py-2 rounded"
                    >
                      View
                    </Link>

                    {referral.status === "Pending" && (
                      <Link
                        href={`/member/referrals/edit/${referral._id}`}
                        className="bg-amber-500 text-white px-3 py-2 rounded"
                      >
                        Edit
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}