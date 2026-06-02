import * as z from 'zod';

export const VisitSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  visitDate: z.string().min(1, "Visit date is required"),
  symptoms: z.string().min(3, "Symptoms description is too short"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  doctorNotes: z.string().optional(),
  nextVisitDate: z.string().optional(),
  reminderNotes: z.string().optional(),
});

export type VisitFormValues = z.infer<typeof VisitSchema>;
