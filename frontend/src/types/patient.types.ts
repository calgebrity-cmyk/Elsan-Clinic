export interface Patient {
  id: string;
  pass: string;
  name: string;
  age: number;
  condition: string;
  nextAppt: string;
  lastRx: string;
  lastVisit: string;
}

export interface PatientApiResponse {
  id: string;
  patient_code: string;
  full_name: string;
  phone: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  address?: string;
  medical_history?: string;
  email?: string;
  emergency_contact?: string;
  allergies?: string;
  current_symptoms?: string;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  assigned_doctor_id?: string;
  assigned_doctor_name?: string;
}
