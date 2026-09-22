"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PALETTE = ["#312E81", "#818CF8", "#FACC15", "#10B981", "#F97316", "#EC4899", "#0EA5E9"];

export function UserGrowthChart({ data }: { data: Array<{ date: string; users: number; new_users: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={shortDate} />
        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} width={48} />
        <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => longDate(String(v))} />
        <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
        <Line type="monotone" dataKey="users" stroke="#312E81" strokeWidth={2.5} dot={false} name="Total users" />
        <Line type="monotone" dataKey="new_users" stroke="#FACC15" strokeWidth={2.5} dot={false} name="New users" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RevenueBarChart({ data }: { data: Array<{ date: string; revenue: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={shortDate} />
        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} width={48} />
        <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => longDate(String(v))} formatter={(v) => `$${Number(v).toFixed(2)}`} />
        <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DistributionPie({ data }: { data: Array<{ label: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 30px rgba(30,27,75,0.08)",
  fontSize: 12,
  fontWeight: 700,
};

function shortDate(d: string) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function longDate(d: string) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
