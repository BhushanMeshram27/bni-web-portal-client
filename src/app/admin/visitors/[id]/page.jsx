"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { apiRoot } from "@/services/api";

export default function VisitorDetailsPage() {
  const { id } = useParams();

  const [visitor, setVisitor] = useState(null);

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

      setVisitor(res.data.visitor);
    } catch (error) {
      console.log(error);
    }
  };

  if (!visitor) {
    return (
      <div className="p-6">
        Loading Visitor...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">
          Visitor Details
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500">
              Name
            </p>

            <h3 className="font-semibold text-lg">
              {visitor.name}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Email
            </p>

            <h3 className="font-semibold text-lg">
              {visitor.email}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Mobile
            </p>

            <h3 className="font-semibold text-lg">
              {visitor.mobile}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Company
            </p>

            <h3 className="font-semibold text-lg">
              {visitor.company || "N/A"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Profession
            </p>

            <h3 className="font-semibold text-lg">
              {visitor.profession || "N/A"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Meeting
            </p>

            <h3 className="font-semibold text-lg">
              {visitor.meeting?.title || "N/A"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Meeting Date
            </p>

            <h3 className="font-semibold text-lg">
              {visitor.meeting?.meetingDate
                ? new Date(visitor.meeting.meetingDate).toLocaleDateString()
                : "N/A"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Meeting Location
            </p>

            <h3 className="font-semibold text-lg">
              {visitor.meeting?.location || "N/A"}
            </h3>
          </div>


          <div>
            <p className="text-gray-500">
              Invited By
            </p>

            <h3 className="font-semibold text-lg">
              {visitor.invitedBy?.name ||
                "N/A"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Visit Date
            </p>

            <h3 className="font-semibold text-lg">
              {visitor.visitDate
                ? new Date(
                  visitor.visitDate
                ).toLocaleDateString()
                : "N/A"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Status
            </p>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {visitor.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}