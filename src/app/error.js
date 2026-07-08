"use client";

export default function Error({ reset }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">
        Something went wrong
      </h1>

      <button
        onClick={() => reset()}
        className="mt-5 px-5 py-2 bg-blue-600 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}