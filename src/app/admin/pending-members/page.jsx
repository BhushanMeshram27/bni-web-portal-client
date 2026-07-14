"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function PendingMembersPage() {
  const [members, setMembers] = useState([]);
const [chapters, setChapters] = useState([]);
const [selectedChapters, setSelectedChapters] = useState({});
const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchMembers();
    fetchChapters();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/members/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembers(res.data.members);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChapters = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiRoot}/chapters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChapters(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const approveMember = async (memberId, chapterId) => {
    if (!chapterId) {
      alert("Please select a chapter");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${apiRoot}/members/${memberId}/approve`,
        {
          chapter: chapterId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Member approved successfully");
      fetchMembers();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Pending Members
      </h1>

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Email</th>
            <th>Chapter</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {members.map((member) => {

            const [selectedChapter, setSelectedChapter] = useState("");

            return (
              <tr key={member._id}>

                <td>{member.name}</td>

                <td>{member.email}</td>

                <td>

                <select
  value={selectedChapters[member._id] || ""}
  onChange={(e) =>
    setSelectedChapters((prev) => ({
      ...prev,
      [member._id]: e.target.value,
    }))
  }
>
  <option value="">Select Chapter</option>

  {chapters.map((chapter) => (
    <option
      key={chapter._id}
      value={chapter._id}
    >
      {chapter.name}
    </option>
  ))}
</select>

<button
  onClick={() =>
    approveMember(
      member._id,
      selectedChapters[member._id]
    )
  }
>
  Approve
</button>

                </td>

              </tr>
            );

          })}

        </tbody>

      </table>

    </div>
  );
}