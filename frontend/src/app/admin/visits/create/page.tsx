"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisitSchema, VisitFormValues } from "@/schemas/visit.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Activity, CalendarDays, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateVisitPage() {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<VisitFormValues>({
    resolver: zodResolver(VisitSchema),
    defaultValues: {
      patientId: "P-5541",
      doctorId: "D-102",
      visitDate: new Date().toISOString().split('T')[0],
      symptoms: "",
      diagnosis: "",
      doctorNotes: "",
      nextVisitDate: "",
      reminderNotes: ""
    }
  });

  const onSubmit = (data: VisitFormValues) => {
    console.log("Visit Data Submitted: ", data);
    // Submit via useCreateVisit hook...
    router.push('/admin/visits');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Log New Visit</h1>
        <p className="text-sm text-zinc-500">Record consultation details, diagnosis, and follow-ups.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Readonly Patient Info */}
        <Card className="bg-zinc-50 border-zinc-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-zinc-700">
              <User className="h-4 w-4 mr-2" /> Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-zinc-500">Name</p>
                <p className="font-medium text-zinc-900">Rahul Sharma</p>
              </div>
              <div>
                <p className="text-zinc-500">Patient ID</p>
                <p className="font-medium text-zinc-900">P-5541</p>
              </div>
              <div>
                <p className="text-zinc-500">Age / Gender</p>
                <p className="font-medium text-zinc-900">32 / Male</p>
              </div>
              <div>
                <p className="text-zinc-500">Phone</p>
                <p className="font-medium text-zinc-900">+91 9876543210</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visit Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-zinc-900">
              <Activity className="h-5 w-5 mr-2 text-blue-600" /> Clinical Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="symptoms">Symptoms (Presented by Patient) <span className="text-red-500">*</span></Label>
              <textarea 
                id="symptoms"
                {...register("symptoms")}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Mild fever, dry cough for 3 days..."
              />
              {errors.symptoms && <p className="text-xs text-red-500">{errors.symptoms.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="diagnosis">Diagnosis <span className="text-red-500">*</span></Label>
              <Input 
                id="diagnosis" 
                {...register("diagnosis")}
                placeholder="e.g. Upper Respiratory Tract Infection" 
              />
              {errors.diagnosis && <p className="text-xs text-red-500">{errors.diagnosis.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="doctorNotes">Internal Notes (Optional)</Label>
              <textarea 
                id="doctorNotes"
                {...register("doctorNotes")}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Doctor's private observations..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Follow Up */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-zinc-900">
              <CalendarDays className="h-5 w-5 mr-2 text-amber-600" /> Follow-Up Plan
            </CardTitle>
            <CardDescription>Schedule the next visit and set automated reminder notes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="nextVisitDate">Next Visit Date</Label>
                <Input 
                  id="nextVisitDate" 
                  type="date"
                  {...register("nextVisitDate")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reminderNotes">Reminder Message</Label>
                <Input 
                  id="reminderNotes" 
                  {...register("reminderNotes")}
                  placeholder="e.g. Fasting required for next blood test." 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6 border-t pt-6">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="outline" className="bg-white">
            Save Visit
          </Button>
          <Button type="button" className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" /> Save & Generate Prescription
          </Button>
        </div>
      </form>
    </div>
  );
}
