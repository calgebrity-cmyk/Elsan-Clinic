import { useEffect, useState } from "react";
import { Loader2, ChevronLeft, ChevronRight, Clock, CalendarCheck, FileCheck } from "lucide-react";
import { appointmentApi } from "../../services/api";

type TabType = 'today' | 'upcoming' | 'completed';

export default function DoctorAppointments({ user }: { user: any }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (['SUPER_ADMIN', 'DOCTOR'].includes(user?.role)) {
      appointmentApi.getAppointments().then(data => {
        setAppointments(data);
        setLoadingAppts(false);
      }).catch(() => setLoadingAppts(false));
    }
  }, [user]);

  const format12Hour = (timeStr: string) => {
    if (!timeStr) return 'N/A';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  const todayAppts = appointments.filter(a => a.appointment_date === todayStr && a.status !== 'COMPLETED');
  const upcomingAppts = appointments.filter(a => a.appointment_date > todayStr && a.status !== 'COMPLETED');
  const completedAppts = appointments.filter(a => a.status === 'COMPLETED');

  let activeList = [];
  let emptyMsg = "";
  if (activeTab === 'today') { activeList = todayAppts; emptyMsg = "No appointments scheduled for today."; }
  else if (activeTab === 'upcoming') { activeList = upcomingAppts; emptyMsg = "No upcoming appointments."; }
  else { activeList = completedAppts; emptyMsg = "No completed appointments."; }

  const totalPages = Math.ceil(activeList.length / ITEMS_PER_PAGE) || 1;
  const paginatedList = activeList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">My Appointments</h2>
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => handleTabChange('today')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-colors ${activeTab === 'today' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <Clock size={16}/> Today <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md text-[10px] ml-1">{todayAppts.length}</span>
          </button>
          <button 
            onClick={() => handleTabChange('upcoming')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-colors ${activeTab === 'upcoming' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <CalendarCheck size={16}/> Upcoming <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md text-[10px] ml-1">{upcomingAppts.length}</span>
          </button>
          <button 
            onClick={() => handleTabChange('completed')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-colors ${activeTab === 'completed' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <FileCheck size={16}/> Completed <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md text-[10px] ml-1">{completedAppts.length}</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loadingAppts ? (
          <div className="text-center text-slate-500 py-12"><Loader2 className="animate-spin inline mr-2 w-6 h-6"/> Loading appointments...</div>
        ) : activeList.length === 0 ? (
          <div className="text-center text-slate-500 py-12">{emptyMsg}</div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-4 font-semibold text-sm w-1/4">Date & Time</th>
                  <th className="p-4 font-semibold text-sm w-1/3">Patient Name</th>
                  <th className="p-4 font-semibold text-sm w-1/4">Notes / Type</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedList.map((apt, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-800 text-sm">
                        {apt.appointment_date === todayStr ? 'Today' : apt.appointment_date}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {format12Hour(apt.appointment_time)}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {apt.patient?.full_name || 'Unknown Patient'}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {apt.notes || 'Consultation'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === 'WAITING' || apt.status === 'CHECKED_IN' ? 'bg-orange-100 text-orange-700' : 
                        apt.status === 'NEXT' ? 'bg-green-100 text-green-700' : 
                        apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {apt.status || 'Scheduled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                <span className="text-sm text-slate-500">
                  Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, activeList.length)}</span> of <span className="font-medium">{activeList.length}</span> appointments
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-medium text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
