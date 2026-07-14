"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
return ( <main className="min-h-screen bg-white">

  
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

      <Image
        src="/bni-logo.webp"
        alt="BNI Portal"
        width={55}
        height={45}
        className="w-12 rounded"
        priority
      />

      <nav className="hidden md:flex items-center gap-10 text-slate-700 font-medium">
        <a href="#features">Features</a>
        <a href="/about">About</a>
        <a href="/success">Success Stories</a>
        <a href="/contact">Contact</a>
      </nav>

      <div className="flex items-center gap-4">

        <Link
          href="/login"
          className="px-5 py-2.5 rounded-xl  bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Register
        </Link>

      </div>

    </div>
  </header>

  
  <section className="pt-40 pb-28 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">

    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

      <div>

        <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm">
          Trusted Business Networking Platform
        </span>

        <h1 className="mt-8 text-5xl lg:text-7xl font-bold leading-tight">
          Grow Your
          <span className="text-blue-400">
            {" "}Business Network
          </span>
          <br />
          Faster Than Ever
        </h1>

        <p className="mt-8 text-lg text-slate-300 leading-8 max-w-xl">
          Connect with entrepreneurs, professionals,
          and business leaders. Generate referrals,
          build partnerships, and unlock new growth
          opportunities through one powerful platform.
        </p>

        <div className="flex flex-wrap gap-4 mt-10">

          <Link
            href="/register"
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            Join Network
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 rounded-xl  bg-blue-600 hover:bg-blue-700 font-semibold"
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
          ["₹50Cr+", "Business Generated"]
        ].map(([value, title]) => (
          <div
            key={title}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <h3 className="text-4xl font-bold text-blue-600">
              {value}
            </h3>

            <p className="mt-2 text-gray-600">
              {title}
            </p>
          </div>
        ))}

      </div>

    </div>

  </section>

  
  <section
    id="features"
    className="py-28"
  >

    <div className="max-w-7xl mx-auto px-6">

      <div className="text-center">

        <h2 className="text-5xl font-bold text-gray-900">
          Powerful Features
        </h2>

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
          "Analytics Dashboard"
        ].map((feature) => (
          <div
            key={feature}
            className="bg-white border border-gray-600 rounded-3xl p-8 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold">
              {feature}
            </h3>

            <p className="mt-4 text-gray-600">
              Manage and monitor your business
              activities effectively.
            </p>

          </div>
        ))}

      </div>

    </div>

  </section>

  
  <section className="py-24 bg-gray-900 text-white">

    <div className="max-w-5xl mx-auto text-center px-6">

      <h2 className="text-5xl font-bold">
        Ready To Expand Your Network?
      </h2>

      <p className="mt-6 text-gray-300 text-lg">
        Join thousands of professionals already
        growing their businesses through strategic
        networking.
      </p>

      <Link
        href="/register"
        className="inline-block mt-10 px-10 py-4 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700"
      >
        Create Account
      </Link>

    </div>

  </section>

  
  <footer className="bg-white border-t border-gray-200 py-8">

    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">

      <p className="text-gray-500">
        © 2026 BNI Portal. All rights reserved.
      </p>

      <div className="flex gap-6 mt-4 md:mt-0 text-gray-500">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </div>

    </div>

  </footer>

</main>

);
}
