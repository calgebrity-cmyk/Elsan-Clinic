import { Users, Calendar, FileText, MessageSquare } from "lucide-react";

import { usePatients } from "../../hooks";

export default function OverviewStats() {
  const { data: patients = [] } = usePatients();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const newPatientsToday = patients.filter((p: any) => new Date(p.created_at) >= today).length;
  const activePatients = patients.filter((p: any) => p.is_active).length;

  const stats = [
    { title: "Total Patients", value: patients.length.toString(), icon: Users, trend: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "New Patients Today", value: newPatientsToday.toString(), icon: Users, trend: "Daily", color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Today's Appointments", value: "0", icon: Calendar, trend: "Same", color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Active Patients", value: activePatients.toString(), icon: Users, trend: "Stable", color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
            <p className="text-xs font-medium text-slate-500 mt-1">
              <span className="text-emerald-600">{stat.trend}</span> from last month
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
