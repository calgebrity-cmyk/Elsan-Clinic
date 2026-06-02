import * as z from 'zod';

export const AppointmentSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Valid phone number is required (e.g., +919876543210)"),
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time slot"),
  notes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof AppointmentSchema>;
