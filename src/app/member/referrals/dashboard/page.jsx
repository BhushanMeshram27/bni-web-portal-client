"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function ReferralDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/referrals/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-gray-500">Total</h2>
        <p className="text-3xl font-bold">{stats.total}</p>
      </div>

      <div className="bg-green-100 p-6 rounded-xl shadow">
        <h2 className="text-green-700">Approved</h2>
        <p className="text-3xl font-bold">{stats.approved}</p>
      </div>

      <div className="bg-red-100 p-6 rounded-xl shadow">
        <h2 className="text-red-700">Rejected</h2>
        <p className="text-3xl font-bold">{stats.rejected}</p>
      </div>

      <div className="bg-yellow-100 p-6 rounded-xl shadow">
        <h2 className="text-yellow-700">Pending</h2>
        <p className="text-3xl font-bold">{stats.pending}</p>
      </div>

    </div>
  );
}