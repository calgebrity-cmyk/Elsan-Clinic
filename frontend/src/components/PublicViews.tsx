"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Activity, HeartPulse, Stethoscope, Pill, Baby, Users, Microscope, Calendar, Star, Building2, MapPin, User, Phone, BookOpen, Ambulance, BrainCircuit, FileText } from 'lucide-react';
import { DOCTORS, SERVICES } from '../data';
import type { ViewState } from '../types';

// Map icon strings to real lucide components safely
const ICON_MAP: Record<string, any> = {
  HeartPulse: HeartPulse,
  Users: Users,
  Activity: Activity,
  Stethoscope: Stethoscope,
  ClipboardList: Activity, // Fallback
  Pill: Pill,
  Baby: Baby,
  PersonStanding: Users, // Fallback
  Ambulance: HeartPulse, // Fallback
  Microscope: Microscope,
  Syringe: HeartPulse, // Fallback
  BedDouble: Stethoscope, // Fallback
};

export default function PublicViews({ view, onNavigate }: { view: ViewState, onNavigate: (v: ViewState) => void }) {
  if (view === 'about') return <AboutView />;
  if (view === 'services') return <ServicesView onNavigate={onNavigate} />;
  if (view === 'doctors') return <DoctorsView />;
  
  return <HomeView onNavigate={onNavigate} />;
}

function HeroVideoCarousel({ onNavigate }: { onNavigate: (v: ViewState) => void }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slides = [
    {
      videoUrl: "/video3.mp4",
      posterUrl: "https://images.unsplash.com/photo-1538108149393-cebb47cbdc12?w=2000&q=80",
      title: "Advanced Medical Technology",
      subtitle: "Equipped with state-of-the-art facilities for precise diagnostics and treatment."
    },
    {
      videoUrl: "/video2.mp4",
      posterUrl: "https://images.unsplash.com/photo-1551076805-e1869043e560?w=2000&q=80",
      title: "Compassionate Healthcare",
      subtitle: "Our dedicated team provides personalized care for your faster recovery."
    },
    {
      videoUrl: "/video1.mp4",
      posterUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2000&q=80",
      title: "Expert Care for Every Family",
      subtitle: "Serving over 10,000 families in Chennai for more than 20 years. Intelligently delivered by ELSAN AI."
    }
  ];

  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  React.useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentSlide) {
        video.play().catch(() => {});
      } else {
        setTimeout(() => {
           video.pause();
        }, 1000);
      }
    });
  }, [currentSlide]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl w-full" style={{ height: '550px' }}>
       {slides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 bg-slate-900 ${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}>
             <video 
               ref={el => { videoRefs.current[index] = el; }}
               src={slide.videoUrl} 
               poster={slide.posterUrl} 
               muted 
               loop 
               playsInline 
               className="absolute inset-0 w-full h-full object-cover object-center" 
             />
             <div className="absolute inset-0 bg-black/40" /> {/* Dark Overlay for text readability */}
          </div>
       ))}
       
       {/* Content overlay */}
       <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 md:pb-28 text-white z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-800/80 backdrop-blur-md border border-blue-600 px-4 py-1.5 rounded-full text-blue-100 text-sm font-semibold mb-6 shadow-inner tracking-wide w-max">
             <Star size={16} className="text-yellow-400" /> Powered by ELSAN AI & Gemini 3.1 Ultra
          </div>
          
          <motion.div
             key={currentSlide}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight drop-shadow-md">{slides[currentSlide].title}</h1>
            <p className="text-blue-50 text-lg md:text-xl mb-8 drop-shadow max-w-2xl">{slides[currentSlide].subtitle}</p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button onClick={() => onNavigate('book')} className="bg-orange-500 hover:bg-orange-400 text-white font-semibold flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg shadow-lg transition">
              <Calendar size={20} />
              Book Appointment
            </button>
            <button onClick={() => onNavigate('ai-tools')} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg shadow-lg transition border border-white/30">
              <Activity size={20} />
              Talk to ELSAN AI
            </button>
          </div>
       </div>

       {/* Slider Indicators */}
       <div className="absolute bottom-24 md:bottom-28 left-8 md:left-16 flex gap-2 z-20">
         {slides.map((_, idx) => (
           <button 
             key={idx} 
             onClick={() => setCurrentSlide(idx)}
             className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-orange-400 w-8' : 'bg-white/50 w-2 hover:bg-white/80'}`}
             aria-label={`Go to slide ${idx + 1}`}
           />
         ))}
       </div>
    </div>
  );
}

