"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState([]);

  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/visitors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVisitors(res.data.visitors || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${apiRoot}/visitors/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchVisitors();
    } catch (error) {
      console.log(error);
      alert("Failed to approve visitor");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${apiRoot}/visitors/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchVisitors();
    } catch (error) {
      console.log(error);
      alert("Failed to reject visitor");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete visitor?")) return;

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

      fetchVisitors();
    } catch (error) {
      console.log(error);
      alert("Failed to delete visitor");
    }
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
            Approved
          </span>
        );

      case "rejected":
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
            Rejected
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
            Pending
          </span>
        );
    }
  };

  const handleConvertToMember = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${apiRoot}/visitors/${id}/convert-member`,
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

      fetchVisitors();
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Failed to convert visitor"
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Visitors
        </h1>

        <Link
          href="/admin/visitors/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + Create Visitor
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Total Visitors
          </p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {totalVisitors}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Pending
          </p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            {pendingVisitors}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Approved
          </p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {approvedVisitors}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">
            Rejected
          </p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {rejectedVisitors}
          </h2>
        </div>

      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search visitors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border rounded-lg px-4 py-3"
        />
      </div>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="border rounded-lg px-4 py-3"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Profession</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Meeting</th>
              <th className="p-4 text-left">Visit Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {visitors
              .filter((visitor) => {
                const text = search.toLowerCase();

                const matchesSearch = (
                  visitor.name?.toLowerCase().includes(text) ||
                  visitor.email?.toLowerCase().includes(text) ||
                  visitor.businessName?.toLowerCase().includes(text) ||
                  visitor.profession?.toLowerCase().includes(text)
                );

                const matchesStatus = filterStatus === "all" || visitor.status === filterStatus;

                return matchesSearch && matchesStatus;
              }).map((visitor) => (
                <tr
                  key={visitor._id}
                  className="border-t"
                >
                  <td className="p-4 font-semibold">
                    {visitor.name}
                  </td>

                  <td className="p-4">
                    {visitor.email}
                  </td>

                  <td className="p-4">
                    {visitor.profession}
                  </td>

                  <td className="p-4">
                    {visitor.businessName}
                  </td>

                  <td className="p-4">
                    {visitor.meeting?.title || "-"}
                  </td>

                  <td className="p-4">
                    {visitor.visitDate
                      ? new Date(visitor.visitDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(visitor.status)}

                      {visitor.isMember && (
                        <span className="text-green-600 font-semibold text-sm">
                          Member
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 flex gap-2">
                    <Link
                      href={`/admin/visitors/${visitor._id}`}
                      className="bg-blue-600 text-white px-3 py-2 rounded"
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/visitors/edit/${visitor._id}`}
                      className="
                              bg-amber-500
                              hover:bg-amber-600
                              text-white
                              px-3
                              py-2
                              rounded
                              
                            "
                    >
                      Edit
                    </Link>

                    {visitor.status === "approved" &&
                      !visitor.isMember && (
                        <button
                          onClick={() =>
                            handleConvertToMember(visitor._id)
                          }
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded"
                        >
                          Convert
                        </button>
                      )}




                    <button
                      onClick={() =>
                        handleDelete(visitor._id)
                      }
                      className="bg-red-600 text-white px-3 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}