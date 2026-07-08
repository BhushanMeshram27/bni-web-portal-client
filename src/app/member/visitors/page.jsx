"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const filtered = visitors.filter((visitor) => {
      const name = visitor?.name?.toLowerCase() || "";
      const company =
        visitor?.company?.toLowerCase() ||
        visitor?.businessName?.toLowerCase() ||
        "";

      return name.includes(keyword) || company.includes(keyword);
    });

    setFilteredVisitors(filtered);
  }, [search, visitors]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/visitors/my-visitors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.visitors || res.data || [];

      setVisitors(data);
      setFilteredVisitors(data);
    } catch (err) {
      console.error(err);
      setVisitors([]);
      setFilteredVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this visitor?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${apiRoot}/visitors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Visitor deleted successfully");

      fetchVisitors();
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Failed to delete visitor"
      );
    }
  };


  const totalVisitors = visitors.length;

  const pendingVisitors = visitors.filter(
    (v) => v.status === "pending"
  ).length;

  const approvedVisitors = visitors.filter(
    (v) => v.status === "approved"
  ).length;

  const rejectedVisitors = visitors.filter(
    (v) => v.status === "rejected"
  ).length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
            Approved
          </span>
        );

      case "rejected":
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
            Rejected
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-slate-600">
            Loading Visitors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">

      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 shadow-2xl">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="uppercase tracking-[4px] text-blue-100 text-sm">
              BNI Visitor Management
            </p>

            <h1 className="mt-2 text-4xl font-bold text-white">
              My Visitors 👥
            </h1>

            <p className="mt-3 text-blue-100 max-w-xl">
              Manage your invited visitors and track approval status.
            </p>
          </div>

          <Link
            href="/member/visitors/create"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg hover:scale-105 transition"
          >
            + Invite Visitor
          </Link>

        </div>
      </div>

      {/* Statistics */}

      <div className="grid gap-6 mt-8 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Visitors"
          value={totalVisitors}
          icon="👥"
          gradient="from-blue-500 to-indigo-600"
        />

        <StatCard
          title="Pending"
          value={pendingVisitors}
          icon="⏳"
          gradient="from-yellow-500 to-orange-500"
        />

        <StatCard
          title="Approved"
          value={approvedVisitors}
          icon="✅"
          gradient="from-green-500 to-emerald-600"
        />

        <StatCard
          title="Rejected"
          value={rejectedVisitors}
          icon="❌"
          gradient="from-red-500 to-pink-600"
        />

      </div>

      {/* Search */}

      <div className="mt-8 rounded-3xl bg-white p-5 shadow-xl">

        <input
          type="text"
          placeholder="Search visitor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

      </div>

      {/* Table */}

      <div className="mt-8 rounded-3xl bg-white shadow-2xl overflow-hidden">

        <div className="border-b px-6 py-5">
          <h2 className="text-2xl font-bold">
            Visitor Directory
          </h2>
        </div>

        {filteredVisitors.length === 0 ? (
          <div className="p-12 text-center">

            <div className="text-6xl">👥</div>

            <h2 className="mt-4 text-3xl font-bold">
              No Visitors Found
            </h2>

            <p className="mt-3 text-gray-500">
              Invite your first visitor.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-100">

                <tr>
                  <th className="px-6 py-4 text-left">Visitor</th>
                  <th className="px-6 py-4 text-left">Company</th>
                  <th className="px-6 py-4 text-left">Mobile</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredVisitors.map((visitor) => (
                  <tr
                    key={visitor._id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {visitor?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>

                          <h3 className="font-semibold">
                            {visitor.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Visitor
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">
                      {visitor.company ||
                        "N/A"}
                    </td>

                    <td className="px-6 py-5">
                      {visitor.mobile || "-"}
                    </td>

                    <td className="px-6 py-5 text-center">
                      {getStatusBadge(visitor.status)}
                    </td>

                    <td className="px-6 py-5 text-center">

                      <Link
                        href={`/member/visitors/${visitor._id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        View
                      </Link>

                      <Link
                        href={`/member/visitors/edit/${visitor._id}`}
                        className="rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2 text-white"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(visitor._id)}
                        className="rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-white"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl hover:shadow-2xl transition">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {value}
          </h2>

        </div>

        <div
          className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center text-3xl text-white`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}