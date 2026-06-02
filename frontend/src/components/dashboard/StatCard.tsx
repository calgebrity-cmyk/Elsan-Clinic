"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <div className={cn("rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-semibold text-zinc-900">{value}</p>
        <div className="mt-1 flex items-center text-sm">
          {trend && (
            <span
              className={cn(
                "font-medium",
                trend === "up" && "text-green-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-zinc-500"
              )}
            >
              {trendValue}
            </span>
          )}
          {description && (
            <span className="ml-2 text-zinc-500">{description}</span>
          )}
        </div>
      </div>
    </div>
  );
}
