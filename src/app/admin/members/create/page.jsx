"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { apiRoot } from "@/services/api";

export default function CreateMemberPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        businessName: "",
        profession: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.mobile ||
            !formData.businessName ||
            !formData.password
        ) {
            return toast.error(
                "Name, Email, Mobile, Business Name and Password are required"
            );
        }
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${apiRoot}/members`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(res.data.message || "Member created successfully");

           
            router.push("/admin/members");
        } catch (err) {
             console.error("Create Member Error:", err);

            toast.error(
                err.response?.data?.message ||
                err.response?.data?.error 
                || "Failed to create member"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg">

                <div className="px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Create Member
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Add a new BNI member.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6"
                >
                    {/* Name */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Full Name *
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter full name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Email *
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter email"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Mobile
                        </label>

                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            maxLength={10}
                            pattern="[6-9]{1}[0-9]{9}"
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter 10-digit mobile"
                        />
                    </div>

                    {/* Business */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Company
                        </label>

                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Business name"
                        />
                    </div>

                    {/* Profession */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Profession
                        </label>

                        <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Profession"
                        />
                    </div>

                 


                    {/* Password */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Password *
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Password"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/members")}
                            className="px-6 py-3 rounded-lg border hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}