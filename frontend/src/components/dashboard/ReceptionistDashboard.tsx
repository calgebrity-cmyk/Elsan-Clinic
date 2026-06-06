import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Activity, Phone, UserPlus, FileText, CheckCircle, Search, AlertCircle, Loader2, ArrowRight, BedDouble } from 'lucide-react';
import { usePatients, useAppointments, useVisits, useDoctors, useAdmissions, useDischargeAdmission } from '../../hooks';

import { PatientRegistrationModal } from "./PatientRegistrationModal";
import { VisitCreationModal } from "./VisitCreationModal";
import { PatientAdmissionModal } from "./PatientAdmissionModal";
import { DailyVisitModal } from "./DailyVisitModal";

interface ReceptionistDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export default function ReceptionistDashboard({ 
  onNavigateToTab 
}: ReceptionistDashboardProps) {
  const format12Hour = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour.toString().padStart(2, '0')}:${m || '00'} ${ampm}`;
  };

  const formatTimeFromDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    let hour = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  const { data: patients = [], isLoading: isLoadingPatients } = usePatients();
  const { data: appointments = [], isLoading: isLoadingAppts } = useAppointments();
  const { data: visits = [], isLoading: isLoadingVisits } = useVisits();
  const { data: doctors = [] } = useDoctors();
  const { data: admissions = [], isLoading: isLoadingAdmissions } = useAdmissions();
  const { mutateAsync: dischargePatient } = useDischargeAdmission();

  // Modals state
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  
  // Daily Visit Modal state
  const [dailyVisitModalState, setDailyVisitModalState] = useState<{isOpen: boolean, admissionId: string, patientName: string}>({
    isOpen: false,
    admissionId: '',
    patientName: ''
  });

  const isLoading = isLoadingPatients || isLoadingAppts || isLoadingVisits || isLoadingAdmissions;

  const metrics = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalPatients = patients.length;
    const activePatients = patients.filter((p: any) => p.is_active).length;
    const newPatientsToday = patients.filter((p: any) => new Date(p.created_at) >= today).length;
    
    // Filter appointments for today
    const todaysAppointments = appointments.filter((a: any) => a.appointment_date === todayStr);
    const checkedInAppts = todaysAppointments.filter((a: any) => a.status === 'CHECKED_IN').length;
    const pendingAppts = todaysAppointments.filter((a: any) => a.status === 'SCHEDULED').length;

    return {
      totalPatients,
      activePatients,
      newPatientsToday,
      todaysAppointments: todaysAppointments.length,
      checkedInAppts,
      pendingAppts
    };
  }, [patients, appointments]);

  const recentRegistrations = useMemo(() => {
    return [...patients]
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4);
  }, [patients]);

  const activeClinicQueue = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return visits
      .filter((v: any) => {
        if (!v.created_at || !v.created_at.startsWith(todayStr)) return false;
        
        // Find if there's an associated appointment for this visit that is already COMPLETED
        const appt = appointments.find((a: any) => 
          a.id === v.appointment_id || 
          (a.patient_id === v.patient_id && a.appointment_date === todayStr)
        );
        
        if (appt && appt.status === 'COMPLETED') return false;
        return true;
      })
      .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [visits, appointments]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return appointments
      .filter((a: any) => a.appointment_date === todayStr && a.status === 'SCHEDULED')
      .sort((a: any, b: any) => {
        if (!a.appointment_time || !b.appointment_time) return 0;
        return a.appointment_time.localeCompare(b.appointment_time);
      })
      .slice(0, 4);
  }, [appointments]);

  const activeAdmissions = useMemo(() => {
    return admissions.filter((a: any) => a.status === 'ADMITTED');
  }, [admissions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="font-medium animate-pulse">Loading live dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Dashboard Metrics (Live Data) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Total Patients" value={metrics.totalPatients} icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <MetricCard title="Active Patients" value={metrics.activePatients} icon={Activity} color="text-emerald-600" bg="bg-emerald-50" />
        <MetricCard title="New Today" value={metrics.newPatientsToday} icon={UserPlus} color="text-purple-600" bg="bg-purple-50" />
        <MetricCard title="Today's Appts" value={metrics.todaysAppointments} icon={CalendarIcon} color="text-orange-600" bg="bg-orange-50" />
        <MetricCard title="Checked-In" value={metrics.checkedInAppts} icon={CheckCircle} color="text-teal-600" bg="bg-teal-50" />
        <MetricCard title="Pending Appts" value={metrics.pendingAppts} icon={Clock} color="text-rose-600" bg="bg-rose-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* 2. Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <button 
                onClick={() => setIsRegistrationModalOpen(true)}
                className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-center">New Patient</span>
              </button>
              
              <button 
                onClick={() => setIsVisitModalOpen(true)}
                className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-center">Create Visit</span>
              </button>

              <button 
                onClick={() => setIsAdmissionModalOpen(true)}
                className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BedDouble className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-center">Admit Patient</span>
              </button>
              <button 
                onClick={() => onNavigateToTab?.('patients')}
                className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-center">Search Patient</span>
              </button>

              <button onClick={() => onNavigateToTab?.('appointments')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-100">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-800"><CalendarIcon size={18} /></div>
                <span className="text-sm font-semibold text-center">Appointments</span>
              </button>
            </div>
          </div>

          {/* Admitted Patients (Inpatients) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-orange-600" />
                Admitted Patients (Inpatients)
              </h3>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {activeAdmissions.length} Admitted
              </span>
            </div>
            <div className="p-0">
              {activeAdmissions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p>No patients are currently admitted.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {activeAdmissions.map((adm: any) => (
                    <div key={adm.id} className="p-4 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-700 font-bold">
                          {adm.patient_name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm md:text-base">
                            {adm.patient_name || 'Unknown Patient'}
                          </p>
                          <div className="flex items-center gap-3 text-xs md:text-sm text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {adm.patient_phone}
                            </span>
                            <span className="flex items-center gap-1 text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">
                              Bed: {adm.room_bed_number || 'TBD'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setDailyVisitModalState({ isOpen: true, admissionId: adm.id, patientName: adm.patient_name })}
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Log Check
                        </button>
                        <button 
                          onClick={async () => {
                            if(window.confirm('Are you sure you want to discharge this patient?')) {
                              await dischargePatient(adm.id);
                            }
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          Discharge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Active Patient Queue */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Active Clinic Queue (Today's Visits)
              </h3>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {activeClinicQueue.length} Waiting
              </span>
            </div>
            <div className="p-0">
              {activeClinicQueue.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p>No active visits currently in queue.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {activeClinicQueue.map((visit: any) => {
                    const doctorName = doctors.find((d: any) => d.id === visit.doctor_id)?.full_name || visit.doctor_name || 'Unassigned';
                    const patientName = patients.find((p: any) => p.id === visit.patient_id)?.full_name || visit.patient_name || 'Unknown Patient';
                    return (
                    <div key={visit.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                          {patientName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{patientName}</p>
                          <div className="flex gap-2 items-center text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1"><Clock size={12} /> {formatTimeFromDate(visit.created_at)}</span>
                            <span>•</span>
                            <span className="font-medium text-slate-600">Dr. {doctorName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">In Queue</span>
                        <ArrowRight size={18} className="text-slate-400" />
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          
          {/* 4. Today's Appointments */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Today's Appointments</h3>
              <button onClick={() => onNavigateToTab?.('appointments')} className="text-xs text-blue-600 hover:underline font-medium">View All</button>
            </div>
            <div className="p-4 space-y-3">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-500">
                  <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No more upcoming appointments today.
                </div>
              ) : (
                upcomingAppointments.map((appt: any) => {
                  const doctorName = doctors.find((d: any) => d.id === appt.doctor_id)?.full_name || 'Assigned Doctor';
                  return (
                    <div key={appt.id} className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{appt.patient_name || 'Patient ' + appt.patient_id.substring(0, 4)}</span>
                        <span className="text-xs text-slate-500 mt-1">Dr. {doctorName}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded text-right mb-1">
                          {appt.appointment_time ? format12Hour(appt.appointment_time) : 'Time TBD'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Scheduled</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 5. Recent Patient Registrations */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Recent Registrations</h3>
            </div>
            <div className="p-0">
              {recentRegistrations.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">No recent patients.</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {recentRegistrations.map((patient: any) => (
                    <div key={patient.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{patient.full_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{patient.patient_code}</p>
                      </div>
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium border border-emerald-100">New</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 6. Alerts & Notifications */}
          <div className="bg-rose-50 rounded-2xl border border-rose-100 p-5 shadow-sm">
            <h3 className="font-bold text-rose-800 flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5" />
              Alerts
            </h3>
            <ul className="space-y-2 text-sm text-rose-700">
              {metrics.pendingAppts > 0 ? (
                <li className="flex gap-2"><span className="font-bold">•</span> {metrics.pendingAppts} appointments are still pending check-in today.</li>
              ) : (
                <li className="text-rose-600/70 italic text-sm">No critical alerts currently.</li>
              )}
            </ul>
          </div>

        </div>
      </div>

      <PatientRegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={() => setIsRegistrationModalOpen(false)} 
      />

      <VisitCreationModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />

      <PatientAdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
      />

      <DailyVisitModal
        isOpen={dailyVisitModalState.isOpen}
        onClose={() => setDailyVisitModalState({ ...dailyVisitModalState, isOpen: false })}
        admissionId={dailyVisitModalState.admissionId}
        patientName={dailyVisitModalState.patientName}
      />
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h4>
        <div className={`p-2 rounded-xl ${bg} ${color}`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <span className="text-2xl font-black text-slate-800">{value}</span>
      </div>
    </div>
  );
}
