"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchMembers();

  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMembers(res.data.data || []);

    } catch (error) {
      console.error(
        "Members Error:",
        error.response?.data || error.message
      );
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (!confirm("Delete member?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchMembers();
    } catch (error) {
      console.error("Delete Error:", error);

      if (error.response) {
        alert(error.response.data.message || "Delete failed");
      } else {
        alert("Delete failed");
      }
    }
  };

  const assignChapter = async (memberId) => {
    const chapterId = selectedChapters[memberId];

    if (!chapterId) {
      alert("Please select a chapter");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/members/${memberId}/assign-chapter`,
        {
          chapter: chapterId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Chapter assigned successfully");

      fetchMembers();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to assign chapter"
      );
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Loading Members...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Members Management
          </h1>
          <p className="mt-1 text-slate-500">
            Total Members: {members.length}
          </p>
        </div>

        <Link
          href="/admin/members/create"
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow hover:bg-blue-700 transition"
        >
          + Add Member
        </Link>


      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.filter((member) => member.role === "member").length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-gray-500"
                >
                  No members found.
                </td>
              </tr>
            ) : (
              members
                .filter((member) => member.role === "member")
                .map((member) => (
                  <tr
                    key={member._id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {member.name}
                          </p>

                          {member.businessName && (
                            <p className="text-sm text-slate-500">
                              {member.businessName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {member.email}
                    </td>



                    {/* Actions */}

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <Link
                          href={`/admin/members/${member._id}`}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                        >
                          View
                        </Link>

                        <Link href={`/admin/members/${member._id}/edit`}
                        className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition">
                          Edit
                        </Link>



                        <button
                          onClick={() => handleDelete(member._id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}