function HomeView({ onNavigate }: { onNavigate: (v: ViewState) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      {/* AI Daily Tip */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 p-4 rounded-xl flex items-start gap-4 shadow-sm animate-fade-in">
        <div className="bg-white p-2 rounded-lg text-teal-600 shadow-sm shrink-0 border border-teal-100">
          <Activity size={24} />
        </div>
        <div>
          <h4 className="text-teal-800 font-bold text-sm tracking-wide uppercase mb-1 flex items-center gap-2">
            💡 ELSAN AI Daily Tip
          </h4>
          <p className="text-slate-700 text-sm">Drinking 8 glasses of water daily can reduce your risk of kidney stones by up to 40%. Stay hydrated! - <span className="font-semibold text-teal-700">Gemini 3.1 Health Insight</span></p>
        </div>
      </div>

      {/* Hero Video Carousel Section */}
      <HeroVideoCarousel onNavigate={onNavigate} />

      {/* Quick Access Menu (Overlaps Hero) */}
      <section className="relative -mt-20 z-20 px-4 xl:px-0">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xl max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { title: 'Book Appt', icon: Calendar, view: 'book' as ViewState, primary: true },
              { title: 'Consult Online', icon: Phone, view: 'nri' as ViewState },
              { title: 'Health Checks', icon: HeartPulse, view: 'prohealth' as ViewState },
              { title: 'Find a Doctor', icon: User, view: 'doctors' as ViewState },
              { title: 'Buy Medicines', icon: Pill, view: 'contact' as ViewState },
              { title: 'Find Hospital', icon: Building2, view: 'contact' as ViewState },
              { title: 'AI Symptom Checker', icon: BrainCircuit, view: 'ai-tools' as ViewState, highlight: true },
              { title: 'View Records', icon: FileText, view: 'patient-portal' as ViewState },
              { title: 'Health Library', icon: BookOpen, view: 'health-library' as ViewState },
              { title: 'Emergency', icon: Ambulance, view: 'contact' as ViewState },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => onNavigate(item.view)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl text-center transition border shadow-sm hover:shadow-md ${item.primary ? 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-900 group' : item.highlight ? 'bg-teal-50 border-teal-200 hover:bg-teal-100 text-teal-900 group' : 'bg-white border-slate-100 hover:border-blue-300 hover:bg-slate-50 text-slate-700 group'}`}
              >
                <div className={`mb-3 p-3 rounded-full ${item.primary ? 'bg-orange-500 text-white' : item.highlight ? 'bg-teal-500 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'}`}>
                   <item.icon size={24} />
                </div>
                <span className="font-semibold text-[13px] leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto pt-4">
        {[
          { label: 'of Service', value: '20+ Years', icon: Star },
          { label: 'Families Served', value: '10,000+', icon: Users },
          { label: 'Online Telemedicine', value: '24/7', icon: Stethoscope },
          { label: 'AI Health Assistant', value: 'Gemini 3.1', icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
            <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <stat.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Centres of Excellence */}
      <section className="pt-12 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 px-4 md:px-0">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2 border-l-4 border-blue-600 pl-3">Centres of Clinical Excellence</h2>
            <p className="text-slate-600 pl-4">World-class specialized care across multiple medical disciplines.</p>
          </div>
          <button onClick={() => onNavigate('services')} className="hidden md:flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold">
            View All Specialties <ChevronRight size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
          {SERVICES.slice(0, 8).map((srv, i) => {
            const Icon = ICON_MAP[srv.iconName] || Activity;
            return (
              <button key={i} onClick={() => onNavigate('services')} className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-blue-400 hover:shadow-lg transition group">
                <div className="w-12 h-12 bg-slate-50 text-blue-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{srv.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
              </button>
            );
          })}
        </div>
        <button onClick={() => onNavigate('services')} className="w-full mt-4 md:hidden py-3 border-2 border-blue-100 text-blue-700 font-bold rounded-lg mt-4">
          View All Specialties
        </button>
      </section>

      {/* ProHealth Apollo Style Banner */}
      <section className="bg-gradient-to-r from-teal-900 to-blue-900 rounded-2xl p-8 md:p-12 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
        <div className="flex-1 space-y-4">
           <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
             Predict • Prevent • Overcome
           </div>
           <h2 className="text-3xl md:text-4xl font-bold">Elsan ProHealth</h2>
           <p className="text-blue-100 max-w-xl text-lg">India's most powerful preventive health management program. AI-assisted personalized health risk assessments mapped to your exact clinical profile.</p>
           <ul className="text-blue-200 space-y-2 font-medium">
             <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-400"/> Over 40+ medical parameters tested</li>
             <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-400"/> Expert Doctor & Dietitian consultation</li>
             <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-400"/> AI Health Risk Scoring</li>
           </ul>
        </div>
        <div className="bg-white p-6 rounded-xl text-slate-800 shrink-0 w-full md:w-80 shadow-2xl">
           <h3 className="font-bold text-xl mb-4 border-b pb-2">Book a Health Check</h3>
           <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm"><span>Basic Plan</span><span className="font-bold">₹499</span></div>
              <div className="flex justify-between items-center text-sm"><span>Child Health Plan</span><span className="font-bold">₹999</span></div>
              <div className="flex justify-between items-center text-sm"><span>Standard Plan</span><span className="font-bold">₹1,499</span></div>
              <div className="flex justify-between items-center text-sm"><span>Comprehensive</span><span className="font-bold">₹2,999</span></div>
           </div>
           <button onClick={() => onNavigate('prohealth')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition shadow-md">
             Explore Packages
           </button>
        </div>
      </section>
    </motion.div>
  );
}

function AboutView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900">About Elsan Clinic</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Providing evidence-based, compassionate care for over two decades in Chennai.</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2"><Activity className="text-blue-600" /> Our Mission</h2>
          <p className="text-slate-600 italic border-l-4 border-teal-500 pl-4 py-2 bg-slate-50 rounded-r-lg">
            "To provide evidence-based, patient-first healthcare that is accessible, affordable, and compassionate — for every family in Chennai."
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2"><User className="text-blue-600" /> Founder's Vision</h2>
          <p className="text-slate-600 leading-relaxed">
            Mrs. E. Shanthi established Elsan Clinic with the conviction that world-class medical care should not require a long journey. Her vision shaped everything — from the welcoming environment and trusted doctor relationships, to the in-clinic pharmacy and structured chronic disease programmes serving thousands of families. We embrace technology with ELSAN AI (Gemini 3.1) to bring intelligence directly to your care.
          </p>
        </div>
      </div>

      <div className="bg-blue-900 text-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Star className="text-yellow-400" /> Why Choose Elsan Clinic?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "20+ Years of Trusted Family Medical Care",
            "Doctors trained at Apollo, Sundaram, MGM, Johns Hopkins",
            "In-Clinic Pharmacy – no extra trips needed",
            "Structured Diabetes & Hypertension Monitoring Programs",
            "International Fellowships: Joslin, Boston, RCPCH London",
            "All Ages: Newborns to Senior Citizens",
            "Research-Led Medicine – doctors publish internationally",
            "Online Consultations Available"
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="font-medium text-sm md:text-base text-blue-50">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function DoctorsView() {
  const [doctors, setDoctors] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8009/api/v1';
        const res = await fetch(`${apiUrl}/doctors/public`);
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map((d: any) => ({
            id: d.id,
            name: d.full_name,
            role: `${d.experience_years} Years Experience`,
            qualifications: d.qualification ? d.qualification.split(', ') : [],
            fellowships: [],
            phone: d.phone,
            consultationType: d.consultation_timings || 'In-Clinic',
            specialties: d.specialization ? d.specialization.split(', ') : []
          }));
          setDoctors(formatted);
        }
      } catch (e) {
        console.error("Failed to fetch doctors", e);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900">Meet Your Doctors</h1>
        <p className="text-lg text-slate-600">Expert physicians with international fellowships and decades of experience.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {doctors.map((doc, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
            <div className="bg-blue-50 border-b border-slate-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-1">{doc.name}</h2>
                  <p className="text-sm font-medium text-teal-700">{doc.role}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm">
                  {doc.consultationType.includes('Online') ? <Activity size={12} className="text-blue-500" /> : <Building2 size={12} className="text-blue-500" />}
                  {doc.consultationType}
                </span>
                <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm">
                  <Phone size={12} className="text-green-500" />
                  {doc.phone}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-5 flex-1 flex flex-col">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Qualifications & Fellowships</h3>
                <ul className="space-y-1.5 list-disc list-inside text-sm text-slate-700">
                  {doc.qualifications.map((q: string, idx: number) => <li key={`q-${idx}`}>{q}</li>)}
                  {doc.fellowships.map((f: string, idx: number) => <li key={`f-${idx}`} className="text-slate-600">{f}</li>)}
                </ul>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Specialises In</h3>
                <div className="flex flex-wrap gap-1.5">
                  {doc.specialties.map((spec: string, idx: number) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const getServiceImage = (title: string) => {
  const map: Record<string, string> = {
    'Internal Medicine': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    'Family Medicine': 'https://images.unsplash.com/photo-1511174511562-5f7f18bf5d06?w=800&q=80',
    'Diabetes Management': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    'Hypertension Care': 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80',
    'Chronic Disease Mgmt': 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80',
    'In-Clinic Pharmacy': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    'Paediatric Medicine': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    'Geriatric Medicine': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    'Emergency Care': 'https://images.unsplash.com/photo-1587559070757-f72a388edbba?w=800&q=80',
    'Infectious Diseases': 'https://images.unsplash.com/photo-1584308666744-24d5e1ba0930?w=800&q=80',
    'Immunisation Clinic': 'https://images.unsplash.com/photo-1631815587646-b85a1bb02246?w=800&q=80',
    'Critical Care Support': 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&q=80',
  };
  return map[title] || 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&q=80';
};

export function ServicesView({ onNavigate }: { onNavigate?: (v: ViewState) => void }) {
  const [selectedService, setSelectedService] = React.useState<any | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900">Our Medical Services</h1>
        <p className="text-lg text-slate-600">Comprehensive care under one roof — click any service to view details.</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SERVICES.map((srv, i) => {
          const Icon = ICON_MAP[srv.iconName] || Activity;
          return (
            <div key={i} onClick={() => setSelectedService(srv)} className="cursor-pointer bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{srv.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{srv.description}</p>
            </div>
          );
        })}
      </div>
      
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full">
            <div className="h-48 md:h-64 w-full relative">
              <img src={getServiceImage(selectedService.title)} alt={selectedService.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <h2 className="absolute bottom-4 left-6 text-2xl md:text-3xl font-bold text-white drop-shadow-md">{selectedService.title}</h2>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                   {(() => {
                      const IconComponent = ICON_MAP[selectedService.iconName] || Activity;
                      return <IconComponent size={28} />;
                   })()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Service Overview</h3>
                  <p className="text-slate-600 leading-relaxed text-base">{selectedService.description}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <p className="text-sm text-slate-500 font-bold mb-3 uppercase tracking-wider">Key Benefits & Offerings</p>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700 font-medium">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Expert Consultations</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Advanced Diagnostics</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Personalised Care Plans</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Follow-up Support</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-2">
                <button onClick={() => { setSelectedService(null); onNavigate?.('book'); }} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2">
                  <Calendar size={18} /> Book Appointment
                </button>
                <button onClick={() => setSelectedService(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition">
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="mt-12 bg-teal-50 border border-teal-100 rounded-2xl p-8 text-center max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-teal-900 mb-2">Need a specific treatment?</h3>
        <p className="text-teal-700 mb-6">Our physicians will recommend the best course of action during your consultation.</p>
        <button onClick={() => onNavigate?.('book')} className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2.5 rounded-lg transition inline-flex items-center gap-2 shadow-sm">
          Book Consultation <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export function ContactView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900">Contact Us</h1>
        <p className="text-lg text-slate-600">We are here to help. Reach out for any medical assistance.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Building2 size={24}/></div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Clinic Address</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Elsan Clinic<br/>
                No 12, Main Road, T Nagar<br/>
                Chennai, Tamil Nadu - 600017
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-green-50 text-green-600 p-3 rounded-xl"><Phone size={24}/></div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Phone Number</h3>
              <p className="text-slate-600 mt-1">+91 44 2434 5678<br/>+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl"><Calendar size={24}/></div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Working Hours</h3>
              <p className="text-slate-600 mt-1">Monday - Saturday: 9:00 AM - 9:00 PM<br/>Sunday: 9:00 AM - 1:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-200 rounded-2xl overflow-hidden shadow-inner h-[400px] flex items-center justify-center relative">
           <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80" alt="Clinic Location" className="absolute inset-0 w-full h-full object-cover opacity-70" />
           <div className="relative bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg font-bold text-slate-800 flex items-center gap-2">
             <MapPin className="text-red-500" /> Map Integration Placeholder
           </div>
        </div>
      </div>
    </motion.div>
  );
}

export function BookView() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [doctors, setDoctors] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8009/api/v1';
        const res = await fetch(`${apiUrl}/doctors/public`);
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (e) {
        console.error("Failed to fetch doctors", e);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;

    const data = {
      full_name: (form.elements.namedItem('fullName') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      age: parseInt((form.elements.namedItem('age') as HTMLInputElement).value),
      gender: (form.elements.namedItem('gender') as HTMLSelectElement).value,
      appointment_date: (form.elements.namedItem('date') as HTMLInputElement).value,
      appointment_time: (form.elements.namedItem('time') as HTMLInputElement).value,
      doctor_name: (form.elements.namedItem('doctor') as HTMLSelectElement).value,
      notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8009/api/v1';
      const res = await fetch(`${apiUrl}/appointments/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSuccess(true);
        form.reset();
      } else {
        let errStr = "Please try again.";
        try { const errData = await res.json(); errStr = errData.detail || errStr; } catch(e) {}
        alert(`Failed to book appointment: ${errStr}`);
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto text-center space-y-6 py-12">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <Calendar size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Appointment Confirmed!</h2>
          <p className="text-slate-600 text-lg">Thank you! Your appointment has been scheduled and safely stored in our database. We look forward to seeing you.</p>
          <button onClick={() => setSuccess(false)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">Book Another</button>
       </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900">Book Appointment</h1>
        <p className="text-lg text-slate-600">Schedule your visit with our expert doctors.</p>
      </div>
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input name="fullName" required type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone Number</label>
              <input name="phone" required type="tel" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Age</label>
              <input name="age" required type="number" min="0" max="120" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="30" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gender</label>
              <select name="gender" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Preferred Date</label>
              <input name="date" required type="date" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Preferred Time</label>
              <input name="time" required type="time" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Preferred Doctor</label>
              <select name="doctor" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="Any Available Doctor">Any Available Doctor</option>
                {doctors.map(d => <option key={d.id} value={d.full_name}>{d.full_name}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Reason for Visit / Symptoms</label>
            <textarea name="notes" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none h-24" placeholder="Briefly describe your symptoms..." />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md transition text-lg flex justify-center items-center gap-2 disabled:opacity-70">
            <Calendar size={20} /> {loading ? 'Booking...' : 'Request Appointment'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
