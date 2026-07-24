import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-gray-500 text-sm">
          © 2026 BNI Portal. All rights reserved.
        </p>

        <div className="flex gap-6 mt-4 md:mt-0 text-gray-500 text-sm">
          <Link href="/privacy-policy" className="hover:text-gray-700 transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gray-700 transition">
            Terms & Conditions
          </Link>
          <Link href="/contact" className="hover:text-gray-700 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
