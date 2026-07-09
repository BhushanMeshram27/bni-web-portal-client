"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiRoot } from "@/services/api";

export default function RegisterPage() {
const router = useRouter();

const [formData, setFormData] = useState({
name: "",
businessName: "",
email: "",
mobile: "",
password: "",
confirmPassword: "",
role: "visitor",

});

const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();

if (formData.password !== formData.confirmPassword) {
  alert("Passwords do not match");
  return;
}

try {
  setLoading(true);

  const response = await fetch(
    `${apiRoot}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        businessName: formData.businessName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: formData.role,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed"
    );
  }

  alert("Registration Successful");

  router.push("/login");
} catch (error) {
  alert(error.message);
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">


  <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

    {/* Left Section */}
    <div className="hidden lg:flex flex-col justify-center bg-linear-to-br from-blue-700 via-indigo-700 to-gray-900 p-14 text-white">

      <h1 className="text-5xl font-bold leading-tight">
        Join Our
        <br />
        Business Network
      </h1>

      <p className="mt-6 text-lg text-blue-100 leading-8">
        Connect with entrepreneurs, professionals,
        and business leaders. Build valuable
        relationships and grow your business.
      </p>

      <div className="grid grid-cols-2 gap-5 mt-12">

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
          <h2 className="text-3xl font-bold">10K+</h2>
          <p className="mt-2">Active Members</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
          <h2 className="text-3xl font-bold">250+</h2>
          <p className="mt-2">Business Chapters</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
          <h2 className="text-3xl font-bold">5000+</h2>
          <p className="mt-2">Referrals Shared</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
          <h2 className="text-3xl font-bold">₹50Cr+</h2>
          <p className="mt-2">Business Generated</p>
        </div>

      </div>

    </div>

    {/* Right Section */}
    <div className="p-8 md:p-12">

      <div className="flex justify-center mb-8">
        <Image
          src="/bni-logo.webp"
          alt="BNI Logo"
          width={180}
          height={60}
          priority
          className="w-auto h-auto"
        />
      </div>

      <div className="max-w-xl mx-auto">

        <h2 className="text-4xl font-bold text-gray-900 text-center">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mt-3">
          Register and start growing your business
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5 mt-10"
        >

          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Rahul Mahajan"
              required
              className="w-full h-14 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Business Name
            </label>

            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="ABC Pvt Ltd"
              className="w-full h-14 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rahul@example.com"
              required
              className="w-full h-14 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mobile Number
            </label>

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full h-14 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create Password"
              required
              className="w-full h-14 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full h-14 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Select Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full h-14 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="visitor">
                Visitor
              </option>

              <option value="member">
                Member
              </option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                required
                className="w-4 h-4"
              />

              I agree to the Terms & Conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?
        </p>

        <div className="text-center mt-2">
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            Sign In
          </Link>
        </div>

      </div>

    </div>

  </div>

</div>


);
}
