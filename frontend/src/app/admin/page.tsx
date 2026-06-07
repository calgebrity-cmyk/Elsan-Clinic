"use client";
import { useRouter } from 'next/navigation';

import {
  OverviewStats, DoctorsTable, StaffTable, PatientSearch,
  AppointmentCard, PrescriptionForm, SettingsPanel, ReceptionistDashboard,
  DoctorDashboard
} from "../../components/dashboard";
import { useUser } from "../../hooks";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const role = user.role;
  const isSuperAdmin = role === 'SUPER_ADMIN';

  return <DashboardOverview user={user} />;
}

function DashboardOverview({ user }: { user: any }) {
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {user.role === 'DOCTOR' ? 'Doctor Workspace' : 
             user.role === 'NURSE' ? 'Nursing Station' : 
             user.role === 'RECEPTIONIST' ? 'Front Desk Portal' : 'Executive Dashboard'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, {user.full_name}! Have a great shift.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <span className="text-blue-700 font-semibold text-sm">Role: {user.role.replace('_', ' ')}</span>
        </div>
      </div>

      {['SUPER_ADMIN', 'DIRECTOR', 'ANALYST'].includes(user.role) && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Clinic Performance</h2>
          <OverviewStats />
        </div>
      )}

      {['SUPER_ADMIN', 'DOCTOR'].includes(user.role) && (
        <DoctorDashboard user={user} />
      )}

      {['SUPER_ADMIN', 'NURSE', 'RECEPTIONIST'].includes(user.role) && (
        <ReceptionistDashboard onNavigateToTab={(tab: string) => router.push(`/admin/${tab}`)} />
      )}
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500">This module is being migrated to the new architecture.</p>
    </div>
  );
}
