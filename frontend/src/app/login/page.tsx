"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { LoginSchema, LoginFormValues } from "@/schemas/auth.schema";
import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, HeartPulse } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      await AuthService.login(data);
      router.push("/admin/dashboard");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d: any) => d.msg).join(", "));
      } else {
        setError(detail || "Failed to login. Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full text-white mb-4 shadow-lg shadow-blue-200">
            <HeartPulse className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Elsan Clinic</h1>
          <p className="text-zinc-500 mt-2">Management System Portal</p>
        </div>

        <Card className="border-0 shadow-xl shadow-zinc-200/50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your email and password to sign in</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Email Address</Label>
                <Input 
                  id="username" 
                  type="email" 
                  placeholder="name@elsan.com" 
                  {...register("username")} 
                  className={errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.username && <p className="text-sm text-red-500 font-medium">{errors.username.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  {...register("password")} 
                  className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
