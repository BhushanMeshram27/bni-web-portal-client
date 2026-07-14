"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { apiRoot } from "@/services/api";

export default function ReceivedReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/referrals/received`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReferrals(res.data.referrals || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading received referrals...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Received Referrals
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

{referrals.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="text-6xl mb-4">📭</div>
      <h2 className="text-2xl font-semibold text-gray-800">
        No Referrals Received
      </h2>
      <p className="mt-2 text-gray-500 text-center">
        You haven't received any referrals yet.
      </p>
      <p className="text-sm text-gray-400 mt-1 text-center">
        When another member sends you a referral, it will appear here.
      </p>
    </div>
  ) : (
        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">From Member</th>
              <th className="p-4 text-left">Mobile</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {referrals.map((referral) => (
              <tr key={referral._id} className="border-t">

                <td className="p-4">
                  {referral.clientName}
                </td>

                <td className="p-4">
                  {referral.fromMember?.name}
                </td>

                <td className="p-4">
                  {referral.clientMobile}
                </td>

                

                <td className="p-4">
                  <Link
                    href={`/member/referrals/${referral._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
  )}
      </div>

    </div>
  );
}