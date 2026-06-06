import { useState, useMemo } from "react";
import { Phone, Loader2, CheckCircle, UserPlus, Clock, CalendarCheck, FileCheck } from "lucide-react";
import { useAppointments, useDoctors, useAssignDoctor, useUpdateAppointmentStatus, useCreateVisit, usePatients } from "../../hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

type TabType = 'today' | 'unassigned' | 'upcoming' | 'completed';

export default function AppointmentCard() {
  const { data: appointments = [], isLoading } = useAppointments();
  const { data: doctors = [] } = useDoctors();
  const { data: patients = [] } = usePatients();
  const { mutateAsync: assignDoctor, isPending: isAssigning } = useAssignDoctor();
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateAppointmentStatus();
  const { mutateAsync: createVisit } = useCreateVisit();
  
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [selectedDoctors, setSelectedDoctors] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const formatHour12 = (timeStr?: string) => {
    if (!timeStr) return '10';
    const h = parseInt(timeStr.split(':')[0], 10);
    const hour = h % 12;
    return hour ? hour.toString() : '12';
  };
  
  const getAmPm = (timeStr?: string) => {
    if (!timeStr) return 'AM';
    const h = parseInt(timeStr.split(':')[0], 10);
    return h >= 12 ? 'PM' : 'AM';
  };
  
  const formatTime12h = (timeStr?: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour.toString().padStart(2, '0')}:${m || '00'} ${ampm}`;
  };

  // Token assignment logic: sort today's appointments by creation time
  const appointmentsWithTokens = useMemo(() => {
    const todaysAppts = appointments.filter((a: any) => a.appointment_date === todayStr);
    const sorted = [...todaysAppts].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    return appointments.map((appt: any) => {
      if (appt.appointment_date === todayStr) {
        const index = sorted.findIndex(s => s.id === appt.id);
        return { ...appt, token: index + 1 };
      }
      return appt;
    });
  }, [appointments, todayStr]);

  const handleAssign = async (appointmentId: string) => {
    const doctorId = selectedDoctors[appointmentId];
    if (!doctorId) return;
    try {
      setProcessingId(appointmentId);
      await assignDoctor({ id: appointmentId, doctorId });
      const newSelections = { ...selectedDoctors };
      delete newSelections[appointmentId];
      setSelectedDoctors(newSelections);
    } catch (e) {
      console.error("Failed to assign doctor", e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCheckIn = async (appt: any) => {
    try {
      setProcessingId(appt.id);
      await createVisit({
        patient_id: appt.patient_id,
        doctor_id: appt.doctor_id,
        appointment_id: appt.id,
        symptoms: appt.notes || "Check-in from Reception",
      });
      await updateStatus({ id: appt.id, status: 'CHECKED_IN' });
    } catch (e) {
      console.error("Failed to check in", e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (apptId: string) => {
    try {
      setProcessingId(apptId);
      await updateStatus({ id: apptId, status: 'COMPLETED' });
    } catch (e) {
      console.error("Failed to mark completed", e);
    } finally {
      setProcessingId(null);
    }
  };

  // Categorize appointments
  const todaysQueue = appointmentsWithTokens.filter((a: any) => a.appointment_date === todayStr && a.doctor_id && (a.status === 'SCHEDULED' || a.status === 'CHECKED_IN'));
  const unassignedAppts = appointmentsWithTokens.filter((a: any) => !a.doctor_id);
  const upcomingAppts = appointmentsWithTokens.filter((a: any) => a.appointment_date > todayStr && a.doctor_id && a.status !== 'COMPLETED' && a.status !== 'CANCELLED');
  const completedAppts = appointmentsWithTokens.filter((a: any) => a.appointment_date === todayStr && a.status === 'COMPLETED');

  let displayAppts: any[] = [];
  if (activeTab === 'today') displayAppts = todaysQueue;
  else if (activeTab === 'unassigned') displayAppts = unassignedAppts;
  else if (activeTab === 'upcoming') displayAppts = upcomingAppts;
  else if (activeTab === 'completed') displayAppts = completedAppts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Appointments (Reception)</h2>
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
          <TabButton active={activeTab === 'today'} onClick={() => setActiveTab('today')} count={todaysQueue.length} icon={<Clock size={16}/>} label="Today's Queue" color="text-blue-700" />
          <TabButton active={activeTab === 'unassigned'} onClick={() => setActiveTab('unassigned')} count={unassignedAppts.length} icon={<UserPlus size={16}/>} label="Not Assigned" color="text-orange-700" />
          <TabButton active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} count={upcomingAppts.length} icon={<CalendarCheck size={16}/>} label="Upcoming" color="text-purple-700" />
          <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} count={completedAppts.length} icon={<FileCheck size={16}/>} label="Completed" color="text-emerald-700" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full p-12 flex justify-center text-slate-500">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600"/>
          </div>
        ) : displayAppts.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 border border-slate-200 rounded-xl bg-white shadow-sm">
            No appointments found in this category.
          </div>
        ) : displayAppts.map((appt: any) => {
          const doctorName = doctors.find((d: any) => d.id === appt.doctor_id)?.full_name;
          const patientName = patients.find((p: any) => p.id === appt.patient_id)?.full_name || appt.patient_name || `Patient ${appt.patient_id?.substring(0,4)}`;
          const isProcessing = processingId === appt.id;
          
          return (
            <div key={appt.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group relative overflow-hidden">
              {appt.status === 'CHECKED_IN' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`font-bold p-3 rounded-xl text-center leading-tight min-w-[50px] ${appt.token ? 'bg-blue-50 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {appt.token ? (
                      <>#<span className="text-xl">{appt.token}</span></>
                    ) : (
                      <>
                        {formatHour12(appt.appointment_time)}<br/>
                        <span className="text-xs uppercase tracking-wider">{getAmPm(appt.appointment_time)}</span>
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 truncate max-w-[150px]" title={patientName}>
                      {patientName}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{appt.appointment_date} {appt.appointment_time && `at ${formatTime12h(appt.appointment_time)}`}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  appt.status === 'CHECKED_IN' ? 'bg-indigo-100 text-indigo-700' : 
                  appt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 
                  'bg-slate-100 text-slate-600'
                }`}>
                  {appt.status}
                </span>
              </div>
              
              <div className="mt-2 space-y-3">
                {activeTab === 'unassigned' ? (
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <p className="text-xs font-semibold text-orange-600 mb-1 flex items-center gap-1">
                      <UserPlus size={14} /> Needs Doctor Assignment
                    </p>
                    <div className="flex gap-2">
                      <Select 
                        value={selectedDoctors[appt.id] || undefined} 
                        onValueChange={(val) => setSelectedDoctors(prev => ({ ...prev, [appt.id]: val }))}
                      >
                        <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select doctor" /></SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor: any) => (
                            <SelectItem key={doctor.id} value={doctor.id.toString()}>
                              Dr. {doctor.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        onClick={() => handleAssign(appt.id)}
                        disabled={!selectedDoctors[appt.id] || isAssigning || isProcessing}
                        className="bg-slate-800 hover:bg-slate-900 h-9"
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Assign"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="text-sm">
                      <span className="text-slate-500">Assigned to:</span>
                      <p className="font-semibold text-slate-800">Dr. {doctorName}</p>
                    </div>
                    
                    {appt.status === 'SCHEDULED' && activeTab === 'today' && (
                      <button 
                        onClick={() => handleCheckIn(appt)}
                        disabled={isProcessing}
                        className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle size={14} />} 
                        Check In
                      </button>
                    )}
                    
                    {appt.status === 'CHECKED_IN' && activeTab === 'today' && (
                      <button 
                        onClick={() => handleComplete(appt.id)}
                        disabled={isProcessing}
                        className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileCheck size={14} />} 
                        Mark Completed
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, count, icon, label, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-colors ${active ? `bg-white shadow-sm ${color}` : 'text-slate-600 hover:text-slate-800'}`}
    >
      {icon}
      <span>{label}</span>
      <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md text-[10px] ml-1">{count}</span>
    </button>
  );
}
