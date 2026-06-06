"use client";

import { Users, UserRound, Calendar, FileText, Video, LayoutDashboard, Settings, LogOut, Loader2, BedDouble } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "../../lib/utils";
import { useUser, useLogout } from "../../hooks";

const getMenuItems = (role: string) => {
  const items = [];
  
  items.push({ name: "Overview", href: "/admin", icon: LayoutDashboard });
  
  if (['SUPER_ADMIN', 'RECEPTIONIST', 'NURSE'].includes(role)) {
    items.push({ name: "Appointments", href: "/admin/appointments", icon: Calendar });
    items.push({ name: "Patients", href: "/admin/patients", icon: Users });
    items.push({ name: "Inpatients", href: "/admin/inpatients", icon: BedDouble });
  }
  
  if (['SUPER_ADMIN', 'DIRECTOR'].includes(role)) {
    items.push({ name: "Doctors", href: "/admin/doctors", icon: UserRound });
    items.push({ name: "Staff", href: "/admin/staff", icon: Users });
  }
  
  if (['SUPER_ADMIN', 'DOCTOR'].includes(role)) {
    items.push({ name: "My Appointments", href: "/admin/appointments", icon: Calendar });
    items.push({ name: "Prescriptions", href: "/admin/prescriptions", icon: FileText });
    items.push({ name: "Telemedicine", href: "/admin/telemedicine", icon: Video });
  }

  if (['SUPER_ADMIN'].includes(role)) {
    items.push({ name: "Settings", href: "/admin/settings", icon: Settings });
  }

  return items.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
};

export default function Sidebar() {
  const location = usePathname();
  const { data: user, isLoading } = useUser();
  const logout = useLogout();

  return (
    <div className="hidden border-r bg-white md:block w-64 lg:w-72 shadow-sm relative">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6 justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <span className="text-blue-600">Elsan</span> Clinic
          </Link>
        </div>
        <div className="px-6 py-2 border-b border-slate-50 bg-slate-50">
          {isLoading ? <Loader2 className="animate-spin w-4 h-4 text-blue-600"/> : (
            <>
              <p className="text-sm font-bold text-slate-800 truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-500 font-medium">{user?.role}</p>
            </>
          )}
        </div>
        <div className="flex-1 py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {!isLoading && getMenuItems(user?.role || '').map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                  location === item.href
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
