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
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Members API Response:", res.data);

      setMembers(res.data.data || res.data.members || []);
    } catch (error) {
      console.error("Fetch Members Error:", error);

      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      }
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

  if (loading) {
    return (
      <div className="p-6 text-xl font-semibold">
        Loading Members...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Members ({members.length})
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-gray-500"
                >
                  No members found
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id} className="border-t">
                  <td className="p-4">{member.name}</td>

                  <td className="p-4">{member.email}</td>

                  <td className="p-4 flex gap-2">
                    <Link
                      href={`/admin/members/${member._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => handleDelete(member._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                    >
                      Delete
                    </button>
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