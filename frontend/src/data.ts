import { AdminUser, Doctor, Patient, ProHealthPackage, Service } from './types';

export const CLINIC_INFO = {
  name: "Elsan Clinic",
  tagline: "Expert Care for Every Family",
  established: "20+ Years Ago",
  founder: "Mrs. E. Shanthi",
  address: "56/1 & 56/2, Perumal Koil Street, Saidapet (West), Chennai – 600 015",
  phone: "9444184977",
  whatsapp: "https://wa.me/919444184977"
};

export const DOCTORS: Doctor[] = [
  {
    id: "dr_elan",
    name: "DR. N. ELANGESWARAN",
    role: "CEO & Medical Director · 20+ Years Experience",
    qualifications: ["MBBS, MD Internal Medicine"],
    fellowships: ["Fellowship – Practical Cardiology (IMA)", "PG Diploma – Infectious Diseases", "Fellowship in Diabetology – Joslin, USA (Harvard)"],
    phone: "9444184977",
    consultationType: "In-Clinic",
    specialties: ["General Health Care", "Diabetes", "Hypertension", "Skin Disease", "Asthma", "Acute Illness", "Geriatric Care", "Lifestyle Counselling", "Speciality Referrals"]
  },
  {
    id: "dr_meena",
    name: "DR. E. PANDIYA MEENA",
    role: "Consultant – Internal Medicine (Online) · Associate Professor",
    qualifications: ["MBBS, MD, Cardiology Fellow"],
    fellowships: ["Fellowship – Practical Cardiology (IMA)", "PG Programme – Johns Hopkins University, USA"],
    phone: "7824051677",
    consultationType: "Online Consultation Only",
    specialties: ["Cardiac Care", "Infectious Disease", "Geriatric Care", "Evidence-Based Medicine", "Endocrinology", "Telemedicine", "AI in Healthcare", "Emergency Care"]
  },
  {
    id: "dr_ramya",
    name: "DR. E. RAMYASHREE",
    role: "Consultant Physician – Internal Medicine (Online)",
    qualifications: ["MBBS, MD General Medicine (SRM 2025), MBA"],
    fellowships: ["BLS & ACLS – American Board of Cardiology", "Fellowship – Practical Cardiology (IMA)"],
    phone: "9962663033",
    consultationType: "Online Consultation Only",
    specialties: ["Cardiac Care", "Infectious Disease", "Geriatric Care", "Evidence-Based Medicine", "Telemedicine", "AI in Healthcare"]
  },
  {
    id: "dr_sambath",
    name: "DR. R. SAMBATH KUMAR",
    role: "Chief Consultant Paediatrician · DNB Gold Medalist",
    qualifications: ["MBBS Gold Medalist (Russia)", "MD Paediatrics (Dist.)", "DNB Paediatrics – Sundaram Medical Foundation"],
    fellowships: ["PGPN – Boston University School of Medicine", "IPPN – Australia", "ICAN RCPCH – London"],
    phone: "8220246025",
    consultationType: "In-Clinic",
    specialties: ["Vaccinations", "Newborn Care", "Nutrition", "Growth Monitoring", "Behavioural Health", "General Paediatrics", "Seasonal Health"]
  }
];

export const SERVICES: Service[] = [
  { id: "1", iconName: "HeartPulse", title: "Internal Medicine", description: "Adult complex diseases: heart, lung, kidney, digestive system" },
  { id: "2", iconName: "Users", title: "Family Medicine", description: "Primary care for all ages – infants to elderly, lifelong health relationships" },
  { id: "3", iconName: "Activity", title: "Diabetes Management", description: "HbA1c tracking, diet counselling, complication screening, Joslin-trained docs" },
  { id: "4", iconName: "Stethoscope", title: "Hypertension Care", description: "BP monitoring, lifestyle plans, cardiovascular risk reduction" },
  { id: "5", iconName: "ClipboardList", title: "Chronic Disease Mgmt", description: "Structured follow-up with personalised targets, regular investigations" },
  { id: "6", iconName: "Pill", title: "In-Clinic Pharmacy", description: "Medicines immediately after consultation – no extra trips needed" },
  { id: "7", iconName: "Baby", title: "Paediatric Medicine", description: "Neonates to adolescents, DNB certified, neonatal ICU trained" },
  { id: "8", iconName: "PersonStanding", title: "Geriatric Medicine", description: "Senior citizen care, multi-drug therapy, age-related condition management" },
  { id: "9", iconName: "Ambulance", title: "Emergency Care", description: "ACLS & BLS certified physicians, prompt urgent care" },
  { id: "10", iconName: "Microscope", title: "Infectious Diseases", description: "Fever workups, tropical diseases, PG Diploma level expertise" },
  { id: "11", iconName: "Syringe", title: "Immunisation Clinic", description: "Complete vaccination schedules – children & adults, well-documented records" },
  { id: "12", iconName: "BedDouble", title: "Critical Care Support", description: "Mechanical ventilation, ICU management, pleural & CSF tapping procedures" }
];

