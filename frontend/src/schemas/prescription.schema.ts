export interface PrescriptionHistoryResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  doctor_id: string;
  prescription_date: string;
  notes: string | null;
  next_visit_date: string | null;
  pdf_url: string | null;
  qr_code_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  
  // Relations mapped by the backend
  patient: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
  doctor: {
    id: string;
    full_name: string;
    specialization: string;
  };
  audit_logs: Array<{
    id: string;
    action: string;
    created_at: string;
  }>;
  download_count: number;
}
