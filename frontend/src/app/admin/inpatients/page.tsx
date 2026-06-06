"use client";

import React, { useState, useMemo } from 'react';
import { BedDouble, Phone, Loader2, Plus, Search } from 'lucide-react';
import { useAdmissions, useDischargeAdmission } from "../../../hooks";
import { PatientAdmissionModal } from "../../../components/dashboard/PatientAdmissionModal";
import { DailyVisitModal } from "../../../components/dashboard/DailyVisitModal";
import { DischargeConfirmModal } from "../../../components/dashboard/DischargeConfirmModal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function InpatientsPage() {
  const { data: admissions = [], isLoading } = useAdmissions();
  const { mutateAsync: dischargePatient, isPending: isDischarging } = useDischargeAdmission();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [dailyVisitModalState, setDailyVisitModalState] = useState<{isOpen: boolean, admissionId: string, patientName: string}>({
    isOpen: false,
    admissionId: '',
    patientName: ''
  });
  
  const [dischargeModalState, setDischargeModalState] = useState<{isOpen: boolean, admissionId: string, patientName: string}>({
    isOpen: false,
    admissionId: '',
    patientName: ''
  });

  const [expandedAdmissions, setExpandedAdmissions] = useState<Record<string, boolean>>({});

  const toggleHistory = (id: string) => {
    setExpandedAdmissions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderDailyVisits = (adm: any) => {
    if (!expandedAdmissions[adm.id]) return null;
    
    return (
      <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          Daily Checks History
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
            {adm.daily_visits?.length || 0} Records
          </span>
        </h4>
        {(!adm.daily_visits || adm.daily_visits.length === 0) ? (
          <p className="text-sm text-slate-500 italic">No daily checks logged yet.</p>
        ) : (
          <div className="space-y-3">
            {adm.daily_visits.map((visit: any) => (
              <div key={visit.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800">
                    Dr. {visit.doctor_name || 'Unknown'}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {new Date(visit.visit_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <p className="text-slate-600 whitespace-pre-wrap">{visit.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const filteredAdmissions = useMemo(() => {
    if (!searchQuery.trim()) return admissions;
    const query = searchQuery.toLowerCase();
    return admissions.filter((a: any) => 
      (a.patient_name || '').toLowerCase().includes(query) ||
      (a.patient_phone || '').toLowerCase().includes(query) ||
      (a.room_bed_number || '').toLowerCase().includes(query)
    );
  }, [admissions, searchQuery]);

  const activeAdmissions = useMemo(() => {
    return filteredAdmissions.filter((a: any) => a.status === 'ADMITTED');
  }, [filteredAdmissions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="font-medium animate-pulse">Loading inpatient data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inpatients Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage currently admitted patients, assign beds, and log daily checks.</p>
        </div>
        <Button onClick={() => setIsAdmissionModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Admit Patient
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        <Input 
          placeholder="Search inpatients by name, phone, or bed number..." 
          className="pl-12 h-14 bg-white border-slate-200 rounded-xl text-md shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
            <div className="p-12 text-center text-slate-500">
              <BedDouble className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600">No patients are currently admitted.</p>
              <p className="text-sm text-slate-400 mt-2">Click "Admit Patient" above to admit a new patient.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeAdmissions.map((adm: any) => (
                <div key={adm.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-700 font-bold text-xl">
                        {adm.patient_name?.charAt(0) || 'P'}
                      </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800 text-lg">
                          {adm.patient_name || 'Unknown Patient'}
                        </p>
                        {adm.admission_number && (
                          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded border border-slate-200">
                            {adm.admission_number}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {adm.patient_phone}
                        </span>
                        {adm.attender_mobile_number && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-slate-400">Attender:</span> {adm.attender_mobile_number}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                          <BedDouble className="w-4 h-4" />
                          Bed: {adm.room_bed_number || 'TBD'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">
                        <span className="font-medium">Reason for admission:</span> {adm.reason_for_admission}
                      </p>
                      {adm.admitting_doctor_name && (
                        <p className="text-xs text-slate-400 mt-1">Admitting Doctor: Dr. {adm.admitting_doctor_name}</p>
                      )}
                    </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => toggleHistory(adm.id)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-center"
                      >
                        {expandedAdmissions[adm.id] ? 'Hide History' : 'View History'}
                      </button>
                      <button 
                        onClick={() => setDailyVisitModalState({ isOpen: true, admissionId: adm.id, patientName: adm.patient_name })}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors text-center"
                      >
                        Log Daily Check
                      </button>
                      <button 
                        onClick={() => setDischargeModalState({ isOpen: true, admissionId: adm.id, patientName: adm.patient_name })}
                        className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-colors text-center"
                      >
                        Discharge Patient
                      </button>
                    </div>
                  </div>
                  {renderDailyVisits(adm)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Discharged Patients Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-emerald-600" />
            Discharged Patients
          </h3>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {filteredAdmissions.filter((a: any) => a.status === 'DISCHARGED').length} Discharged
          </span>
        </div>
        
        <div className="p-0">
          {filteredAdmissions.filter((a: any) => a.status === 'DISCHARGED').length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg font-medium text-slate-600">No discharged patients match your search.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredAdmissions.filter((a: any) => a.status === 'DISCHARGED').map((adm: any) => (
                <div key={adm.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700 font-bold text-xl">
                        {adm.patient_name?.charAt(0) || 'P'}
                      </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800 text-lg">
                          {adm.patient_name || 'Unknown Patient'}
                        </p>
                        {adm.admission_number && (
                          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded border border-slate-200">
                            {adm.admission_number}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {adm.patient_phone}
                        </span>
                        {adm.attender_mobile_number && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-slate-400">Attender:</span> {adm.attender_mobile_number}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          Discharged On: {new Date(adm.discharge_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">
                        <span className="font-medium">Reason for admission:</span> {adm.reason_for_admission}
                      </p>
                    </div>
                    </div>
                    <div>
                      <button 
                        onClick={() => toggleHistory(adm.id)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-center"
                      >
                        {expandedAdmissions[adm.id] ? 'Hide History' : 'View History'}
                      </button>
                    </div>
                  </div>
                  {renderDailyVisits(adm)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

      <DischargeConfirmModal
        isOpen={dischargeModalState.isOpen}
        onClose={() => setDischargeModalState({ ...dischargeModalState, isOpen: false })}
        patientName={dischargeModalState.patientName}
        isPending={isDischarging}
        onConfirm={async () => {
          if (!dischargeModalState.admissionId) return;
          try {
            await dischargePatient(dischargeModalState.admissionId);
            setDischargeModalState({ isOpen: false, admissionId: '', patientName: '' });
          } catch (error) {
            console.error("Failed to discharge patient:", error);
          }
        }}
      />
    </div>
  );
}
