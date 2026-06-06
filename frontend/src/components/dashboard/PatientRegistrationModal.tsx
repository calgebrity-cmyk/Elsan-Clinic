import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useCreatePatient, useDoctors, useUser } from "../../hooks";
import { Loader2 } from "lucide-react";

export function PatientRegistrationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { mutateAsync: createPatient, isPending } = useCreatePatient();
  const { data: doctors = [] } = useDoctors();
  const { data: user } = useUser();

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    phone: '',
    blood_group: '',
    address: '',
    medical_history: '',
    emergency_contact: '',
    allergies: '',
    current_symptoms: '',
    notes: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: ''
  });

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      setFormData(prev => ({
        ...prev,
        appointment_date: dateStr,
        appointment_time: timeStr
      }));
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...formData,
        age: parseInt(formData.age),
        registered_by_id: user?.id,
        registered_by_name: user?.full_name || user?.name || user?.email || 'Receptionist',
      };
      
      if (!payload.appointment_date) delete payload.appointment_date;
      if (!payload.appointment_time) delete payload.appointment_time;
      if (!payload.doctor_id) delete payload.doctor_id;

      await createPatient(payload);
      onClose();
      // Reset form
      setFormData({
        full_name: '', age: '', gender: '', phone: '', blood_group: '',
        address: '', medical_history: '', emergency_contact: '',
        allergies: '', current_symptoms: '', notes: '', doctor_id: '',
        appointment_date: '', appointment_time: ''
      });
    } catch (error) {
      console.error("Failed to register patient", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" name="full_name" required value={formData.full_name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" required value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input id="age" name="age" type="number" required value={formData.age} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select value={formData.gender || undefined} onValueChange={(val) => handleSelectChange('gender', val)} required>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood Group</Label>
              <Input id="blood_group" name="blood_group" value={formData.blood_group} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input id="emergency_contact" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medical_history">Medical History</Label>
              <Input id="medical_history" name="medical_history" value={formData.medical_history} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input id="allergies" name="allergies" value={formData.allergies} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Assign Doctor (Optional)</Label>
              <Select value={formData.doctor_id || undefined} onValueChange={(val) => handleSelectChange('doctor_id', val === 'none' ? '' : val)}>
                <SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not Assigned</SelectItem>
                  {doctors.map((doctor: any) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      Dr. {doctor.full_name} ({doctor.specialization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_date">Appointment Date (Optional)</Label>
              <Input id="appointment_date" name="appointment_date" type="date" value={formData.appointment_date} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointment_time">Appointment Time (Optional)</Label>
              <Input id="appointment_time" name="appointment_time" type="time" value={formData.appointment_time} onChange={handleChange} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
