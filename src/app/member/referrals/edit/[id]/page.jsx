"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import axios from "axios";
import { apiRoot } from "@/services/api";

export default function EditReferralPage() {
  const { id } = useParams();
  const router = useRouter();

  const [members, setMembers] = useState([]);

  const [formData, setFormData] = useState({
    toMember: "",
    clientName: "",
    clientMobile: "",
    clientEmail: "",
    toMember: "",
    referralDetails: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchReferral();
      fetchMembers();
    }
  }, [id]);

  const fetchMembers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${apiRoot}/members`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMembers(res.data.members || []);
  } catch (err) {
    console.log(err);
  }
};

  const fetchReferral = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/referrals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const referral = res.data.referral;


      if (
        referral.status === "Approved" ||
        referral.status === "Rejected"
      ) {
        alert(
          "This referral cannot be edited"
        );

        router.push(
          "/member/referrals"
        );

        return;
      }

      setFormData({
        
        clientName: referral.clientName || "",
        clientMobile: referral.clientMobile || "",
        clientEmail: referral.clientEmail || "",
        toMember: referral.toMember?.name || "",
        referralDetails: referral.referralDetails || "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load referral");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);
      await axios.put(
        `${apiRoot}/referrals/${id}`,

        {
          toMember: formData.toMember,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientMobile: formData.clientMobile,
          toMember: formData.toMember,
          referralDetails: formData.referralDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Referral updated successfully");

      router.push("/member/referrals");
    } catch (error) {
      console.log(error.response?.data);
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Update failed"
      );
    }
  };
  if (loading) {
    return (
      <div className="p-6">
        Loading Referral...
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">
          Edit Referral
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium">
              Client Name
            </label>

            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Client Mobile
            </label>

            <input
              type="text"
              name="clientMobile"
              value={formData.clientMobile}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Client Email
            </label>

            <input
              type="text"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              To Member
            </label>

            <input
              type="text"
              name="toMember"
              value={formData.toMember}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Referral Details
            </label>

            <textarea
              name="referralDetails"
              value={formData.referralDetails}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Update Referral
          </button>
        </form>
      </div>
    </div>
  )


}
