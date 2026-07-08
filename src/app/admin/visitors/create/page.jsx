"use client";

import { apiRoot } from "@/services/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateVisitorPage() {
    const router = useRouter();

    const [meetings, setMeetings] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        company: "",
        profession: "",
        meeting: "",
        visitDate: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `${apiRoot}/meetings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMeetings(res.data.meetings || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            await axios.post(
                `${apiRoot}/visitors`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Visitor created successfully");

            router.push("/admin/visitors");
        } catch (error) {
            console.log("FULL ERROR:", error);
            console.log("RESPONSE:", error.response);
            console.log("DATA:", error.response?.data);

            alert(
                error?.response?.data?.message ||
                "Failed to create visitor"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 md:p-12 shadow-2xl">

                <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

                <div className="relative z-10">
                    <p className="text-sm uppercase tracking-[5px] text-blue-100">
                        BNI ADMIN PORTAL
                    </p>

                    <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
                        Create Visitor 👥
                    </h1>

                    <p className="mt-4 max-w-2xl text-blue-100">
                        Create a new visitor for the upcoming meeting.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div className="mx-auto mt-8 max-w-4xl">
                <div className="overflow-hidden rounded-[32px] border border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl">

                    {/* Header */}
                    <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Visitor Information
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Fill in the visitor details below.
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-8"
                    >
                        <div className="grid gap-6 md:grid-cols-2">

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Visitor Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter visitor name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Mobile Number
                                </label>

                                <input
                                    type="tel"
                                    name="mobile"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    placeholder="Enter mobile number"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Profession
                                </label>

                                <input
                                    type="text"
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    placeholder="Enter profession"
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>


                            {/* Company */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    placeholder="Enter company name"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Meeting
                                </label>

                                <select
                                    name="meeting"
                                    value={formData.meeting}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4"
                                >
                                    <option value="">Select Meeting</option>

                                    {meetings.map((meeting) => (
                                        <option key={meeting._id} value={meeting._id}>
                                            {meeting.title} | {meeting.location} |{" "}
                                            {new Date(meeting.meetingDate).toLocaleDateString()}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            {/* Visit Date */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Visit Date
                                </label>

                                <input
                                    type="date"
                                    name="visitDate"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={formData.visitDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  via-indigo-600
                  to-purple-600
                  px-8
                  py-4
                  font-semibold
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:shadow-2xl
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
                            >
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                        Creating...
                                    </span>
                                ) : (
                                    "Create Visitor"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="mt-8 grid gap-6 md:grid-cols-3">

                    <div className="rounded-3xl bg-white p-6 shadow-xl">
                        <div className="mb-4 text-4xl">🤝</div>
                        <h3 className="font-bold text-slate-800">
                            Grow Network
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Create visitor records for upcoming BNI meetings.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-xl">
                        <div className="mb-4 text-4xl">📈</div>
                        <h3 className="font-bold text-slate-800">
                            More Referrals
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                           Manage visitor registrations efficiently.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-xl">
                        <div className="mb-4 text-4xl">🚀</div>
                        <h3 className="font-bold text-slate-800">
                            Business Growth
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                           Keep visitor information organized for every meeting.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

