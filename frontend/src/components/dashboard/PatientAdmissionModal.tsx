import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { usePatients, useDoctors, useCreateAdmission } from "../../hooks";
import { Loader2, Search, UserCheck } from "lucide-react";

export function PatientAdmissionModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { data: patients = [] } = usePatients();
  const { data: doctors = [] } = useDoctors();
  const { mutateAsync: createAdmission, isPending } = useCreateAdmission();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    reason_for_admission: '',
    room_bed_number: '',
    admitting_doctor_id: '',
    attender_mobile_number: ''
  });

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return patients.filter((p: any) => 
      p.full_name.toLowerCase().includes(query) || 
      p.phone.includes(query) ||
      p.patient_code?.toLowerCase().includes(query)
    ).slice(0, 5); // show top 5 matches
  }, [searchQuery, patients]);

  const selectedPatient = patients.find((p: any) => p.id === selectedPatientId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;
    
    try {
      const payload: any = {
        patient_id: selectedPatientId,
        reason_for_admission: formData.reason_for_admission,
        room_bed_number: formData.room_bed_number || undefined,
        admitting_doctor_id: formData.admitting_doctor_id || undefined,
        attender_mobile_number: formData.attender_mobile_number || undefined,
      };

      await createAdmission(payload);
      onClose();
      // Reset
      setSearchQuery('');
      setSelectedPatientId('');
      setFormData({ reason_for_admission: '', room_bed_number: '', admitting_doctor_id: '', attender_mobile_number: '' });
    } catch (error) {
      console.error("Failed to admit patient", error);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedPatientId('');
    setFormData({ reason_for_admission: '', room_bed_number: '', admitting_doctor_id: '', attender_mobile_number: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Admit Patient (Inpatient)</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Step 1: Search Patient */}
          {!selectedPatient ? (
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Patient Preview */}
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-blue-900">{selectedPatient.full_name}</h4>
                  </div>
                  <p className="text-sm text-blue-700">Phone: {selectedPatient.phone}</p>
                  <p className="text-sm text-blue-700">Age: {selectedPatient.age} | Gender: {selectedPatient.gender}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelectedPatientId('')}>Change</Button>
              </div>

              {/* Admission Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason_for_admission">Reason for Admission *</Label>
                    <Input 
                      id="reason_for_admission" 
                      name="reason_for_admission" 
                      required 
                      value={formData.reason_for_admission} 
                      onChange={handleChange} 
                      placeholder="e.g. Viral Fever, Surgery Observation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attender_mobile_number">Attender Mobile Number</Label>
                    <Input 
                      id="attender_mobile_number" 
                      name="attender_mobile_number" 
                      value={formData.attender_mobile_number} 
                      onChange={handleChange} 
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room_bed_number">Room / Bed Number</Label>
                    <Input 
                      id="room_bed_number" 
                      name="room_bed_number" 
                      value={formData.room_bed_number} 
                      onChange={handleChange} 
                      placeholder="e.g. Ward A - Bed 12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Admitting Doctor</Label>
                    <Select value={formData.admitting_doctor_id || undefined} onValueChange={(val) => handleSelectChange('admitting_doctor_id', val)}>
                      <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor: any) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            Dr. {doctor.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Admit Patient
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
