"use client";

import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/layout/SiteLayout";

export default function HomePage() {
  return (
    <SiteLayout>
      <main className="bg-white">
        <section className="pt-20 pb-28 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm">
                Trusted Business Networking Platform
              </span>

              <h1 className="mt-8 text-5xl lg:text-7xl font-bold leading-tight">
                Grow Your
                <span className="text-blue-400"> Business Network</span>
                <br />
                Faster Than Ever
              </h1>

              <p className="mt-8 text-lg text-slate-300 leading-8 max-w-xl">
                Connect with entrepreneurs, professionals, and business leaders.
                Generate referrals, build partnerships, and unlock new growth
                opportunities through one powerful platform.
              </p>

              <div className="flex flex-wrap gap-4 mt-10">
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white transition"
                >
                  Join Network
                </Link>

                <Link
                  href="/login"
                  className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white transition"
                >
                  Sign In
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <Image
                  src="/business-network2.webp"
                  alt="Business Network"
                  width={650}
                  height={500}
                  loading="eager"
                  className="w-full rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="-mt-16 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                ["10K+", "Members"],
                ["5000+", "Referrals"],
                ["250+", "Chapters"],
                ["₹50Cr+", "Business Generated"],
              ].map(([value, title]) => (
                <div
                  key={title}
                  className="bg-white rounded-3xl shadow-xl p-8 text-center"
                >
                  <h3 className="text-4xl font-bold text-blue-600">{value}</h3>
                  <p className="mt-2 text-gray-600">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-gray-900">Powerful Features</h2>
              <p className="mt-4 text-gray-600">
                Everything you need to grow your network.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {[
                "Member Directory",
                "Referral Tracking",
                "Meeting Management",
                "Attendance Monitoring",
                "Business Opportunities",
                "Analytics Dashboard",
              ].map((feature) => (
                <div
                  key={feature}
                  className="bg-white border border-gray-600 rounded-3xl p-8 hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-semibold">{feature}</h3>
                  <p className="mt-4 text-gray-600">
                    Manage and monitor your business activities effectively.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-900 text-white">
          <div className="max-w-5xl mx-auto text-center px-6">
            <h2 className="text-5xl font-bold">Ready To Expand Your Network?</h2>
            <p className="mt-6 text-gray-300 text-lg">
              Join thousands of professionals already growing their businesses through
              strategic networking.
            </p>

            <Link
              href="/register"
              className="inline-block mt-10 px-10 py-4 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Create Account
            </Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
