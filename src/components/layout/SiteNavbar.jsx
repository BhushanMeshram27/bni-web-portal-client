"use client";

import Link from "next/link";
import Image from "next/image";

export default function SiteNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/bni-logo.webp"
            alt="BNI Portal"
            width={55}
            height={45}
            className="w-12 rounded"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-slate-700 font-medium">
          <Link href="/#features">Features</Link>
          <Link href="/about">About</Link>
          <Link href="/success">Success Stories</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
