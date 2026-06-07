import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { appointmentApi } from "../../services/api";
import { useRouter } from "next/navigation";

export default function DoctorDashboard({ user }: { user: any }) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];
  
  const todayAppts = appointments.filter(a => a.appointment_date === todayStr && a.status !== 'COMPLETED');
  const upcomingAppts = appointments.filter(a => a.appointment_date > todayStr && a.status !== 'COMPLETED');

  const format12Hour = (timeStr: string) => {
    if (!timeStr) return 'N/A';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  const renderApptList = (list: any[], emptyMsg: string) => (
    <div className="space-y-4">
      {loadingAppts ? (
        <div className="text-center text-slate-500 py-4"><Loader2 className="animate-spin inline mr-2"/> Loading Schedule...</div>
      ) : list.length === 0 ? (
        <div className="text-center text-slate-500 py-4">{emptyMsg}</div>
      ) : list.map((apt, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-md text-sm">
              {apt.appointment_date === todayStr ? '' : `${apt.appointment_date} `}
              {format12Hour(apt.appointment_time)}
            </div>
            <div>
              <p className="font-medium text-slate-800">{apt.patient?.full_name || 'Unknown Patient'}</p>
              <p className="text-xs text-slate-500">{apt.notes || 'Consultation'}</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            apt.status === 'WAITING' || apt.status === 'CHECKED_IN' ? 'bg-orange-100 text-orange-700' : 
            apt.status === 'NEXT' ? 'bg-green-100 text-green-700' : 
            apt.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : 'bg-slate-100 text-slate-600'
          }`}>
            {apt.status || 'Scheduled'}
          </span>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (['SUPER_ADMIN', 'DOCTOR'].includes(user?.role)) {
      appointmentApi.getAppointments().then(data => {
        setAppointments(data);
        setLoadingAppts(false);
      }).catch(() => setLoadingAppts(false));
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">Today's Schedule <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full ml-2">{todayAppts.length}</span></h3>
          {renderApptList(todayAppts, "No appointments scheduled for today.")}

          <h3 className="font-semibold text-slate-800 mb-4 mt-8">Upcoming Appointments <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full ml-2">{upcomingAppts.length}</span></h3>
          {renderApptList(upcomingAppts, "No upcoming appointments.")}
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => router.push('/admin/prescriptions')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">+</div>
                <span className="text-xs font-medium text-center">New Prescription</span>
              </button>
              <button onClick={() => router.push('/admin/patients')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">👤</div>
                <span className="text-xs font-medium text-center">Patient History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
