export type ViewState = 'home' | 'about' | 'services' | 'doctors' | 'health-library' | 'contact' | 'prohealth' | 'nri' | 'book' | 'doctor-portal' | 'admin-portal' | 'ai-tools';

export interface Doctor {
  id: string;
  name: string;
  role: string;
  qualifications: string[];
  fellowships: string[];
  phone: string;
  consultationType: string;
  specialties: string[];
}

export interface Service {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface ProHealthPackage {
  id: string;
  title: string;
  price: string;
  features: string[];
}

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

export interface AdminUser {
  username: string;
  pass: string;
  roleTitle: string;
  accessLevel: 'super_admin' | 'director' | 'reception' | 'nurse' | 'pharmacy' | 'doctor' | 'analyst';
}
