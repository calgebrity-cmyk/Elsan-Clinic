"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Phone, CheckCircle2, FileText, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppointment, useUpdateAppointmentStatus } from "@/hooks/useAppointments";

export default function AppointmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Extract id resolving the params Promise (Next 15 feature)
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // React Query Hook
  const { data: appointment, isLoading } = useAppointment(id);
  const updateStatus = useUpdateAppointmentStatus();

  // Temporary mock fallback for UI demonstration
  const data = appointment || {
    id: "A-1001",
    patientName: "Rahul Sharma",
    phone: "+91 9876543210",
    doctor: "Dr. Sarah Smith",
    date: "2023-11-20",
    time: "10:30 AM",
    status: "SCHEDULED",
    notes: "Patient complained of mild chest pain for the last 2 days."
  };

  const handleMarkCompleted = () => {
    updateStatus.mutate({ id: data.id, status: 'COMPLETED' });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/appointments">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Appointment Details</h1>
          <p className="text-sm text-zinc-500">ID: {data.id}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {data.status === 'SCHEDULED' && (
            <>
              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Ban className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Link href={`/admin/visits/create?appointmentId=${data.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" /> Create Visit
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <User className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">{data.patientName}</p>
                <div className="flex items-center text-xs text-zinc-500 mt-1">
                  <Phone className="h-3 w-3 mr-1" /> {data.phone}
                </div>
              </div>
            </div>
            {data.notes && (
              <div className="mt-4 p-3 bg-amber-50 text-amber-900 text-sm rounded-md border border-amber-200">
                <p className="font-semibold mb-1">Booking Notes:</p>
                <p>{data.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-zinc-500">Doctor</span>
                <span className="font-medium">{data.doctor}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-zinc-500">Status</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium w-fit
                  ${data.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                    data.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {data.status}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-zinc-500">Date</span>
                <div className="flex items-center font-medium">
                  <Calendar className="h-4 w-4 mr-2 text-zinc-400" />
                  {data.date}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-zinc-500">Time</span>
                <div className="flex items-center font-medium">
                  <Clock className="h-4 w-4 mr-2 text-zinc-400" />
                  {data.time}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
