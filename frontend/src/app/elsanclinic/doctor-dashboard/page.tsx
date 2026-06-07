"use client";

import { useUser } from "../../../hooks";
import { Loader2 } from "lucide-react";
import { DoctorDashboard } from "../../../components/dashboard";

export default function DoctorDashboardPage() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-teal-600 w-8 h-8" /></div>;
  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 font-sans">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Doctor Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, Dr. {user.full_name.replace('Dr. ', '')}! Have a great shift.</p>
        </div>
        <div className="bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
          <span className="text-teal-700 font-semibold text-sm">Role: {user.role.replace('_', ' ')}</span>
        </div>
      </div>

      <DoctorDashboard user={user} />
    </div>
  );
}
