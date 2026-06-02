"use client";

import { StaffTable } from "@/components/staff/StaffTable";

export default function StaffPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Staff Management</h1>
        <p className="text-sm text-zinc-500">Manage clinic receptionists and administrators.</p>
      </div>
      
      <StaffTable />
    </div>
  );
}
