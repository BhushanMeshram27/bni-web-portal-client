"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { apiRoot } from "@/services/api";

export default function EditMemberPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    businessName: "",
    profession: "",
  });

  useEffect(() => {
    fetchMember();
  }, []);

  const fetchMember = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${apiRoot}/members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const member = res.data.data;

      setFormData({
        name: member.name || "",
        email: member.email || "",
        mobile: member.mobile || "",
        businessName: member.businessName || "",
        profession: member.profession || "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load member"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.businessName
    ) {
      return toast.error(
        "Name, Email, Mobile and Business Name are required"
      );
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${apiRoot}/members/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        res.data.message || "Member updated successfully"
      );

      router.push("/admin/members");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update member"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">

        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Member
          </h1>

          <p className="text-gray-500 mt-1">
            Update member details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6"
        >
          <div>
            <label className="block mb-2 font-medium">
              Full Name *
            </label>

            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email *
            </label>

            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Mobile *
            </label>

            <input
              type="tel"
              name="mobile"
              required
              maxLength={10}
              pattern="[6-9][0-9]{9}"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Company *
            </label>

            <input
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Profession
            </label>

            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <div className="md:col-span-2 flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/members")}
              className="px-6 py-3 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}