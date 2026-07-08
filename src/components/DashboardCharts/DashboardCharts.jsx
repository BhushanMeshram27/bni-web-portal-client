"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export default function DashboardCharts({ stats }) {
  // Bar Chart Data
  const barData = [
    {
      name: "Members",
      value: stats.totalMembers || 0,
    },
    {
      name: "Meetings",
      value: stats.totalMeetings || 0,
    },
    {
      name: "Referrals",
      value: stats.totalReferrals || 0,
    },
    {
      name: "Visitors",
      value: stats.totalVisitors || 0,
    },
  ];

  // Attendance Pie Chart Data
  const attendanceData = [
  {
    name: "Present",
    value: stats.totalPresent || 0,
  },
  {
    name: "Absent",
    value: stats.totalAbsent || 0,
  },
];

  // Colors
  const BAR_COLOR = "#2563eb";

  const PIE_COLORS = [
    "#16a34a", // Present (Green)
    "#dc2626", // Absent (Red)
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ================= BAR CHART ================= */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">
          System Statistics
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="value"
              fill={BAR_COLOR}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= PIE CHART ================= */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">
          Attendance Ratio
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={attendanceData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {attendanceData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={PIE_COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Attendance Summary */}
        <div className="mt-4 flex justify-around text-center">
          <div>
            <p className="text-green-600 font-bold text-xl">
              {stats.totalPresent|| 0}
            </p>
            <p className="text-gray-500 text-sm">Present</p>
          </div>

          <div>
            <p className="text-red-600 font-bold text-xl">
              {stats.totalAbsent || 0}
            </p>
            <p className="text-gray-500 text-sm">Absent</p>
          </div>

          <div>
            <p className="text-blue-600 font-bold text-xl">
              {stats.attendancePercentage || 0}%
            </p>
            <p className="text-gray-500 text-sm">Attendance</p>
          </div>
        </div>
      </div>
    </div>
  );
}