"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, Mail, Phone, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { apiRoot } from "@/services/api";


export default function ContactMessagesPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${apiRoot}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setContacts(data.contacts || data);
      } else {
        toast.error(data.message || "Failed to load contacts");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${apiRoot}/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "Read",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Marked as read");
        fetchContacts();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteContact = async (id) => {
    if (!confirm("Delete this message?")) return;

    try {
      const res = await fetch(`${apiRoot}/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Deleted successfully");
        fetchContacts();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading Contact Messages...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Contact Messages</h1>
      </div>

      <div className="overflow-x-auto rounded-lg shadow bg-white">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-3 text-left">Name</th>

              <th className="px-4 py-3 text-left">Email</th>

              <th className="px-4 py-3 text-left">Subject</th>

              <th className="px-4 py-3 text-left">Status</th>

              <th className="px-4 py-3 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {contacts.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-500"
                >
                  No Contact Messages Found
                </td>

              </tr>

            ) : (

              contacts.map((contact) => (

                <tr
                  key={contact._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-4">{contact.name}</td>

                  <td className="px-4 py-4">{contact.email}</td>

                  <td className="px-4 py-4">{contact.subject}</td>

                  <td className="px-4 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        contact.status === "Read"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {contact.status}
                    </span>

                  </td>

                  <td className="px-4 py-4">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={20} />
                      </button>

                      <button
                        onClick={() => markAsRead(contact._id)}
                        className="text-green-600 font-medium"
                      >
                        Read
                      </button>

                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>

                    </div>


                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {selectedContact && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl w-full max-w-2xl p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-2xl font-bold">
                Contact Details
              </h2>

              <button
                onClick={() => setSelectedContact(null)}
                className="text-xl"
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">

              <p>
                <strong>Name:</strong> {selectedContact.name}
              </p>

              <p className="flex items-center gap-2">
                <Mail size={16} />
                {selectedContact.email}
              </p>

              <p className="flex items-center gap-2">
                <Phone size={16} />
                {selectedContact.mobile}
              </p>

              <p>
                <strong>Subject:</strong>{" "}
                {selectedContact.subject}
              </p>

              <p>
                <strong>Message:</strong>
              </p>

              <div className="bg-gray-100 rounded-lg p-4 whitespace-pre-wrap">
                {selectedContact.message}
              </div>

              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                {new Date(
                  selectedContact.createdAt
                ).toLocaleString()}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}