"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRoot } from "@/services/api";

// Base URL for all API calls made from this page.
// Set NEXT_PUBLIC_API_ROOT in your .env file, falls back to same-origin /api during local dev.

const FALLBACK_STATS = [
  { label: "Members", value: "10K+" },
  { label: "Referrals", value: "5000+" },
  { label: "Chapters", value: "250+" },
  { label: "Business Generated", value: "\u20B950Cr+" },
];

const PILLARS = [
  {
    title: "Givers Gain",
    copy:
      "The philosophy at the center of every chapter: what you give away comes back multiplied. Members refer business before they expect it in return.",
  },
  {
    title: "One Seat, One Industry",
    copy:
      "Each chapter holds a single seat per profession, so members become the trusted go-to name in their category instead of competing for the same lead.",
  },
  {
    title: "Structured Weekly Meetings",
    copy:
      "Consistent, agenda-driven meetings turn casual acquaintances into referral partners who understand each other's business inside and out.",
  },
  {
    title: "Accountability By Design",
    copy:
      "Attendance, referrals, and one-to-ones are tracked openly, so momentum in the chapter is visible to everyone, not just assumed.",
  },
];

const TIMELINE = [
  {
    year: "Chapter Founded",
    copy: "A handful of local business owners started meeting weekly with one rule: refer first, ask later.",
  },
  {
    year: "Network Effect",
    copy: "As referrals compounded, chapters multiplied across regions, each keeping the one-seat-per-industry model intact.",
  },
  {
    year: "Portal Launched",
    copy: "BNI Portal digitized attendance, referral tracking, and meeting management, so growth could be measured, not guessed at.",
  },
  {
    year: "Today",
    copy: "Thousands of members use the portal weekly to track referrals, log one-to-ones, and grow their chapters with real data.",
  },
];

export default function AboutPage() {
  const router = useRouter();
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const res = await fetch(`${apiRoot}/stats`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length) {
          setStats(data);
        }
      } catch (err) {
        // Silently keep the fallback stats — the About page shouldn't break
        // just because the stats endpoint is unavailable.
        console.error("Could not fetch live stats:", err);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="bg-[#FAF9F7] text-[#1A1A1A]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/5 px-6 pt-28 pb-24 md:px-12">
        <NetworkBackdrop />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-[#1A2A5E]/20bg-[#1A2A5E]/5 px-4 py-1 text-xs font-semibold tracking-wide text-[#1A2A5E] uppercase">
            About BNI Portal
          </span>
          <h1 className="mt-6 font-[Sora,sans-serif] text-4xl font-bold leading-tight md:text-6xl">
            Referrals aren&apos;t luck.
            <br />
            <span className="text-[#1A2A5E]">They&apos;re a system.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#4B4B4B]">
            BNI Portal is the digital backbone for BNI chapters — one place to track referrals,
            log attendance, run meetings, and see exactly how your network is growing your
            business, week over week.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => router.push("/register")}
              className="rounded-lg bg-[#1A2A5E] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#142047]"
            >
              Join a Chapter
            </button>
            <button
              onClick={() => router.push("/login")}
              className="rounded-lg border border-black/10 bg-white px-6 py-3 font-semibold text-[#1A1A1A] transition hover:border-black/20"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-black/5 px-6 py-14 md:px-12">
        <div
          className={`mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center transition-opacity md:grid-cols-4 ${
            loadingStats ? "opacity-60" : "opacity-100"
          }`}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-[Sora,sans-serif] text-3xl font-bold text-[#1A2A5E] md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-[#6B7280]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-[Sora,sans-serif] text-3xl font-bold">Our Mission</h2>
            <div className="mt-4 h-1 w-14 rounded-full bg-[#D4A017]" />
          </div>
          <p className="text-lg leading-relaxed text-[#4B4B4B]">
            BNI Portal exists to make one philosophy easy to practice: Givers Gain. When
            referrals, meetings, and relationships are tracked in one place, trust becomes
            measurable — and measurable trust compounds. Our job is to remove the friction
            between meeting someone at a chapter and doing real business with them.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-black/5 bg-white px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-[Sora,sans-serif] text-3xl font-bold">
            What Makes A Chapter Work
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-black/5 p-6 transition hover:border-[#B91C2C]/30 hover:shadow-sm"
              >
                <h3 className="font-[Sora,sans-serif] text-xl font-semibold">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[#6B7280]">{pillar.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-[Sora,sans-serif] text-3xl font-bold">Our Journey</h2>
          <div className="mt-12 space-y-10 border-l-2 border-[#D4A017]/40 pl-8">
            {TIMELINE.map((item) => (
              <div key={item.year} className="relative">
                <span className="absolute -left-[38px] top-1 h-3 w-3 rounded-full bg-[#1A2A5E]" />
                <h3 className="font-[Sora,sans-serif] text-lg font-semibold text-[#1A2A5E]">
                  {item.year}
                </h3>
                <p className="mt-1 text-[#4B4B4B]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1A1A1A] px-6 py-20 text-center text-white md:px-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-[Sora,sans-serif] text-3xl font-bold md:text-4xl">
            Ready to put your network to work?
          </h2>
          <p className="mt-4 text-white/70">
            Create an account and see your referrals, meetings, and chapter growth in one
            dashboard.
          </p>
          <button
            onClick={() => router.push("/register")}
            className="mt-8 rounded-lg bg-[#D4A017] px-8 py-3 font-semibold text-[#1A1A1A] transition hover:bg-[#C29215]"
          >
            Create Account
          </button>
        </div>
      </section>
    </main>
  );
}

/**
 * Subtle connection-map motif behind the hero — a nod to the referral
 * network itself: nodes (members) linked by lines (referrals).
 */
function NetworkBackdrop() {
  const nodes = [
    [60, 60], [180, 40], [300, 90], [420, 50], [520, 110],
    [90, 160], [230, 180], [360, 170], [480, 190], [560, 150],
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5],
    [1, 6], [2, 6], [3, 7], [4, 8], [7, 8],
    [8, 9], [5, 6], [6, 7],
  ];

  return (
    <svg
      viewBox="0 0 600 220"
      className="pointer-events-none absolute inset-x-0 top-0 h-56 w-full opacity-[0.08] md:h-64"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="#1A2A5E"
          strokeWidth="1.5"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="#1A2A5E" />
      ))}
    </svg>
  );
}
