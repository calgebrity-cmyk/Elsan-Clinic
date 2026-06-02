"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Calendar as CalendarIcon, CheckCircle, Clock, XCircle, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/hooks/useAppointments";

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // In a real scenario, this hook fetches real data from our API:
  // const { data: appointments, isLoading } = useAppointments();
  
  // For the purpose of the UI demonstration, we'll map mock data if undefined
  const MOCK_APPOINTMENTS = [
    { id: "A-1001", patientName: "Rahul Sharma", phone: "+91 9876543210", doctor: "Dr. Sarah Smith", date: "2023-11-20", time: "10:30 AM", status: "SCHEDULED" },
    { id: "A-1002", patientName: "Priya Patel", phone: "+91 9876543211", doctor: "Dr. John Doe", date: "2023-11-20", time: "11:00 AM", status: "COMPLETED" },
    { id: "A-1003", patientName: "Amit Kumar", phone: "+91 9876543212", doctor: "Dr. Sarah Smith", date: "2023-11-20", time: "02:00 PM", status: "CANCELLED" },
  ];

  const filteredAppointments = MOCK_APPOINTMENTS.filter(app => 
    app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.phone.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Appointments</h1>
          <p className="text-sm text-zinc-500">Manage patient appointments and schedules.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Today</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-zinc-500">Appointments scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-zinc-500">Waiting to be seen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-zinc-500">Successfully consulted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-zinc-500">Cancelled today</p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full bg-white rounded-md border">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-white"
            />
          </div>
          {/* Filters can go here */}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Appt ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-zinc-900">{app.patientName}</p>
                      <p className="text-xs text-zinc-500">{app.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{app.doctor}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-zinc-900">{app.date}</p>
                      <p className="text-xs text-zinc-500">{app.time}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${app.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        app.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Link href={`/admin/appointments/${app.id}`}>
                      <Button variant="outline" size="sm" className="h-8">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
