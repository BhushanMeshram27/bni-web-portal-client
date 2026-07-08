"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRoot } from "@/services/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

async function apiRequest(path, options = {}) {

  const token = getToken();
  const currentUser = getCurrentUser();

  // Admin uses /admin/tyfcb
  // Member uses /tyfcb
  const basePath =
    currentUser?.role === "admin"
      ? `${apiRoot}/admin/tyfcb`
      : `${apiRoot}/tyfcb`;

  const res = await fetch(`${basePath}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function TYFCBDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [tyfcb, setTyfcb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);


  useEffect(() => {
    console.log("API =", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  const canApprove = (u) => {
  return u && u.role === "admin";
};

 const loadTyfcb = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await apiRequest(`/${id}`);

    setTyfcb(res.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    setUser(getCurrentUser());
    if (id) loadTyfcb();
  }, [id]);

  const handleApprove = async () => {
  try {
    setActionLoading(true);
    setError("");

    await apiRequest(`/${id}/approve`, {
      method: "PUT",
    });

    await loadTyfcb();
  } catch (err) {
    setError(err.message);
  } finally {
    setActionLoading(false);
  }
};

  const handleReject = async () => {
  const reason = window.prompt("Reason for rejection") || "";

  try {
    setActionLoading(true);
    setError("");

    await apiRequest(`/${id}/reject`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    });

    await loadTyfcb();
  } catch (err) {
    setError(err.message);
  } finally {
    setActionLoading(false);
  }
};

  if (loading) {
    return <p className="max-w-2xl mx-auto px-4 py-8 text-sm text-gray-500">Loading…</p>;
  }

  if (error && !tyfcb) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
          {error}
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Go back
        </button>
      </div>
    );
  }

  if (!tyfcb) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">TYFCB Details</h1>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[tyfcb.status]}`}
        >
          {tyfcb.status}
        </span>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Revenue Amount</p>
            <p className="text-sm font-medium text-gray-900">
             {tyfcb.currency} {Number(tyfcb.revenueAmount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Closing Date</p>
            <p className="text-sm font-medium text-gray-900">
             {tyfcb.closingDate
  ? new Date(tyfcb.closingDate).toLocaleDateString()
  : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Referral</p>
            <p className="text-sm font-medium text-gray-900">
{tyfcb.referral?.clientName ||
 tyfcb.referral?.referralDetails ||
 tyfcb.referral?._id ||
 "-"}      
       </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Submitted By</p>
            <p className="text-sm font-medium text-gray-900">
              {tyfcb.submittedBy
  ? `${tyfcb.submittedBy.name}${
      tyfcb.submittedBy.businessName
        ? ` (${tyfcb.submittedBy.businessName})`
        : ""
    }`
  : "-"}
            </p>
          </div>
        </div>

        {tyfcb.description && (
          <div>
            <p className="text-xs text-gray-500">Description</p>
            <p className="text-sm text-gray-700">{tyfcb.description}</p>
          </div>
        )}

        {tyfcb.status !== "pending" && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {tyfcb.status === "approved" ? "Approved" : "Rejected"} by{" "}
              {tyfcb.approvedBy?.name || "—"} on{" "}
              {tyfcb.approvedAt ? new Date(tyfcb.approvedAt).toLocaleDateString() : "—"}
            </p>
            {tyfcb.status === "rejected" && tyfcb.rejectionReason && (
              <p className="text-xs text-gray-600 mt-1">
                Reason: {tyfcb.rejectionReason}
              </p>
            )}
            {tyfcb.status === "approved" && (
              <p className="text-xs text-gray-600 mt-1">
                Chapter revenue updated: {tyfcb.chapterRevenueUpdated ? "Yes" : "No"}
              </p>
            )}
          </div>
        )}
      </div>

      {tyfcb.status === "pending" && canApprove(user) && (
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {actionLoading ? "Processing…" : "Approve"}
          </button>
          <button
            onClick={handleReject}
            disabled={actionLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {actionLoading ? "Processing…" : "Reject"}
          </button>
        </div>
      )}
    </div>
  );
}