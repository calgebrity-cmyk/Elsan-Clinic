"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserRound, Calendar, FileText, BarChart, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Doctors", href: "/admin/doctors", icon: UserRound },
  { name: "Staff", href: "/admin/staff", icon: Users },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
  { name: "Prescriptions", href: "/admin/prescriptions", icon: FileText },
  { name: "Reports", href: "/admin/reports", icon: BarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-zinc-50/40 md:block w-64 lg:w-72">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-lg">
            <span className="text-blue-600 font-bold">Elsan</span> Clinic
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-zinc-100 text-zinc-900 shadow-sm font-medium"
                    : "text-zinc-500 hover:bg-zinc-100/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
