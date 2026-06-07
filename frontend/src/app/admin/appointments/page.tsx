"use client";
import { AppointmentCard, DoctorAppointments } from '../../../components/dashboard';
import { useUser } from '../../../hooks';
import { Loader2 } from 'lucide-react';

export default function AppointmentCardPage() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  if (user?.role === 'DOCTOR') {
    return <DoctorAppointments user={user} />;
  }

  return <AppointmentCard />;
}
