"use client";

import { FileText, Plus, Search, Phone, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { doctorApi, patientApi, appointmentApi } from "../services/api";

export function DoctorsManagement() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi.getDoctors().then((data) => {
      setDoctors(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Doctors Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={18} /> Add Doctor
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Specialization</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin inline mr-2"/> Loading Doctors...</td></tr>
            ) : doctors.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No doctors registered yet.</td></tr>
            ) : doctors.map((d, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{d.full_name || d.name}</td>
                <td className="p-4 text-slate-600">{d.specialization || d.spec}</td>
                <td className="p-4 text-slate-600">{d.phone}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${d.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.is_active !== false ? 'Active' : 'Inactive'}</span></td>
                <td className="p-4 text-blue-600 font-medium cursor-pointer hover:underline">Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StaffManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Staff & Reception</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={18} /> Add Staff
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Shift</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-4 font-medium text-slate-800">Priya Sharma</td>
              <td className="p-4 text-slate-600">Head Receptionist</td>
              <td className="p-4 text-slate-600">Morning</td>
              <td className="p-4 text-blue-600 font-medium cursor-pointer hover:underline">Edit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PatientManagement() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We should ideally get user role to decide which endpoint to call. 
  // But for the scope of "Assigned Patients Dashboard" for Doctors, 
  // we will try to call getAssignedPatients. If it fails (e.g. not a doctor), fallback to getPatients.
  useEffect(() => {
    patientApi.getAssignedPatients().then((data) => {
      setPatients(data);
      setLoading(false);
    }).catch(err => {
      // Fallback for non-doctors
      patientApi.getPatients().then((data) => {
        setPatients(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">My Patients</h2>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition">
          <Plus size={18} /> Register Patient
        </button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input type="text" placeholder="Search by name, phone or ID..." className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500"><Loader2 className="animate-spin inline mr-2"/> Loading Patients...</div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No assigned patients found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">Patient Code</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Registered By</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-blue-600">{p.patient_code}</td>
                  <td className="p-4 font-medium text-slate-800">{p.full_name}</td>
                  <td className="p-4 text-slate-600">{p.phone}</td>
                  <td className="p-4 text-slate-600">{p.registered_by_name || 'Receptionist'}</td>
                  <td className="p-4 text-blue-600 font-medium cursor-pointer hover:underline">View History</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function AppointmentManagement() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      appointmentApi.getAppointments(),
      patientApi.getPatients()
    ]).then(([apptData, patientData]) => {
      setAppointments(apptData);
      setPatients(patientData);
      setLoading(false);
    });
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Appointments (Reception)</h2>
        <div className="flex gap-2 text-sm">
          <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold">Today</button>
          <button className="text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg font-semibold">Upcoming</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {loading ? (
           <div className="col-span-2 p-8 text-center text-slate-500"><Loader2 className="animate-spin inline mr-2"/> Loading Appointments...</div>
        ) : appointments.length === 0 ? (
           <div className="col-span-2 p-8 text-center text-slate-500 border border-slate-200 rounded-xl bg-white">No appointments scheduled for today.</div>
        ) : appointments.map((appt, i) => {
          const patient = patients.find(p => p.id === appt.patient_id);
          const patientName = patient?.full_name || appt.patient_name || 'Unknown Patient';
          
          return (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 text-orange-700 font-bold p-3 rounded-lg text-center leading-tight">
                {formatHour12(appt.appointment_time)}<br/><span className="text-xs">{getAmPm(appt.appointment_time)}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{patientName}</h4>
                <p className="text-sm text-slate-500 flex items-center gap-1"><Phone size={14}/> {patient?.phone || '+91 9988776655'}</p>
              </div>
            </div>
            <button className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded text-sm font-semibold hover:bg-slate-200">Mark Arrived</button>
          </div>
        )})}
      </div>
    </div>
  );
}

export function PrescriptionEngine() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Digital Prescription Editor</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition">
          <FileText size={18} /> Generate PDF & Send
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-700 border-b pb-2">Patient Vitals</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Symptoms (e.g. Fever, Cough)" className="border p-2 rounded" />
              <input type="text" placeholder="Diagnosis" className="border p-2 rounded" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-700 border-b pb-2 flex justify-between items-center">
              Medicines <button className="text-blue-600 text-sm flex items-center gap-1"><Plus size={14}/> Add Row</button>
            </h3>
            <div className="flex gap-2 items-center text-sm font-medium text-slate-600">
              <span className="flex-1">Medicine Name</span>
              <span className="w-16 text-center">M</span>
              <span className="w-16 text-center">A</span>
              <span className="w-16 text-center">N</span>
              <span className="w-20">Days</span>
            </div>
            <div className="flex gap-2">
              <input type="text" value="Paracetamol 650mg" readOnly className="flex-1 border p-2 rounded bg-slate-50" />
              <input type="number" value="1" readOnly className="w-16 border p-2 rounded text-center bg-slate-50" />
              <input type="number" value="0" readOnly className="w-16 border p-2 rounded text-center bg-slate-50" />
              <input type="number" value="1" readOnly className="w-16 border p-2 rounded text-center bg-slate-50" />
              <input type="number" value="5" readOnly className="w-20 border p-2 rounded text-center bg-slate-50" />
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl text-white flex flex-col items-center justify-center text-center space-y-4">
          <FileText size={48} className="text-slate-400" />
          <h3 className="text-xl font-bold">PDF Preview</h3>
          <p className="text-sm text-slate-400">Complete the form to generate the Cloudinary hosted PDF and trigger the WhatsApp API.</p>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Clinic Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp API Key (Meta)</label>
          <input type="password" value="************************" readOnly className="w-full border border-slate-300 rounded p-2 bg-slate-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cloudinary URL</label>
          <input type="text" value="cloudinary://api_key:api_secret@elsan-clinic" readOnly className="w-full border border-slate-300 rounded p-2 bg-slate-50" />
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold">Save Configuration</button>
      </div>
    </div>
  );
}