export const PROHEALTH_PACKAGES: ProHealthPackage[] = [
  { id: "basic", title: "Basic Package", price: "₹499", features: ["BP & Blood Sugar Check", "BMI & Obesity Screening", "Dietary Counselling (15 min)", "Doctor Consultation Summary"] },
  { id: "std", title: "Standard Package", price: "₹1,499", features: ["Full Blood Count (CBC)", "Fasting Blood Sugar + HbA1c", "Lipid Profile (Cholesterol)", "Kidney & Liver Function Tests", "Urine Routine Examination", "BP + ECG Screening", "Doctor Consultation (30 min)"] },
  { id: "comp", title: "Comprehensive Package", price: "₹2,999", features: ["All Standard Package tests", "Thyroid Profile (T3, T4, TSH)", "Vitamin B12 & D3 Levels", "X-Ray Chest (if needed)", "Diabetes Complication Screening", "Cardiac Risk Scoring", "Dietitian Consultation", "Follow-up Appointment (Free)"] },
  { id: "child", title: "Child Health Package", price: "₹999", features: ["Growth & Development Assessment", "Vaccination Status Review", "Nutritional Counselling", "Vision & Hearing Screening", "Behavioural Health Q&A"] },
  { id: "senior", title: "Senior Citizen Plan", price: "₹1,999", features: ["Comprehensive Blood Panel", "Bone Density Risk Screening", "Cognitive Health Assessment", "Polypharmacy Medicine Review", "Fall Risk Assessment", "Geriatric Doctor Consultation (45 min)"] }
];

export const MOCK_PATIENTS: Patient[] = [
  { id: "PAT001", pass: "elsan123", name: "Ravi Kumar", age: 45, condition: "Diabetes Type 2", nextAppt: "12 Jun 2026, 10:00 AM", lastRx: "Metformin 500mg BD", lastVisit: "12 May 2026" },
  { id: "PAT002", pass: "elsan456", name: "Priya Sharma", age: 32, condition: "Hypertension", nextAppt: "Not scheduled", lastRx: "Telmisartan 40mg OD", lastVisit: "28 Apr 2026" },
  { id: "PAT003", pass: "elsan789", name: "Baby Arjun", age: 2, condition: "Paediatric check-up", nextAppt: "05 Jul 2026, 05:00 PM", lastRx: "Multivitamin drops", lastVisit: "05 Jan 2026" },
  { id: "PAT004", pass: "elsan321", name: "Meena Devi", age: 58, condition: "Geriatric / Arthritis", nextAppt: "20 Jun 2026, 09:30 AM", lastRx: "Calcium Supplements", lastVisit: "15 Apr 2026" },
  { id: "PAT005", pass: "elsan654", name: "Karthik R.", age: 28, condition: "Dengue Recovery", nextAppt: "02 Jun 2026, 06:15 PM", lastRx: "Paracetamol 650mg SOS", lastVisit: "01 Jun 2026" },
  { id: "PAT006", pass: "elsan987", name: "Lakshmi S.", age: 40, condition: "PCOS / Thyroid", nextAppt: "15 Jun 2026, 04:00 PM", lastRx: "Levothyroxine 50mcg", lastVisit: "10 May 2026" },
  { id: "PAT007", pass: "elsan147", name: "Mr. Anand V.", age: 62, condition: "Cardiac Care (Post-MI)", nextAppt: "22 Jun 2026, 11:00 AM", lastRx: "Aspirin + Statin", lastVisit: "01 May 2026" }
];

export const ADMIN_USERS: AdminUser[] = [
  { username: "elsan_admin", pass: "Admin@Elsan2026", roleTitle: "Super Admin", accessLevel: "super_admin" },
  { username: "elsan_ceo", pass: "CEO@Elan#99", roleTitle: "Director", accessLevel: "director" },
  { username: "reception", pass: "Recep@Elsan123", roleTitle: "Receptionist", accessLevel: "reception" },
  { username: "nurse_head", pass: "Nurse@Elsan01", roleTitle: "Head Nurse", accessLevel: "nurse" },
  { username: "pharmacy_mgr", pass: "Pharma@Elsan01", roleTitle: "Pharmacy Manager", accessLevel: "pharmacy" },
  { username: "doctor_elan", pass: "Dr.Elan@01", roleTitle: "Dr. N. Elangeswaran", accessLevel: "doctor" },
  { username: "doctor_meena", pass: "Dr.Meena@02", roleTitle: "Dr. E. Pandiya Meena", accessLevel: "doctor" },
  { username: "doctor_ramya", pass: "Dr.Ramya@03", roleTitle: "Dr. E. Ramyashree", accessLevel: "doctor" },
  { username: "doctor_sambath", pass: "Dr.Sambath@04", roleTitle: "Dr. R. Sambath Kumar", accessLevel: "doctor" },
  { username: "data_analyst", pass: "Data@Elsan2026", roleTitle: "Clinic Analytics", accessLevel: "analyst" }
];
