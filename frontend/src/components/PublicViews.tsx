"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Activity, HeartPulse, Stethoscope, Pill, Baby, Users, Microscope, Calendar, Star, Building2, MapPin, User, Phone, BookOpen, Ambulance, BrainCircuit, FileText, Clock } from 'lucide-react';
import { DOCTORS, SERVICES, CLINIC_INFO } from '../data';
import type { ViewState } from '../types';
import { useSettings } from '../hooks';
import { getApiBaseUrl } from '../lib/api-config';

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
      videoUrl: "/video3.mp4?v=3",
      posterUrl: "https://images.unsplash.com/photo-1538108149393-cebb47cbdc12?w=2000&q=80",
      title: "Comprehensive Clinic Care",
      subtitle: "Equipped with modern diagnostic tools to provide precise and personalized treatment plans."
    },
    {
      videoUrl: "/video2.mp4?v=3",
      posterUrl: "https://images.unsplash.com/photo-1551076805-e1869043e560?w=2000&q=80",
      title: "Compassionate Healthcare",
      subtitle: "Our dedicated team provides personalized care for your faster recovery."
    },
    {
      videoUrl: "/video1.mp4?v=3",
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
             <div className="absolute inset-0 bg-black/40 pointer-events-none" /> {/* Dark Overlay for text readability */}
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
          { label: 'Mon-Fri / 10 AM-4 PM Sat-Sun', value: '9 AM - 8 PM', icon: Clock },
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
        
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-0">
          {SERVICES.slice(0, 8).map((srv, i) => {
            const Icon = ICON_MAP[srv.iconName] || Activity;
            const COLORS = [
              { bg: 'bg-blue-50/60', border: 'border-blue-100', iconBg: 'bg-blue-100', iconText: 'text-blue-600', hoverFrom: 'from-blue-500', hoverTo: 'to-indigo-600', shadow: 'hover:shadow-blue-500/20' },
              { bg: 'bg-teal-50/60', border: 'border-teal-100', iconBg: 'bg-teal-100', iconText: 'text-teal-600', hoverFrom: 'from-teal-400', hoverTo: 'to-emerald-500', shadow: 'hover:shadow-teal-500/20' },
              { bg: 'bg-orange-50/60', border: 'border-orange-100', iconBg: 'bg-orange-100', iconText: 'text-orange-600', hoverFrom: 'from-orange-400', hoverTo: 'to-rose-500', shadow: 'hover:shadow-orange-500/20' },
              { bg: 'bg-purple-50/60', border: 'border-purple-100', iconBg: 'bg-purple-100', iconText: 'text-purple-600', hoverFrom: 'from-purple-500', hoverTo: 'to-fuchsia-600', shadow: 'hover:shadow-purple-500/20' },
            ];
            const theme = COLORS[i % COLORS.length];

            return (
              <button 
                key={i} 
                onClick={() => onNavigate('services')} 
                className={`relative overflow-hidden text-left ${theme.bg} border ${theme.border} rounded-3xl p-6 hover:shadow-xl ${theme.shadow} hover:-translate-y-1 transition-all duration-500 group flex flex-col`}
              >
                {/* Subtle light orb */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/60 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                <div className="relative z-10 flex flex-col h-full w-full">
                  <div className={`w-14 h-14 ${theme.iconBg} ${theme.iconText} rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:${theme.hoverFrom} group-hover:${theme.hoverTo} group-hover:text-white transition-all duration-500`}>
                    <Icon size={26} className="transition-transform duration-500 group-hover:-rotate-6" />
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-[17px] mb-2 group-hover:text-slate-900 transition-colors duration-300 line-clamp-1">{srv.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-2 flex-1">{srv.description}</p>
                  
                  <div className={`mt-5 flex items-center ${theme.iconText} text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out`}>
                    Explore <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
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
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [doctors, setDoctors] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const apiUrl = getApiBaseUrl();
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

  const displayDoctors = doctors.length > 0 ? doctors : DOCTORS;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900">Meet Your Doctors</h1>
        <p className="text-lg text-slate-600">Expert physicians with international fellowships and decades of experience.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {(isExpanded ? displayDoctors : displayDoctors.slice(0, 2)).map((doc, i) => {
          const defaultImage = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80";
          const img = doc.profile_pic_url || doc.imageUrl || defaultImage;

          const COLORS = [
            { bg: 'bg-blue-50/60', border: 'border-blue-100', iconBg: 'bg-blue-100', iconText: 'text-blue-600', shadow: 'hover:shadow-blue-500/20' },
            { bg: 'bg-teal-50/60', border: 'border-teal-100', iconBg: 'bg-teal-100', iconText: 'text-teal-600', shadow: 'hover:shadow-teal-500/20' },
            { bg: 'bg-orange-50/60', border: 'border-orange-100', iconBg: 'bg-orange-100', iconText: 'text-orange-600', shadow: 'hover:shadow-orange-500/20' },
            { bg: 'bg-purple-50/60', border: 'border-purple-100', iconBg: 'bg-purple-100', iconText: 'text-purple-600', shadow: 'hover:shadow-purple-500/20' },
          ];
          const theme = COLORS[i % COLORS.length];
          const qualificationsList: string[] = Array.isArray(doc.qualifications) 
            ? doc.qualifications 
            : (doc.qualification ? doc.qualification.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
          
          const fellowshipsList: string[] = Array.isArray(doc.fellowships) 
            ? doc.fellowships 
            : [];
            
          const specialtiesList: string[] = Array.isArray(doc.specialties) 
            ? doc.specialties 
            : (doc.specialization ? doc.specialization.split(',').map((s: string) => s.trim()).filter(Boolean) : []);

          return (
            <div key={i} className={`relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl ${theme.shadow} transition-all duration-500 border border-slate-100 flex flex-col group hover:-translate-y-1.5`}>
              {/* Top Colored Section */}
              <div className={`relative pt-6 pb-4 px-5 ${theme.bg} flex flex-col items-center text-center overflow-hidden border-b ${theme.border}`}>
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/60 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                {/* Consultation Type Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className={`inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold ${theme.iconText} border border-white shadow-sm`}>
                    {(doc.consultation_type || doc.consultationType || '').includes('Online') ? <Activity size={10} /> : <Building2 size={10} />}
                    {doc.consultation_type || doc.consultationType}
                  </span>
                </div>

                {/* Circular Avatar */}
                <div className="relative w-20 h-20 mb-3 z-10 mt-3">
                  <img src={img} alt={doc.name} className="w-full h-full object-cover object-top rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-0.5 right-0.5 bg-green-500 text-white text-[8px] font-bold p-1 rounded-full flex items-center shadow-md border border-white">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-0.5 group-hover:text-slate-900 transition-colors">{doc.full_name || doc.name}</h3>
                  <p className={`${theme.iconText} font-semibold text-xs`}>{doc.designation || doc.role}</p>
                </div>
              </div>

              {/* Bottom Information Section */}
              <div className="p-5 flex flex-col flex-1 bg-white relative z-20 space-y-4">
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Qualifications</h3>
                  <ul className="space-y-1 text-xs text-slate-600 font-medium">
                    {qualificationsList.map((q: string, idx: number) => (
                      <li key={`q-${idx}`} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${theme.iconBg} mt-1.5 shrink-0`} />
                        {q}
                      </li>
                    ))}
                    {fellowshipsList.map((f: string, idx: number) => (
                      <li key={`f-${idx}`} className="flex items-start gap-2 text-slate-500">
                        <div className={`w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-3.5 border-t border-slate-100 flex-1">
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Specialises In</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {specialtiesList.map((spec: string, idx: number) => (
                      <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-650 px-2 py-0.5 rounded-full text-[11px] font-semibold shadow-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center items-center text-slate-500 text-xs border-t border-slate-100 pt-4 mt-auto">
                  <span className="flex items-center gap-1.5 font-bold bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100">
                    <Phone size={12} /> {doc.phone}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isExpanded && displayDoctors.length > 2 && (
        <div className="text-center mt-10">
          <button 
            onClick={() => setIsExpanded(true)} 
            className="border-2 border-blue-600 text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm hover:shadow-md"
          >
            View All Doctors
          </button>
        </div>
      )}
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
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    const handleSelectSpecialty = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const specialtyName = customEvent.detail;
      if (!specialtyName) return;

      const service = SERVICES.find(srv => {
        const titleLower = srv.title.toLowerCase();
        const searchLower = specialtyName.toLowerCase();
        return titleLower.includes(searchLower) || 
               searchLower.includes(titleLower) ||
               (searchLower.includes('paediatric') && titleLower.includes('paediatric')) ||
               (searchLower.includes('critical') && titleLower.includes('critical'));
      });

      if (service) {
        const index = SERVICES.indexOf(service);
        if (index >= 8) {
          setIsExpanded(true);
        }
        setSelectedService(service);
      }
    };

    window.addEventListener('select-specialty', handleSelectSpecialty);
    return () => window.removeEventListener('select-specialty', handleSelectSpecialty);
  }, []);

  const displayedServices = isExpanded ? SERVICES : SERVICES.slice(0, 8);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 relative px-4 xl:px-0">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900">Centres of Clinical Excellence</h1>
        <p className="text-lg text-slate-600">World-class specialized care across multiple medical disciplines, driven by research and technology.</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedServices.map((srv, i) => {
          const Icon = ICON_MAP[srv.iconName] || Activity;
          const COLORS = [
            { bg: 'bg-blue-50/60', border: 'border-blue-100', iconBg: 'bg-blue-100', iconText: 'text-blue-600', hoverFrom: 'from-blue-500', hoverTo: 'to-indigo-600', shadow: 'hover:shadow-blue-500/20' },
            { bg: 'bg-teal-50/60', border: 'border-teal-100', iconBg: 'bg-teal-100', iconText: 'text-teal-600', hoverFrom: 'from-teal-400', hoverTo: 'to-emerald-500', shadow: 'hover:shadow-teal-500/20' },
            { bg: 'bg-orange-50/60', border: 'border-orange-100', iconBg: 'bg-orange-100', iconText: 'text-orange-600', hoverFrom: 'from-orange-400', hoverTo: 'to-rose-500', shadow: 'hover:shadow-orange-500/20' },
            { bg: 'bg-purple-50/60', border: 'border-purple-100', iconBg: 'bg-purple-100', iconText: 'text-purple-600', hoverFrom: 'from-purple-500', hoverTo: 'to-fuchsia-600', shadow: 'hover:shadow-purple-500/20' },
          ];
          const theme = COLORS[i % COLORS.length];

          return (
            <div 
              key={i} 
              onClick={() => setSelectedService(srv)} 
              className={`relative overflow-hidden cursor-pointer ${theme.bg} border ${theme.border} rounded-3xl p-6 hover:shadow-xl ${theme.shadow} hover:-translate-y-1 transition-all duration-500 group flex flex-col`}
            >
              {/* Subtle light orb */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/60 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10 flex flex-col h-full w-full">
                <div className={`w-14 h-14 ${theme.iconBg} ${theme.iconText} rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:${theme.hoverFrom} group-hover:${theme.hoverTo} group-hover:text-white transition-all duration-500`}>
                  <Icon size={26} className="transition-transform duration-500 group-hover:-rotate-6" />
                </div>
                
                <h3 className="font-bold text-slate-800 text-[17px] mb-2 group-hover:text-slate-900 transition-colors duration-300">{srv.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium flex-1">{srv.description}</p>
                
                <div className={`mt-5 flex items-center ${theme.iconText} text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out`}>
                  View Details <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {!isExpanded && SERVICES.length > 8 && (
        <div className="text-center mt-12">
          <button 
            onClick={() => setIsExpanded(true)}
            className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-3 px-8 rounded-full transition-all border border-blue-200"
          >
            View All Specialties <ChevronRight size={20} />
          </button>
        </div>
      )}
      
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
  const { settings, isLoading } = useSettings();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900">Contact Us</h1>
        <p className="text-lg text-slate-600">We are here to help. Reach out for any medical assistance.</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Building2 size={24}/></div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Clinic Address</h3>
              <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">
                {settings?.physical_address || CLINIC_INFO.address}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-green-50 text-green-600 p-3 rounded-xl"><Phone size={24}/></div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Contact Info</h3>
              <p className="text-slate-600 mt-1">Phone: {settings?.phone || CLINIC_INFO.phone}<br/>Email: {settings?.email || "info@elsanpublichealth.com"}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl"><Calendar size={24}/></div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Working Hours</h3>
              <p className="text-slate-600 mt-1">{settings?.working_hours_mon_fri || 'Mon - Sat: 8:30 AM - 7:30 PM'}<br/>{settings?.working_hours_sat_sun || 'Sun: 9:00 AM - 1:00 PM'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-200 rounded-2xl overflow-hidden shadow-inner h-[280px] sm:h-[350px] md:h-[400px] flex items-center justify-center relative">
          <iframe 
            src={settings?.google_maps_url || "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Elsan%20Clinic,%2056/1,%20Perumal%20Koil%20St,%20Saidapet%20(West),%20Chennai,%20Tamil%20Nadu%20600015+(Elsan%20Clinic)&t=&z=16&ie=UTF8&iwloc=B&output=embed"} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full"
          ></iframe>
        </div>
      </div>
      )}
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
        const apiUrl = getApiBaseUrl();
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
      const apiUrl = getApiBaseUrl();
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
