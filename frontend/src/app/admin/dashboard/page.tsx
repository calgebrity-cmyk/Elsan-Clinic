"use client";

import { Users, UserRound, Calendar, FileText, MessageSquare } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PatientGrowthChart } from "@/components/dashboard/PatientGrowthChart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard Overview</h1>
          <p className="text-sm text-zinc-500">Welcome back! Here's what's happening at Elsan Clinic today.</p>
        </div>
        <div className="flex gap-2">
          {/* Add date filter dropdown or buttons here later */}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value="12,345"
          icon={<Users />}
          trend="up"
          trendValue="+12%"
          description="from last month"
        />
        <StatCard
          title="Today's Appointments"
          value="42"
          icon={<Calendar />}
          trend="neutral"
          trendValue="Same"
          description="as yesterday"
        />
        <StatCard
          title="Prescriptions Issued"
          value="8,234"
          icon={<FileText />}
          trend="up"
          trendValue="+5%"
          description="from last month"
        />
        <StatCard
          title="WhatsApp Deliveries"
          value="7,980"
          icon={<MessageSquare />}
          trend="up"
          trendValue="99.8%"
          description="delivery rate"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <PatientGrowthChart />
        </div>
        <div className="lg:col-span-3 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900 mb-6">Today's Schedule</h3>
          <div className="space-y-4">
            {/* Placeholder for Recent Activity / Schedule */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium">
                  {i + 8}:00
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900">Patient Consultation</p>
                  <p className="text-xs text-zinc-500">Dr. Sarah Smith</p>
                </div>
                <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Confirmed
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
