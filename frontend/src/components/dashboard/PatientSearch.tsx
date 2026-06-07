import React, { useState } from 'react';
import { Plus, Search, Loader2, Eye, CalendarPlus } from "lucide-react";
import { usePatients, useSearchPatients, useUser } from "../../hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { PatientRegistrationModal, PatientDetailsModal, VisitCreationModal } from './';

export default function PatientSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Conditionally use search or get all
  const { data: allPatients = [], isLoading: isLoadingAll } = usePatients();
  const { data: searchResults = [], isLoading: isSearching } = useSearchPatients(searchQuery);
  const { data: user } = useUser();

  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const displayPatients = searchQuery.length >= 2 ? searchResults : allPatients;
  const isLoading = searchQuery.length >= 2 ? isSearching : isLoadingAll;

  // Pagination logic
  const totalPages = Math.ceil(displayPatients.length / itemsPerPage);
  const paginatedPatients = displayPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Reset to page 1 when searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDownloadCSV = () => {
    if (displayPatients.length === 0) return;

    // Define CSV headers
    const headers = ['Patient ID', 'Name', 'Contact', 'Gender', 'Age', 'Blood Group', 'Registered By', 'Created At'];
    
    // Convert data to CSV rows
    const csvRows = displayPatients.map((p: any) => [
      p.patient_code || '',
      p.full_name || '',
      p.phone || '',
      p.gender || '',
      p.age || '',
      p.blood_group || '',
      p.registered_by_name || 'Receptionist',
      p.created_at ? new Date(p.created_at).toLocaleString() : ''
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewPatient = (id: string) => {
    setSelectedPatientId(id);
    setIsDetailsModalOpen(true);
  };

  const handleCreateVisit = (id: string) => {
    setSelectedPatientId(id);
    setIsVisitModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Patient Database</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-200" onClick={handleDownloadCSV} disabled={displayPatients.length === 0}>
            Download CSV
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsRegModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Register Patient
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input 
          placeholder="Search by name, phone or ID..." 
          className="pl-10 h-11 bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">
            <Loader2 className="animate-spin inline mr-2"/>Loading Patients...
          </div>
        ) : displayPatients.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No patients found.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Registered By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-blue-600">{p.patient_code}</TableCell>
                    <TableCell className="font-medium text-slate-800">{p.full_name}</TableCell>
                    <TableCell className="text-slate-600">{p.phone}</TableCell>
                    <TableCell className="text-slate-600">{p.gender}</TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {p.registered_by_name || 'Receptionist'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewPatient(p.id)} title="View Profile">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        {user?.role !== 'DOCTOR' && (
                          <Button variant="outline" size="sm" onClick={() => handleCreateVisit(p.id)} title="Create Visit">
                            <CalendarPlus className="h-4 w-4 text-emerald-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 bg-slate-50/50">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, displayPatients.length)}</span> of <span className="font-medium">{displayPatients.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        className={currentPage === i + 1 ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <PatientRegistrationModal 
        isOpen={isRegModalOpen} 
        onClose={() => setIsRegModalOpen(false)} 
      />
      
      <PatientDetailsModal 
        patientId={selectedPatientId} 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
      />
      
      <VisitCreationModal 
        patientId={selectedPatientId} 
        isOpen={isVisitModalOpen} 
        onClose={() => setIsVisitModalOpen(false)} 
      />
    </div>
  );
}
