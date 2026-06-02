"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Calendar as CalendarIcon, Eye } from "lucide-react";
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

export default function VisitsHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for UI demonstration
  const MOCK_VISITS = [
    { id: "V-2001", patientName: "Rahul Sharma", doctor: "Dr. Sarah Smith", visitDate: "2023-11-20", diagnosis: "Viral Fever", nextVisitDate: "2023-11-25" },
    { id: "V-2002", patientName: "Priya Patel", doctor: "Dr. John Doe", visitDate: "2023-11-19", diagnosis: "Eczema", nextVisitDate: "2023-12-19" },
  ];

  const filteredVisits = MOCK_VISITS.filter(v => 
    v.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Visit History</h1>
          <p className="text-sm text-zinc-500">View and manage past patient consultations.</p>
        </div>
      </div>

      <div className="w-full bg-white rounded-md border">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by patient or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-white"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visit ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Next Visit Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-zinc-500">
                  No visits found.
                </TableCell>
              </TableRow>
            ) : (
              filteredVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="font-medium text-blue-600">{visit.id}</TableCell>
                  <TableCell className="font-medium">{visit.patientName}</TableCell>
                  <TableCell>{visit.doctor}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-zinc-600">
                      <CalendarIcon className="h-3 w-3 mr-2" />
                      {visit.visitDate}
                    </div>
                  </TableCell>
                  <TableCell>{visit.diagnosis}</TableCell>
                  <TableCell>
                    <span className="text-zinc-500">{visit.nextVisitDate || "N/A"}</span>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      <Eye className="w-4 h-4 mr-1" /> Details
                    </Button>
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
