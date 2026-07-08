export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">
        404
      </h1>

      <h2 className="text-2xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-600 mt-2">
        Sorry, the page you are looking for does not exist.
      </p>

      <a
        href="/"
        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg"
      >
        Go Home
      </a>
    </div>
  );
}