"use client";

import { MessageSquare, Send, X, Calendar, User, Info, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { DOCTORS, CLINIC_INFO } from "../data";
import { getApiBaseUrl } from "../lib/api-config";

type Message = {
  id: string;
  role: 'bot' | 'user';
  text: string;
  options?: string[];
};

type ChatState = 'idle' | 'booking_name' | 'booking_phone' | 'booking_age' | 'booking_gender' | 'booking_doctor' | 'booking_date' | 'booking_time' | 'booking_notes';

const TRANSLATIONS = {
  en: {
    init: `Hello! Welcome to Elsan Clinic.\n\n📍 Location: 56/1 & 56/2, Perumal Koil Street, Saidapet (West), Chennai - 15\n📞 Phone: +91 9444184977\n\nHow can I assist you today?`,
    optBook: 'Book Appointment', optWhatsApp: 'WhatsApp Us', optMenu: 'Main Menu',
    cancel: 'Booking cancelled. How else can I help you?',
    askPhone: 'Thank you, {name}. What is your phone number?',
    askAge: 'Got it. What is your age?', invalidAge: 'Please enter a valid number for your age.',
    askGender: 'Thanks. Please select your gender.', optMale: 'Male', optFemale: 'Female', optOther: 'Other',
    askDoc: 'Which doctor would you like to consult?', optAnyDoc: 'Any Available Doctor',
    askDate: 'When would you like to visit? Select an option or type a date (YYYY-MM-DD).',
    askTime: 'Great. What time would you prefer?',
    askNotes: 'Almost done. Please describe any symptoms or reason for visit (or type "None").',
    success: '✅ Appointment Confirmed!\n\nYour appointment with {doc} is scheduled for {date} at {time}. Our team will contact you at {phone}.\n\nThank you for choosing Elsan Clinic!',
    err: 'Sorry, there was an error processing your appointment.',
    netErr: 'Sorry, we couldn\'t connect to our servers.',
    redirectWa: 'I am redirecting you to our official WhatsApp support...',
    startBook: 'I can help you book an appointment right here! To start, may I know your full name?',
    fallback: 'I\'m a virtual assistant. I can help you book an appointment, find a doctor, or give you clinic info. How can I help?'
  },
  ta: {
    init: `வணக்கம்! எல்சன் கிளினிக்கிற்கு உங்களை வரவேற்கிறோம்.\n\n📍 முகவரி: 56/1 & 56/2, பெருமாள் கோவில் தெரு, சைதாப்பேட்டை (மேற்கு), சென்னை - 15\n📞 தொலைபேசி: +91 9444184977\n\nநான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`,
    optBook: 'முன்பதிவு செய்', optWhatsApp: 'வாட்ஸ்அப்', optMenu: 'முக்கிய மெனு',
    cancel: 'முன்பதிவு ரத்து செய்யப்பட்டது. வேறு என்ன உதவி தேவை?',
    askPhone: 'நன்றி, {name}. உங்கள் தொலைபேசி எண் என்ன?',
    askAge: 'புரிந்தது. உங்கள் வயது என்ன?', invalidAge: 'தயவுசெய்து சரியான வயதை உள்ளிடவும்.',
    askGender: 'நன்றி. உங்கள் பாலினத்தை தேர்ந்தெடுக்கவும்.', optMale: 'ஆண்', optFemale: 'பெண்', optOther: 'மற்றவை',
    askDoc: 'நீங்கள் எந்த மருத்துவரை பார்க்க விரும்புகிறீர்கள்?', optAnyDoc: 'எந்த மருத்துவரும்',
    askDate: 'நீங்கள் எப்போது வர விரும்புகிறீர்கள்? ஒரு தேதியை தேர்ந்தெடுக்கவும் (YYYY-MM-DD).',
    askTime: 'சிறப்பு. உங்களுக்கு எந்த நேரம் வசதியாக இருக்கும்?',
    askNotes: 'கிட்டத்தட்ட முடிந்தது. உங்கள் அறிகுறிகளை விவரிக்கவும் (அல்லது "இல்லை" என தட்டச்சு செய்யவும்).',
    success: '✅ முன்பதிவு உறுதி செய்யப்பட்டது!\n\nஉங்கள் முன்பதிவு {doc} உடன் {date} அன்று {time} மணிக்கு திட்டமிடப்பட்டுள்ளது. எங்கள் குழு உங்களை {phone} என்ற எண்ணில் தொடர்பு கொள்ளும்.\n\nஎல்சன் கிளினிக்கை தேர்ந்தெடுத்ததற்கு நன்றி!',
    err: 'மன்னிக்கவும், உங்கள் முன்பதிவைச் செயலாக்குவதில் பிழை ஏற்பட்டது.',
    netErr: 'மன்னிக்கவும், எங்கள் சர்வருடன் இணைக்க முடியவில்லை.',
    redirectWa: 'வாட்ஸ்அப் ஆதரவிற்கு உங்களை திருப்பி விடுகிறேன்...',
    startBook: 'உங்கள் முன்பதிவை நான் இங்கேயே செய்ய முடியும்! தொடங்க, உங்கள் முழு பெயரைக் கூற முடியுமா?',
    fallback: 'நான் ஒரு மெய்நிகர் உதவியாளர். முன்பதிவு செய்ய அல்லது தகவல்களைப் பெற நான் உங்களுக்கு உதவ முடியும்.'
  }
};

const getInitialMessage = (lang: 'en' | 'ta'): Message => ({
  id: 'init',
  role: 'bot',
  text: TRANSLATIONS[lang].init,
  options: [TRANSLATIONS[lang].optBook, TRANSLATIONS[lang].optWhatsApp]
});

const getNextDateStr = (daysOffset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

const formatTime12to24 = (timeStr: string): string => {
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3];
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  return timeStr;
};

const formatTime24to12 = (timeStr: string): string => {
  const clean = timeStr.trim();
  const match = clean.match(/^(\d{2}):(\d{2})$/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  }
  return timeStr;
};

export default function FloatingContact() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [messages, setMessages] = useState<Message[]>([getInitialMessage('en')]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'init') {
      setMessages([getInitialMessage(language)]);
    }
  }, [language]);
  
  // State machine for booking flow
  const [chatState, setChatState] = useState<ChatState>('idle');
  const [bookingData, setBookingData] = useState<any>({});

  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const handleWhatsApp = () => {
    const text = "Hi Elsan Clinic, could you please provide your clinic address and contact details?\n\nAlso, I would like to book an appointment. Here are my details:\n\n*Name:*\n*Age:*\n*Phone:*\n*Doctor Preference:*\n*Preferred Date & Time:*\n*Symptoms/Notes:*";
    window.open(`${CLINIC_INFO.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const processInput = async (text: string): Promise<Message> => {
    const lower = text.toLowerCase();
    const msgId = Date.now().toString();
    const t = TRANSLATIONS[language];

    // Check if user wants to cancel booking
    if (chatState !== 'idle' && (lower === 'cancel' || lower === 'menu' || lower === 'ரத்து' || lower.includes('மெனு'))) {
      setChatState('idle');
      setBookingData({});
      return { ...getInitialMessage(language), id: msgId, text: t.cancel };
    }

    // Booking Flow State Machine
    if (chatState === 'booking_name') {
      setBookingData((prev: any) => ({ ...prev, full_name: text }));
      setChatState('booking_phone');
      return { id: msgId, role: 'bot', text: t.askPhone.replace('{name}', text) };
    }

    if (chatState === 'booking_phone') {
      setBookingData((prev: any) => ({ ...prev, phone: text }));
      setChatState('booking_age');
      return { id: msgId, role: 'bot', text: t.askAge };
    }

    if (chatState === 'booking_age') {
      const age = parseInt(text.replace(/[^0-9]/g, ''));
      if (isNaN(age)) {
        return { id: msgId, role: 'bot', text: t.invalidAge };
      }
      setBookingData((prev: any) => ({ ...prev, age }));
      setChatState('booking_gender');
      return { id: msgId, role: 'bot', text: t.askGender, options: [t.optMale, t.optFemale, t.optOther] };
    }

    if (chatState === 'booking_gender') {
      setBookingData((prev: any) => ({ ...prev, gender: text }));
      setChatState('booking_doctor');
      return { 
        id: msgId, 
        role: 'bot', 
        text: t.askDoc,
        options: [t.optAnyDoc, ...DOCTORS.slice(0,3).map(d => d.name)]
      };
    }

    if (chatState === 'booking_doctor') {
      setBookingData((prev: any) => ({ ...prev, doctor_name: text }));
      setChatState('booking_date');
      return { 
        id: msgId, 
        role: 'bot', 
        text: t.askDate,
        options: [getNextDateStr(0), getNextDateStr(1), getNextDateStr(2)]
      };
    }

    if (chatState === 'booking_date') {
      let dateVal = text;
      if (lower.includes('today') || lower.includes('இன்று')) dateVal = getNextDateStr(0);
      else if (lower.includes('tomorrow') || lower.includes('நாளை')) dateVal = getNextDateStr(1);
      
      setBookingData((prev: any) => ({ ...prev, appointment_date: dateVal }));
      setChatState('booking_time');
      return { 
        id: msgId, 
        role: 'bot', 
        text: t.askTime,
        options: ['10:00 AM', '02:00 PM', '06:00 PM']
      };
    }

    if (chatState === 'booking_time') {
      try {
        const apiUrl = getApiBaseUrl();
        const docName = encodeURIComponent(bookingData.doctor_name || '');
        const dateVal = encodeURIComponent(bookingData.appointment_date || '');
        const convertedTime = formatTime12to24(text);
        const timeVal = encodeURIComponent(convertedTime);
        
        const res = await fetch(`${apiUrl}/appointments/public/check-availability?doctor_name=${docName}&date=${dateVal}&time=${timeVal}`);
        if (res.ok) {
          const data = await res.json();
          if (!data.available) {
            return {
              id: msgId,
              role: 'bot',
              text: language === 'ta' 
                ? 'மன்னிக்கவும், அந்த நேரத்தில் மருத்துவருக்கு வேறு முன்பதிவு உள்ளது. தயவுசெய்து வேறு நேரத்தை தேர்ந்தெடுக்கவும் (அல்லது தட்டச்சு செய்யவும்).' 
                : 'Sorry, the doctor already has an appointment at that time. Please choose or type another time.',
              options: ['10:00 AM', '02:00 PM', '06:00 PM']
            };
          }
        }
      } catch (err) {
        console.error("Availability check failed:", err);
      }

      setBookingData((prev: any) => ({ ...prev, appointment_time: formatTime12to24(text) }));
      setChatState('booking_notes');
      return { id: msgId, role: 'bot', text: t.askNotes };
    }

    if (chatState === 'booking_notes') {
      const finalData = { ...bookingData, notes: text };
      setChatState('idle'); // Reset state
      setBookingData({}); // Clear buffer

      try {
        const apiUrl = getApiBaseUrl();
        const res = await fetch(`${apiUrl}/appointments/public`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalData)
        });

        if (res.ok) {
          const successTxt = t.success
            .replace('{doc}', finalData.doctor_name)
            .replace('{date}', finalData.appointment_date)
            .replace('{time}', formatTime24to12(finalData.appointment_time))
            .replace('{phone}', finalData.phone);
          return { id: msgId, role: 'bot', text: successTxt, options: [t.optMenu] };
        } else {
          return { id: msgId, role: 'bot', text: t.err, options: [t.optMenu] };
        }
      } catch (err) {
        return { id: msgId, role: 'bot', text: t.netErr, options: [t.optMenu] };
      }
    }

    // Direct WhatsApp Redirect
    if (lower.includes('whatsapp') || lower.includes('வாட்ஸ்அப்')) {
      setTimeout(() => {
        handleWhatsApp();
      }, 1000);
      return { id: msgId, role: 'bot', text: t.redirectWa, options: [t.optMenu] };
    }

    // IDLE Flow Logic
    if (lower.includes('book') || lower.includes('appointment') || lower.includes('முன்பதிவு')) {
      setChatState('booking_name');
      return { id: msgId, role: 'bot', text: t.startBook };
    }
    
    if (lower.includes('doctor') || lower.includes('specialist') || lower.includes('find') || lower.includes('மருத்துவர்')) {
      const docNames = DOCTORS.map(d => `• ${d.name} (${d.specialties[0]})`).join('\n');
      const docTxt = language === 'en' 
        ? `Here are some of our top specialists:\n\n${docNames}\n\nWould you like to book a consultation?`
        : `எங்கள் சிறந்த நிபுணர்கள்:\n\n${docNames}\n\nமுன்பதிவு செய்ய விரும்புகிறீர்களா?`;
      return {
        id: msgId, role: 'bot', text: docTxt,
        options: [language === 'en' ? 'Yes, book appointment' : 'ஆம், முன்பதிவு செய்', t.optMenu]
      };
    }
    
    if (lower.includes('about') || lower.includes('clinic') || lower.includes('where') || lower.includes('location') || lower.includes('முகவரி') || lower.includes('கிளினிக்')) {
      const aboutTxt = language === 'en'
        ? `${CLINIC_INFO.name} - ${CLINIC_INFO.tagline}.\nEstablished ${CLINIC_INFO.established}.\n\n📍 Address: ${CLINIC_INFO.address}\n📞 Phone: ${CLINIC_INFO.phone}\n✉️ Email: info@elsanpublichealth.com\n\n🕒 Timings:\nMon-Fri: 9 AM - 8 PM\nSat-Sun: 10 AM - 4 PM`
        : `${CLINIC_INFO.name} - ${CLINIC_INFO.tagline}.\n\n📍 முகவரி: ${CLINIC_INFO.address}\n📞 தொலைபேசி: ${CLINIC_INFO.phone}\n✉️ மின்னஞ்சல்: info@elsanpublichealth.com`;
      return { id: msgId, role: 'bot', text: aboutTxt, options: [t.optBook, t.optWhatsApp, t.optMenu] };
    }

    if (lower.includes('back') || lower.includes('menu') || lower.includes('மெனு')) {
      return { ...getInitialMessage(language), id: msgId };
    }

    // Fallback logic
    return { id: msgId, role: 'bot', text: t.fallback, options: [t.optBook, t.optWhatsApp] };
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI thinking delay and process
    setTimeout(async () => {
      const response = await processInput(text);
      setIsTyping(false);
      setMessages(prev => [...prev, response]);
    }, 800);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 sm:gap-4 font-sans max-w-[calc(100vw-32px)] sm:max-w-none">
      {/* Chatbot Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[calc(100vw-32px)] sm:w-[380px] max-w-[380px] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden mb-2 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-4 text-white flex justify-between items-center shadow-md relative z-10">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <div className="relative">
                    <MessageSquare size={20} className="fill-white/20" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-teal-600"></div>
                  </div>
                  Elsan Assistant
                </h3>
                <p className="text-teal-50 text-[11px] mt-0.5 font-light opacity-90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online • AI Assistant
                </p>
              </div>
              <div className="flex gap-2">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as 'en'|'ta')}
                  className="bg-teal-800/50 border border-teal-600/50 text-[11px] px-2 py-1 rounded outline-none cursor-pointer"
                >
                  <option value="en">EN</option>
                  <option value="ta">தமிழ்</option>
                </select>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={chatRef}
              className="h-[380px] bg-slate-50 p-4 flex flex-col gap-4 overflow-y-auto scroll-smooth"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-full`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-teal-600 text-white rounded-tr-sm ml-8' 
                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm mr-8 whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                  
                  {/* Options Chips */}
                  {msg.options && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2 mt-3"
                    >
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(opt)}
                          className="bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors shadow-sm flex items-center gap-1.5 active:scale-95"
                        >
                          {opt.includes('Book') || opt.includes('Appointment') ? <Calendar size={12} /> : 
                           opt.includes('Doctor') ? <User size={12} /> : 
                           opt.includes('Clinic') ? <Info size={12} /> : null}
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center h-10">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate-100 bg-white relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }} 
                className="relative flex items-center gap-2"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={chatState !== 'idle' ? "Type or click 'Cancel'..." : "Type your message..."} 
                  className="flex-1 bg-slate-50 border border-slate-200 pl-4 pr-10 py-3 rounded-full text-[13px] outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 w-8 h-8 flex items-center justify-center bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons */}
      <div className="flex flex-col gap-4">
        {/* Chatbot Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-colors relative group ${isChatOpen ? 'bg-slate-800 hover:bg-slate-700' : 'bg-teal-600 hover:bg-teal-500'}`}
          aria-label={isChatOpen ? "Close chat" : "Live Assistant"}
        >
          {isChatOpen ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <Bot size={28} className="animate-pulse" />
          )}
          {!isChatOpen && (
            <span className="absolute right-16 bg-slate-900/90 backdrop-blur text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none border border-white/10">
              Live Assistant
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
