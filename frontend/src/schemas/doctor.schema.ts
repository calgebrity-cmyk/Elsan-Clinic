import * as z from "zod";

export const DoctorSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number format"),
  specialization: z.string().min(2, "Specialization is required"),
  qualification: z.string().min(2, "Qualification is required"),
  experience_years: z.coerce.number().min(0, "Experience must be 0 or more"),
  consultation_fee: z.coerce.number().min(0, "Consultation fee must be 0 or more"),
  consultation_timings: z.string().min(1, "Timings are required (e.g. 10:00 AM - 02:00 PM)"),
});

export type DoctorFormValues = z.infer<typeof DoctorSchema>;
