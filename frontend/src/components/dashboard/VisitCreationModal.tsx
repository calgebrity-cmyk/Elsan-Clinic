import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useCreateVisit, useDoctors, usePatients } from "../../hooks";
import { Loader2, Search, UserCheck } from "lucide-react";

export function VisitCreationModal({ patientId, isOpen, onClose }: { patientId?: string | null, isOpen: boolean, onClose: () => void }) {
  const { mutateAsync: createVisit, isPending } = useCreateVisit();
  const { data: doctors = [] } = useDoctors();
  const { data: patients = [] } = usePatients();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    doctor_notes: '',
    doctor_id: '',
  });

  const effectivePatientId = patientId || selectedPatientId;

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return patients.filter((p: any) => 
      p.full_name.toLowerCase().includes(query) || 
      p.phone.includes(query) ||
      p.patient_code?.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery, patients]);

  const selectedPatient = patients.find((p: any) => p.id === effectivePatientId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectivePatientId) return;

    try {
      await createVisit({
        ...formData,
        patient_id: effectivePatientId,
      });
      handleClose();
    } catch (error) {
      console.error("Failed to create visit", error);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedPatientId('');
    setFormData({ symptoms: '', diagnosis: '', doctor_notes: '', doctor_id: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Visit</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!effectivePatientId ? (
            <div className="space-y-4">
              <Label>Search Registered Patient (by Name, Phone, or Code)</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input 
                  placeholder="e.g. 9876543210 or John Doe" 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              
              {searchQuery && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mt-2">
                  {filteredPatients.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm">No patients found.</div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {filteredPatients.map((p: any) => (
                        <li 
                          key={p.id} 
                          className="p-3 hover:bg-slate-100 cursor-pointer flex justify-between items-center transition-colors"
                          onClick={() => setSelectedPatientId(p.id)}
                        >
                          <div>
                            <p className="font-semibold text-slate-800">{p.full_name}</p>
                            <p className="text-xs text-slate-500">{p.phone} | {p.patient_code}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="text-blue-600">Select</Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!patientId && selectedPatient && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-blue-900">{selectedPatient.full_name}</h4>
                    </div>
                    <p className="text-sm text-blue-700">Phone: {selectedPatient.phone}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSelectedPatientId('')}>Change</Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms *</Label>
                <Input id="symptoms" name="symptoms" required value={formData.symptoms} onChange={handleChange} />
              </div>
              
              <div className="space-y-2">
                <Label>Assign Doctor *</Label>
                <Select value={formData.doctor_id || undefined} onValueChange={(val) => handleSelectChange('doctor_id', val)} required>
                  <SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor: any) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        Dr. {doctor.full_name} ({doctor.specialization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Preliminary Diagnosis</Label>
                <Input id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor_notes">Notes for Doctor</Label>
                <Input id="doctor_notes" name="doctor_notes" value={formData.doctor_notes} onChange={handleChange} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Visit
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
