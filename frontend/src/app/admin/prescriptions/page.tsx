"use client";

import { usePrescriptionHistory, useRegeneratePdf } from "@/hooks/usePrescriptions";
import { PrescriptionService } from "@/services/prescription.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, RefreshCw, Search, Calendar, User, UserCircle } from "lucide-react";
import { useState } from "react";

export default function PrescriptionsDashboardPage() {
  const { data: prescriptions, isLoading } = usePrescriptionHistory();
  const regenerateMutation = useRegeneratePdf();
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (id: string, filename: string) => {
    try {
      setDownloadingId(id);
      const blob = await PrescriptionService.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredPrescriptions = prescriptions?.filter((p) => 
    p.patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Prescriptions</h1>
          <p className="text-zinc-500">View and manage patient prescriptions and PDFs.</p>
        </div>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input 
            type="search" 
            placeholder="Search by patient or doctor..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                  Loading prescriptions...
                </TableCell>
              </TableRow>
            ) : filteredPrescriptions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-zinc-300" />
                  No prescriptions found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredPrescriptions?.map((prescription) => (
                <TableRow key={prescription.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      {new Date(prescription.prescription_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-zinc-900">
                      <User className="h-4 w-4 text-zinc-400" />
                      {prescription.patient.full_name}
                    </div>
                    <div className="text-xs text-zinc-500 ml-6">{prescription.patient.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-zinc-700">
                      <UserCircle className="h-4 w-4 text-zinc-400" />
                      {prescription.doctor.full_name}
                    </div>
                    <div className="text-xs text-zinc-500 ml-6">{prescription.doctor.specialization}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      prescription.status === 'ISSUED' ? 'bg-green-100 text-green-800' : 
                      prescription.status === 'REVOKED' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {prescription.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                      {prescription.download_count} times
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(prescription.id, `Prescription_${prescription.patient.full_name.replace(' ', '_')}.pdf`)}
                        disabled={downloadingId === prescription.id || !prescription.pdf_url}
                        title="Download PDF"
                      >
                        {downloadingId === prescription.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span className="sr-only">Download PDF</span>
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => regenerateMutation.mutate(prescription.id)}
                        disabled={regenerateMutation.isPending && regenerateMutation.variables === prescription.id}
                        title="Regenerate PDF"
                      >
                        <RefreshCw className={`h-4 w-4 ${regenerateMutation.isPending && regenerateMutation.variables === prescription.id ? 'animate-spin' : ''}`} />
                        <span className="sr-only">Regenerate</span>
                      </Button>
                    </div>
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
