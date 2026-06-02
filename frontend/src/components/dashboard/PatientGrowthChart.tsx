"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", patients: 400 },
  { name: "Feb", patients: 600 },
  { name: "Mar", patients: 550 },
  { name: "Apr", patients: 800 },
  { name: "May", patients: 1200 },
  { name: "Jun", patients: 1500 },
  { name: "Jul", patients: 1400 },
];

export function PatientGrowthChart() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-900">Patient Growth</h3>
        <p className="text-sm text-zinc-500">Total registered patients over time</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area
              type="monotone"
              dataKey="patients"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPatients)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
