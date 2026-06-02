"use client";

import { DoctorList } from "@/components/doctors/DoctorList";

export default function DoctorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Doctor Management</h1>
        <p className="text-sm text-zinc-500">Manage clinic doctors, their specialties, and consultation timings.</p>
      </div>
      
      <DoctorList />
    </div>
  );
}
