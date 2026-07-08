"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function EditVisitorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    mobile: "",
    status: "pending",
  });

  useEffect(() => {
    if (id) {
      fetchVisitor();
    }
  }, [id]);

  const fetchVisitor = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/visitors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const visitor = res.data.visitor;

      setFormData({
        name: visitor.name || "",
        email: visitor.email || "",
        company: visitor.company || "",
        mobile: visitor.mobile || "",
        status: visitor.status || "pending",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to fetch visitor");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `${apiRoot}/visitors/${id}`,
        {
          status: formData.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Visitor updated successfully");

      router.push("/admin/visitors");
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to update visitor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-8">
          Edit Visitor Status
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              value={formData.name}
              disabled
              className="w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="text"
              value={formData.email}
              disabled
              className="w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Company
            </label>

            <input
              type="text"
              value={formData.company}
              disabled
              className="w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mobile
            </label>

            <input
              type="text"
              value={formData.mobile}
              disabled
              className="w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Visitor Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Updating..."
                : "Update Visitor"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/visitors")
              }
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}