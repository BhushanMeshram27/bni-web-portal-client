import Link from "next/link";
import SiteLayout from "@/components/layout/SiteLayout";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-gray-100 px-4">
        <h1 className="text-6xl font-bold text-red-600">404</h1>

        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>

        <p className="text-gray-600 mt-2 text-center">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link href="/" className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Go Home
        </Link>
      </div>
    </SiteLayout>
  );
}
