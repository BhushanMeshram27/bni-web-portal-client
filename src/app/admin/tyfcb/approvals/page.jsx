"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

async function apiRequest(path, options = {}) {

  const token = getToken();
  const url = `${apiRoot}/admin/tyfcb${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but got "${contentType || "unknown"}" (status ${res.status}).\nURL: ${url}`
    );
  }

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid JSON response from server.");
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed with status ${res.status}.`);
  }

  return data;
}

export default function TYFCBApprovalsPage() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canApprove = (u) => u && (u.role === "admin" || u.position === "vp");

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("?status=pending");
      setItems(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (canApprove(currentUser)) {
      loadPending();
    } else {
      setLoading(false);
    }
  }, []);

  const handleApprove = async (id) => {
    try {
      await apiRequest(`/${id}/approve`, { method: "PUT" });
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):") || "";
    try {
      await apiRequest(`/${id}/reject`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
      });
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!loading && !canApprove(user)) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          You don&apos;t have permission to view this page. Only the chapter VP
          or an admin can approve TYFCB submissions.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        TYFCB — Pending Approval
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No pending submissions.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {item.currency} {item.revenueAmount.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.closingDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Submitted by {item.submittedBy?.name}
              </p>
              {item.description && (
                <p className="text-xs text-gray-500 mb-3">{item.description}</p>
              )}
              <div className="flex gap-2">
                <Link
                  href={`/member/tyfcb/${item._id}`}
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleApprove(item._id)}
                  className="ml-auto rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(item._id)}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}