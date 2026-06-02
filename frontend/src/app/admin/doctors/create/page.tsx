"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { DoctorSchema, DoctorFormValues } from "@/schemas/doctor.schema";
import { useCreateDoctor } from "@/hooks/useDoctors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DoctorCreatePage() {
  const router = useRouter();
  const createDoctor = useCreateDoctor();

  const { register, handleSubmit, formState: { errors } } = useForm<DoctorFormValues>({
    resolver: zodResolver(DoctorSchema),
  });

  const onSubmit = (data: DoctorFormValues) => {
    createDoctor.mutate(data, {
      onSuccess: () => router.push("/admin/doctors"),
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/doctors">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Add New Doctor</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Profile & Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Account Info */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-900 border-b pb-2">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" placeholder="Dr. John Doe" {...register("full_name")} />
                  {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="doctor@elsan.com" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="******" {...register("password")} />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 9876543210" {...register("phone")} />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Clinical Info */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-900 border-b pb-2">Clinical Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input id="specialization" placeholder="Cardiologist" {...register("specialization")} />
                  {errors.specialization && <p className="text-sm text-red-500">{errors.specialization.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input id="qualification" placeholder="MBBS, MD" {...register("qualification")} />
                  {errors.qualification && <p className="text-sm text-red-500">{errors.qualification.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <Input id="experience_years" type="number" placeholder="10" {...register("experience_years")} />
                  {errors.experience_years && <p className="text-sm text-red-500">{errors.experience_years.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation_fee">Consultation Fee (₹)</Label>
                  <Input id="consultation_fee" type="number" placeholder="500" {...register("consultation_fee")} />
                  {errors.consultation_fee && <p className="text-sm text-red-500">{errors.consultation_fee.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="consultation_timings">Consultation Timings</Label>
                  <Input id="consultation_timings" placeholder="10:00 AM - 02:00 PM" {...register("consultation_timings")} />
                  {errors.consultation_timings && <p className="text-sm text-red-500">{errors.consultation_timings.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/admin/doctors">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={createDoctor.isPending} className="bg-blue-600 hover:bg-blue-700">
                {createDoctor.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Doctor Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
