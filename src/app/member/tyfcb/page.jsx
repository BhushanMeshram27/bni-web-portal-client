"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRoot } from "@/services/api";

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function MyTYFCBPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {

console.log("API URL:", apiRoot);

        const token = getToken();
        const url = `${apiRoot}/tyfcb`;

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

        setItems(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My TYFCB Submissions</h1>
        <Link
          href="/member/tyfcb/create"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + New Submission
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No TYFCB submissions yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item._id}
              href={`/member/tyfcb/${item._id}`}
              className="block rounded-lg border border-gray-200 p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {item.currency} {item.revenueAmount.toLocaleString()}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Closed on {new Date(item.closingDate).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}