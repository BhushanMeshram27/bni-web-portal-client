"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { apiRoot } from "@/services/api";
import MemberPageShell, {
  MemberPageHero,
  MemberPageLoading,
  MemberPageSection,
  MemberStatCard,
} from "@/components/layout/MemberPageShell";
import {
  Users,
  Clock3,
  BadgeCheck,
  CircleX,
  UserRound,
  Building2,
  Smartphone,
  Search,
} from "lucide-react";

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
        visitor?.company?.toLowerCase() || visitor?.businessName?.toLowerCase() || "";

      return name.includes(keyword) || company.includes(keyword);
    });

    setFilteredVisitors(filtered);
  }, [search, visitors]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(`${apiRoot}/visitors/my-visitors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

      await axios.delete(`${apiRoot}/visitors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Visitor deleted successfully");
      fetchVisitors();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to delete visitor");
    }
  };

  const totalVisitors = visitors.length;
  const pendingVisitors = visitors.filter((v) => v.status === "pending").length;
  const approvedVisitors = visitors.filter((v) => v.status === "approved").length;
  const rejectedVisitors = visitors.filter((v) => v.status === "rejected").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return <MemberPageLoading label="Loading Visitors..." />;
  }

  return (
    <MemberPageShell>
      <MemberPageHero
        eyebrow="BNI Visitor Management"
        title="My Visitors"
        description="Manage your invited visitors and track approval status."
        action={
          <Link
            href="/member/visitors/create"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-md transition hover:bg-blue-50 sm:text-base"
          >
            + Invite Visitor
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MemberStatCard
          title="Total Visitors"
          value={totalVisitors}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          accent="text-blue-600"
        />

        <MemberStatCard
          title="Pending"
          value={pendingVisitors}
          icon={<Clock3 className="h-6 w-6 text-amber-600" />}
          accent="text-amber-600"
        />

        <MemberStatCard
          title="Approved"
          value={approvedVisitors}
          icon={<BadgeCheck className="h-6 w-6 text-emerald-600" />}
          accent="text-emerald-600"
        />

        <MemberStatCard
          title="Rejected"
          value={rejectedVisitors}
          icon={<CircleX className="h-6 w-6 text-red-600" />}
          accent="text-red-600"
        />
      </div>

      <MemberPageSection title="Search Visitors">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by name or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:text-base"
          />
        </div>
      </MemberPageSection>

      <MemberPageSection
        title="Visitor Directory"
        description={`Showing ${filteredVisitors.length} visitor${filteredVisitors.length === 1 ? "" : "s"}`}
        className="overflow-hidden p-0"
      >
        {filteredVisitors.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="flex justify-center">
              <Users className="h-14 w-14 text-blue-600" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">
              No Visitors Found
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Invite your first visitor to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-slate-600 sm:px-6">
                    Visitor
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-slate-600 sm:px-6">
                    Company
                  </th>
                  <th className="hidden px-4 py-4 text-left font-semibold text-slate-600 md:table-cell sm:px-6">
                    Mobile
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-slate-600 sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-slate-600 sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor._id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-sm font-bold text-white">
                          <UserRound className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">{visitor.name}</h3>
                          <p className="text-xs text-slate-500 md:hidden">{visitor.mobile || "-"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Building2 className="h-4 w-4 text-slate-500" />
                        <span>{visitor.company || visitor.businessName || "N/A"}</span>
                      </div>
                    </td>

                    <td className="hidden px-4 py-4 md:table-cell sm:px-6">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Smartphone className="h-4 w-4 text-slate-500" />
                        <span>{visitor.mobile || "-"}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center sm:px-6">
                      {getStatusBadge(visitor.status)}
                    </td>

                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Link
                          href={`/member/visitors/${visitor._id}`}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 sm:text-sm"
                        >
                          View
                        </Link>

                        <Link
                          href={`/member/visitors/edit/${visitor._id}`}
                          className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600 sm:text-sm"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(visitor._id)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MemberPageSection>
    </MemberPageShell>
  );
}
