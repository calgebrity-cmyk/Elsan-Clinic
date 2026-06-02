"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { StaffSchema, StaffFormValues } from "@/schemas/staff.schema";
import { useCreateStaff } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function StaffCreatePage() {
  const router = useRouter();
  const createStaff = useCreateStaff();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<StaffFormValues>({
    resolver: zodResolver(StaffSchema),
  });

  const onSubmit = (data: StaffFormValues) => {
    createStaff.mutate(data, {
      onSuccess: () => router.push("/admin/staff"),
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/staff">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Add New Staff Member</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" placeholder="John Doe" {...register("full_name")} />
                {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@elsan.com" {...register("email")} />
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

              <div className="space-y-2">
                <Label>Role</Label>
                <Select onValueChange={(val) => setValue("role", val as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/admin/staff">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={createStaff.isPending}>
                {createStaff.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Staff
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
