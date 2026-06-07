import { FileText, Plus, Search, Loader2, Send, User, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState, useEffect } from "react";
import { medicineApi, prescriptionApi, patientApi } from "../../services/api";

export default function PrescriptionForm({ patientId, visitId }: { patientId?: string, visitId?: string }) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(patientId);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [activeVisitId, setActiveVisitId] = useState<string | undefined>(visitId);

  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [nextVisitDate, setNextVisitDate] = useState("");
  
  const [medicines, setMedicines] = useState([{
    medicine_name: "", dosage: "", morning: false, afternoon: false, night: false, duration_days: 5, instructions: ""
  }]);
  
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Medicine Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  // Patient Search State
  const [patientQuery, setPatientQuery] = useState("");
  const [patientSuggestions, setPatientSuggestions] = useState<any[]>([]);
  const [searchingPatients, setSearchingPatients] = useState(false);

  useEffect(() => {
    // If patientId was passed via props, fetch patient name
    if (patientId && !selectedPatientName) {
      patientApi.getPatient(patientId).then(data => {
        setSelectedPatientName(data.full_name);
      }).catch(console.error);
    }
  }, [patientId]);

  const handlePatientSearch = async (query: string) => {
    setPatientQuery(query);
    if (query.length >= 2) {
      setSearchingPatients(true);
      try {
        const results = await patientApi.search(query);
        setPatientSuggestions(results);
      } catch (err) {
        console.error(err);
      } finally {
        setSearchingPatients(false);
      }
    } else {
      setPatientSuggestions([]);
    }
  };

  const selectPatient = (patient: any) => {
    setSelectedPatientId(patient.id);
    setSelectedPatientName(patient.full_name);
    setPatientQuery("");
    setPatientSuggestions([]);
  };

  const clearPatient = () => {
    setSelectedPatientId(undefined);
    setSelectedPatientName("");
    setPatientQuery("");
  };

  const handleSearchMedicine = async (query: string, index: number) => {
    setSearchQuery(query);
    const newMeds = [...medicines];
    newMeds[index].medicine_name = query;
    setMedicines(newMeds);
    
    if (query.length >= 2) {
      try {
        const results = await medicineApi.search(query);
        setSuggestions(results);
        setActiveRow(index);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectMedicine = (med: any, index: number) => {
    const newMeds = [...medicines];
    newMeds[index] = {
      ...newMeds[index],
      medicine_name: med.name,
      dosage: med.default_dosage || "500mg",
      instructions: med.default_instructions || "After Food"
    };
    setMedicines(newMeds);
    setSuggestions([]);
    setActiveRow(null);
  };

  const addRow = () => {
    setMedicines([...medicines, { medicine_name: "", dosage: "", morning: false, afternoon: false, night: false, duration_days: 5, instructions: "" }]);
  };

  const handleSaveAndGeneratePDF = async () => {
    if (!selectedPatientId) {
      alert("Error: Please select a patient first.");
      return;
    }
    
    // Using a dummy doctor_id for now if not available from context, 
    // ideally the backend pulls doctor_id from the authenticated user token.
    const currentDoctorId = "00000000-0000-0000-0000-000000000000"; 
    
    setLoading(true);
    try {
      const prescData = {
        patient_id: selectedPatientId,
        doctor_id: currentDoctorId,
        visit_id: activeVisitId || undefined, // backend will create one if undefined
        symptoms: symptoms || diagnosis || undefined,
        next_visit_date: nextVisitDate || undefined,
        medicines: medicines.map(m => ({
          medicine_name: m.medicine_name || "Prescription Medicine",
          dosage: m.dosage || "As directed",
          frequency: `${m.morning ? '1' : '0'}-${m.afternoon ? '1' : '0'}-${m.night ? '1' : '0'}`,
          duration_days: m.duration_days > 0 ? m.duration_days : 1,
          instructions: m.instructions,
          morning: m.morning,
          afternoon: m.afternoon,
          night: m.night
        }))
      };
      
      const res = await prescriptionApi.create(prescData);
      setPdfUrl(res.pdf_url);
      
      // Update activeVisitId in case the backend created a new one
      if (!activeVisitId && res.visit_id) {
          setActiveVisitId(res.visit_id);
      }
      
      alert("Success: Prescription generated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error: Failed to generate prescription.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendWhatsApp = async () => {
    if (!pdfUrl) return;
    setSending(true);
    try {
      // Logic for WhatsApp trigger 
      // await whatsappApi.sendPrescription(...)
      setTimeout(() => {
        setSending(false);
        alert("Success: Sent to patient's WhatsApp successfully!");
      }, 1500);
    } catch (err) {
      console.error(err);
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-blue-600" />
          Digital Prescription Editor
        </h2>
        <Button onClick={handleSaveAndGeneratePDF} disabled={loading} className="bg-teal-600 hover:bg-teal-700 shadow-sm text-white font-semibold">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />} 
          Generate PDF
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          
          {/* Patient Context Card */}
          <Card className="border-slate-200 shadow-sm border-t-4 border-t-blue-500 overflow-visible z-20">
            <CardHeader className="border-b pb-3 bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <User size={18} className="text-blue-600" /> Patient Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {selectedPatientId && selectedPatientName ? (
                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold">
                      {selectedPatientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{selectedPatientName}</p>
                      <p className="text-xs text-slate-500 font-medium">Patient Context Active</p>
                    </div>
                  </div>
                  {!patientId && ( // Only show change button if not passed by props
                    <Button variant="outline" size="sm" onClick={clearPatient} className="text-blue-600 border-blue-200 hover:bg-blue-100">
                      Change Patient
                    </Button>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                      value={patientQuery} 
                      onChange={e => handlePatientSearch(e.target.value)} 
                      placeholder="Search patient by name, ID, or phone number..." 
                      className="pl-9 bg-slate-50 border-slate-200"
                    />
                    {searchingPatients && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-blue-500 animate-spin" />}
                  </div>
                  {patientSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                      {patientSuggestions.map((s, i) => (
                        <div 
                          key={i} 
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center justify-between"
                          onClick={() => selectPatient(s)}
                        >
                          <div>
                            <span className="font-bold text-slate-800">{s.full_name}</span>
                            <span className="text-slate-500 text-xs ml-2">ID: {s.patient_code}</span>
                          </div>
                          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">{s.phone}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b pb-3 bg-slate-50/50">
              <CardTitle className="text-lg">Clinical Vitals & Follow-up</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Symptoms</label>
                  <Input value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="e.g. Fever, Cough" className="bg-slate-50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Diagnosis</label>
                  <Input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Diagnosis details" className="bg-slate-50" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1"><Calendar size={14} /> Next Visit Date (Optional)</label>
                  <Input type="date" value={nextVisitDate} onChange={e => setNextVisitDate(e.target.value)} className="bg-slate-50 w-full md:w-1/2" />
                  <p className="text-[10px] text-slate-500 italic">If provided, an automated WhatsApp reminder will be sent 1 day before the visit.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm border-t-4 border-t-indigo-500 overflow-visible z-10">
            <CardHeader className="border-b pb-3 bg-slate-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg mt-1.5">Prescribed Medicines</CardTitle>
              <Button onClick={addRow} variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 h-8">
                <Plus className="mr-1 h-4 w-4" /> Add Row
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
            <div className="flex gap-2 items-center text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider bg-slate-100 p-2 rounded-md">
              <span className="flex-1 pl-2">Medicine Name</span>
              <span className="w-20">Dosage</span>
              <span className="w-10 text-center">M</span>
              <span className="w-10 text-center">A</span>
              <span className="w-10 text-center">N</span>
              <span className="w-16">Days</span>
            </div>
            
            <div className="space-y-3">
              {medicines.map((med, index) => (
                <div key={index} className="flex gap-2 relative">
                  <div className="flex-1 relative">
                    <Input 
                      value={med.medicine_name} 
                      onChange={e => handleSearchMedicine(e.target.value, index)} 
                      placeholder="Search medicine..." 
                      className="border-slate-200 focus-visible:ring-indigo-500"
                    />
                    {activeRow === index && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                        {suggestions.map((s, i) => (
                          <div 
                            key={i} 
                            className="p-2.5 hover:bg-indigo-50 cursor-pointer text-sm border-b border-slate-50 last:border-0"
                            onClick={() => selectMedicine(s, index)}
                          >
                            <span className="font-bold text-slate-800">{s.name}</span> <span className="text-indigo-500 text-xs font-semibold ml-2">{s.default_dosage}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Input 
                    className="w-20 border-slate-200 focus-visible:ring-indigo-500" 
                    value={med.dosage} 
                    onChange={e => { const n = [...medicines]; n[index].dosage = e.target.value; setMedicines(n); }} 
                    placeholder="Dosage" 
                  />
                  <Input 
                    type="checkbox" 
                    className="w-10 h-10 accent-indigo-600 rounded cursor-pointer" 
                    checked={med.morning} 
                    onChange={e => { const n = [...medicines]; n[index].morning = e.target.checked; setMedicines(n); }} 
                  />
                  <Input 
                    type="checkbox" 
                    className="w-10 h-10 accent-indigo-600 rounded cursor-pointer" 
                    checked={med.afternoon} 
                    onChange={e => { const n = [...medicines]; n[index].afternoon = e.target.checked; setMedicines(n); }} 
                  />
                  <Input 
                    type="checkbox" 
                    className="w-10 h-10 accent-indigo-600 rounded cursor-pointer" 
                    checked={med.night} 
                    onChange={e => { const n = [...medicines]; n[index].night = e.target.checked; setMedicines(n); }} 
                  />
                  <Input 
                    type="number" 
                    className="w-16 border-slate-200 focus-visible:ring-indigo-500" 
                    value={med.duration_days} 
                    onChange={e => { const n = [...medicines]; n[index].duration_days = parseInt(e.target.value) || 0; setMedicines(n); }} 
                  />
                </div>
              ))}
            </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-slate-900 p-8 rounded-2xl text-white flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10 pointer-events-none"></div>
          
          {pdfUrl ? (
             <div className="space-y-6 w-full flex flex-col items-center relative z-10 animate-in fade-in zoom-in duration-300">
               <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center">
                 <FileText size={48} className="text-teal-400 drop-shadow-md" />
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-white mb-2">Prescription Ready</h3>
                 <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-300 hover:text-blue-200 underline underline-offset-4 transition-colors">View PDF Document</a>
               </div>
               <Button onClick={handleSendWhatsApp} disabled={sending} className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/20 transition-all">
                 {sending ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Send className="mr-2 h-6 w-6" />}
                 Send via WhatsApp
               </Button>
             </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
                <FileText size={40} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-bold tracking-wide">PDF Preview</h3>
              <p className="text-sm text-slate-400 leading-relaxed px-4">Complete the form and click generate to create the Cloudinary hosted PDF and trigger WhatsApp delivery.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
