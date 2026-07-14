"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function UpdateContactPage() {
  const { id } = useParams();
  const router = useRouter();

  const [contact, setContact] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await axios.get(
        `{apiRoot}/contacts/${id}`
      );

      setContact(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load contact.");
    }
  };

  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `{apiRoot}/contacts/${id}`,
        contact
      );

      alert("Contact updated successfully");

      router.push("/admin/contacts");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-6">
        Update Contact
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          type="text"
          name="name"
          value={contact.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-3 rounded"
        />

        <input
          type="email"
          name="email"
          value={contact.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="mobile"
          value={contact.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="subject"
          value={contact.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full border p-3 rounded"
        />

        <textarea
          name="message"
          rows={5}
          value={contact.message}
          onChange={handleChange}
          placeholder="Message"
          className="w-full border p-3 rounded"
        />

        <select
          name="status"
          value={contact.status}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Update Contact
        </button>
      </form>
    </div>
  );
}