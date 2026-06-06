import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { usePatient, usePatientVisits } from "../../hooks";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export function PatientDetailsModal({ patientId, isOpen, onClose }: { patientId: string | null, isOpen: boolean, onClose: () => void }) {
  const { data: patient, isLoading: patientLoading } = usePatient(patientId || '');
  const { data: visits = [], isLoading: visitsLoading } = usePatientVisits(patientId || '');

  if (!isOpen || !patientId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">Patient Profile</DialogTitle>
        </DialogHeader>
        
        {patientLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>
        ) : patient ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-medium">{patient.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Patient ID</p>
                <p className="font-medium text-blue-600">{patient.patient_code}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Age / Gender</p>
                <p className="font-medium">{patient.age} Yrs, {patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Contact</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Blood Group</p>
                <p className="font-medium">{patient.blood_group || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Assigned Doctor</p>
                <p className="font-medium">{patient.assigned_doctor_name || 'Unassigned'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">Medical History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 border rounded-md">
                  <p className="text-sm font-semibold text-slate-600">Allergies</p>
                  <p className="text-slate-800">{patient.allergies || 'None reported'}</p>
                </div>
                <div className="bg-white p-3 border rounded-md">
                  <p className="text-sm font-semibold text-slate-600">Past History</p>
                  <p className="text-slate-800">{patient.medical_history || 'None reported'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">Visit History</h3>
              {visitsLoading ? (
                <Loader2 className="animate-spin text-slate-400" />
              ) : visits.length === 0 ? (
                <p className="text-slate-500 italic">No previous visits found.</p>
              ) : (
                <div className="space-y-3">
                  {visits.map((visit: any) => (
                    <div key={visit.id} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/4">
                        <p className="font-semibold text-blue-700">{format(new Date(visit.created_at), 'dd MMM yyyy')}</p>
                        <p className="text-sm text-slate-500">Dr. {visit.doctor_name}</p>
                      </div>
                      <div className="md:w-3/4 space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Symptoms</p>
                          <p>{visit.symptoms}</p>
                        </div>
                        {visit.diagnosis && (
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Diagnosis</p>
                            <p>{visit.diagnosis}</p>
                          </div>
                        )}
                        {visit.next_visit_date && (
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Follow-up</p>
                            <p className="text-orange-600 font-medium">{format(new Date(visit.next_visit_date), 'dd MMM yyyy')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (
          <p>Patient not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
