"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  getMeetingById,
  updateMeeting,
} from "@/services/meetingService";

export default function EditMeeting() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    meetingDate: "",
    location: "",
    description:"",
  });

  useEffect(() => {
    if (params?.id) {
      loadMeeting();
    }
  }, [params?.id]);

  const loadMeeting = async () => {
    try {
      const data = await getMeetingById(params.id);

      const meeting = data.meeting;

      setFormData({
        title: meeting.title || "",
        meetingDate: meeting.meetingDate
          ? meeting.meetingDate.split("T")[0]
          : "",
        location: meeting.location || "",
      });
    } catch (error) {
      console.error("Meeting Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateMeeting(
        params.id,
        formData
      );

      alert("Meeting Updated Successfully");

      router.push("/admin/meetings");
    } catch (error) {
      console.error(error);
      alert("Failed to update meeting");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 space-y-4"
    >
      <h1 className="text-3xl font-bold">
        Edit Meeting
      </h1>

      <input
        type="text"
        value={formData.title}
        className="w-full border p-3 rounded-lg"
        onChange={(e) =>
          setFormData({
            ...formData,
            title: e.target.value,
          })
        }
      />

      <input
        type="date"
        value={formData.meetingDate}
        className="w-full border p-3 rounded-lg"
        onChange={(e) =>
          setFormData({
            ...formData,
            meetingDate: e.target.value,
          })
        }
      />

      <input
        type="text"
        value={formData.location}
        className="w-full border p-3 rounded-lg"
        onChange={(e) =>
          setFormData({
            ...formData,
            location: e.target.value,
          })
        }
      />

       <input
        type="text"
        value={formData.description}
        className="w-full border p-3 rounded-lg"
        placeholder="Enter description about meeting"
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Update Meeting
      </button>
    </form>
  );
}