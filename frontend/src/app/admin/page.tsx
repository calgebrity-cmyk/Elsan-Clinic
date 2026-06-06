"use client";
import { useRouter } from 'next/navigation';

import {
  OverviewStats, DoctorsTable, StaffTable, PatientSearch,
  AppointmentCard, PrescriptionForm, SettingsPanel, ReceptionistDashboard
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
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2">
              <h3 className="font-semibold text-slate-800 mb-4">Today's Schedule</h3>
              <div className="space-y-4">
                {[
                  { time: '09:00 AM', patient: 'Rahul Kumar', type: 'General Checkup', status: 'Waiting' },
                  { time: '10:30 AM', patient: 'Priya Sharma', type: 'Follow-up', status: 'Next' },
                  { time: '11:15 AM', patient: 'Amit Patel', type: 'Consultation', status: 'Scheduled' },
                  { time: '02:00 PM', patient: 'Sneha Gupta', type: 'Telemedicine', status: 'Scheduled' }
                ].map((apt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-md text-sm">{apt.time}</div>
                      <div>
                        <p className="font-medium text-slate-800">{apt.patient}</p>
                        <p className="text-xs text-slate-500">{apt.type}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      apt.status === 'Waiting' ? 'bg-orange-100 text-orange-700' : 
                      apt.status === 'Next' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">+</div>
                    <span className="text-xs font-medium text-center">New Prescription</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">📷</div>
                    <span className="text-xs font-medium text-center">Start Telemed</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center">✓</div>
                    <span className="text-xs font-medium text-center">Mark Complete</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">👤</div>
                    <span className="text-xs font-medium text-center">Patient History</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {['SUPER_ADMIN', 'NURSE', 'RECEPTIONIST'].includes(user.role) && (
        <ReceptionistDashboard onNavigateToTab={(tab) => router.push(`/admin/${tab}`)} />
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
