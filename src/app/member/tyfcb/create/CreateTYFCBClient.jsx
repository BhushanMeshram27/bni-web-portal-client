"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRoot } from "@/services/api";

const todayStr = () => new Date().toISOString().split("T")[0];

const currencySymbols = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function CreateTYFCBClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralIdFromQuery = searchParams.get("referralId") || "";

  const [form, setForm] = useState({
    referral: referralIdFromQuery,
    revenueAmount: "",
    currency: "INR",
    closingDate: todayStr(),
    description: "",
  });

  const [referrals, setReferrals] = useState([]);
  const [referralsLoading, setReferralsLoading] = useState(true);
  const [referralsError, setReferralsError] = useState("");
const [chapters, setChapters] = useState([]);
const [selectedChapter, setSelectedChapter] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load referrals that were sent TO the current member — these are the only
  // valid ones they're allowed to submit a TYFCB against.

  useEffect(() => {
    if (referralIdFromQuery) {
      setForm((prev) => ({
        ...prev,
        referral: referralIdFromQuery,
      }));
    }
  }, [referralIdFromQuery]);


  useEffect(() => {
    const loadReferrals = async () => {
      try {
        const token = getToken();


        const response = await fetch(`${apiRoot}/referrals/received`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = await response.json();

        console.log("Received Referrals:", res);

        if (!response.ok) {
          throw new Error(res.message || "Failed to load referrals");
        }

        if (res.success) {
          setReferrals(res.referrals || []);
        } else {
          setReferrals([]);
          setReferralsError(res.message || "No referrals found.");
        }
      } catch (err) {
        console.error(err);
        setReferrals([]);
        setReferralsError(err.message || "Failed to load referrals");
      } finally {
        setReferralsLoading(false);
      }
    };

    loadReferrals();
  }, []);

useEffect(() => {
  const loadChapters = async () => {
    try {
      const token = getToken();

     const user = JSON.parse(localStorage.getItem("user"));

console.log("Logged-in user:", user);

const memberId = user.id || user._id;

const response = await fetch(
  `${apiRoot}/chapter-members/member/${memberId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();

      if (data.success) {
        setChapters(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  loadChapters();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.referral || !form.revenueAmount || !form.closingDate) {
      setError("Referral, revenue amount, and closing date are required.");
      return;
    }

    const amount = Number(form.revenueAmount);

    if (isNaN(amount) || amount <= 0) {
      setError("Revenue amount must be greater than zero.");
      return;
    }
    if (!selectedChapter) {
  setError("Please select a chapter.");
  return;
}

    setSubmitting(true);

    try {
      const token = getToken();

      if (!token) {
        setError("Please login again.");
        setSubmitting(false);
        return;
      }

      const response = await fetch(`${apiRoot}/tyfcb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  ...form,
  chapter: selectedChapter,
  revenueAmount: amount,
}),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit TYFCB.");
      }

     setSubmitted(true);

setTimeout(() => {
  router.replace(`/member/tyfcb/${data.data._id}`);
}, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center rounded-2xl border border-green-200 bg-green-50 px-6 py-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Revenue Submitted</h2>
          <p className="mt-1 text-sm text-gray-600">
            Your TYFCB is now pending VP approval. Redirecting…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Submit Closed Business Revenue
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Thank You For Closed Business (TYFCB) — this will be sent for VP
          approval before it counts toward chapter revenue.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
          <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referral <span className="text-red-500">*</span>
            </label>

            {referralsError && (
              <p className="mb-2 text-xs text-red-600">{referralsError}</p>
            )}

            <select
              name="referral"
              value={form.referral}
              onChange={handleChange}
              disabled={referralsLoading || !!referralIdFromQuery}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">
                {referralsLoading
                  ? "Loading referrals..."
                  : referrals.length === 0
                    ? "No referrals found"
                    : "Select a referral"}
              </option>

              {referrals
                .filter((r) => !referralIdFromQuery || r._id === referralIdFromQuery)
                .map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.clientName ||
                      r.businessName ||
                      r.referralName ||
                      r.description ||
                      "Referral"}
                  </option>
                ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              Only referrals sent to you appear here — this links the revenue
              to the referral it came from.
            </p>
          </div>

           {/* Chapter */}
  <div className="mb-4">
    <label className="block mb-2 font-medium">
      Chapter
    </label>

    <select
      value={selectedChapter}
      onChange={(e) => setSelectedChapter(e.target.value)}
      className="w-full border rounded-lg p-3"
    >
      <option value="">Select Chapter</option>

      {chapters
  .filter((item) => item.chapter)
  .map((item) => (
    <option
      key={item.chapter._id}
      value={item.chapter._id}
    >
      {item.chapter.name}
    </option>
))}
    </select>
  </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Revenue Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-400">
                  {currencySymbols[form.currency] || ""}
                </span>
                <input
                  type="number"
                  name="revenueAmount"
                  value={form.revenueAmount}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Closing Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="closingDate"
              value={form.closingDate}
              onChange={handleChange}
              max={todayStr()}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <span className="text-xs text-gray-400">
                {form.description.length}/500
              </span>
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              placeholder="Any details about the closed business…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={
              submitting ||
              referralsLoading ||
              referrals.length === 0
            }
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {submitting
              ? "Submitting..."
              : referralsLoading
                ? "Loading..."
                : referrals.length === 0
                  ? "No Referrals Available"
                  : "Submit Revenue"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}