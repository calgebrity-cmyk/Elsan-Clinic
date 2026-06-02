import * as z from "zod";

export const StaffSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number format"),
  role: z.enum(["SUPER_ADMIN", "RECEPTIONIST"], {
    required_error: "Please select a role",
  }),
});

export type StaffFormValues = z.infer<typeof StaffSchema>;
