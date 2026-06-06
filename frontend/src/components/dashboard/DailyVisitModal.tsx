import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useDoctors, useAddDailyVisit } from "../../hooks";
import { Loader2 } from "lucide-react";

export function DailyVisitModal({ 
  isOpen, 
  onClose, 
  admissionId, 
  patientName 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  admissionId: string,
  patientName: string
}) {
  const { data: doctors = [] } = useDoctors();
  const { mutateAsync: addDailyVisit, isPending } = useAddDailyVisit();

  const [formData, setFormData] = useState({
    doctor_id: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionId) return;
    
    try {
      await addDailyVisit({
        admissionId,
        data: {
          doctor_id: formData.doctor_id || undefined,
          notes: formData.notes
        }
      });
      onClose();
      setFormData({ doctor_id: '', notes: '' });
    } catch (error) {
      console.error("Failed to add daily visit", error);
    }
  };

  const handleClose = () => {
    setFormData({ doctor_id: '', notes: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Daily Doctor Check</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
            Patient: <span className="font-semibold text-slate-800">{patientName}</span>
          </div>

          <div className="space-y-2">
            <Label>Which Doctor Checked? *</Label>
            <Select value={formData.doctor_id || undefined} onValueChange={(val) => handleSelectChange('doctor_id', val)} required>
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

          <div className="space-y-2">
            <Label htmlFor="notes">Clinical Notes / Updates *</Label>
            <Input 
              id="notes" 
              name="notes" 
              required 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="e.g. Patient is stable. Temperature normal."
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
