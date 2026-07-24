"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apiRoot } from "@/services/api";

export default function CreateReferralPage() {
  const router = useRouter();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientMobile: "",
    toMember: "",
    referralDetails: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

 const fetchMembers = async () => {
  try {

    const token = localStorage.getItem("token");


    // Get logged-in user
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const currentUserId = user?._id;


    const res = await axios.get(
      `${apiRoot}/members`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Current logged-in member
    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    // Remove logged-in member from list
    const otherMembers = (res.data.data || [])
      .filter(
        (member) =>
          member._id !== currentUserId
      );


    setMembers(otherMembers);


  } catch(error) {

    console.log(
      "Members Error:",
      error.response?.data || error.message
    );

    setMembers([]);

  } finally {

    setFetching(false);

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

    if (!formData.toMember) {
      alert("Please select a member");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        `${apiRoot}/referrals`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Referral created successfully");
      router.push("/member/referrals");
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to create referral"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">
        Create Referral
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4"
      >

        {/* Client Name */}
        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={formData.clientName}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
  type="email"
  name="clientEmail"
  placeholder="Client Email"
  value={formData.clientEmail}
  onChange={handleChange}
  className="w-full border p-3 rounded"
  required
/>

        {/* Mobile */}
        <input
          type="tel"
          name="clientMobile"
          placeholder="Client Mobile"
          value={formData.clientMobile}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          pattern="[6-9][0-9]{9}"
          maxLength={10}
          title="Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9"
          required
        />
<select
  name="toMember"
  value={formData.toMember}
  onChange={handleChange}
  className="w-full border p-3 rounded"
  required
>

<option value="">
  Select Member
</option>


{members.map((m)=>(

<option
  key={m._id}
  value={m._id}
>
  {m.name}
  {m.businessName && ` | ${m.businessName}`}
  {m.profession && ` | ${m.profession}`}
</option>

))}

</select>

        {/* Details */}
        <textarea
          name="referralDetails"
          placeholder="Referral Details"
          value={formData.referralDetails}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows="5"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          {loading ? "Creating..." : "Create Referral"}
        </button>

      </form>
    </div>
  );
}