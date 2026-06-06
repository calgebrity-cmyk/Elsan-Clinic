"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Activity, Calculator, Apple, FileBarChart, ChevronRight } from 'lucide-react';

export default function AIToolsView() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    { id: 'symptom', icon: Activity, title: 'AI Symptom Analyser', desc: 'Describe how you feel for a clinical intake and risk analysis.' },
    { id: 'calculator', icon: Calculator, title: 'Medical Calculators', desc: 'BMI, BP Risk, IDRS, HbA1c, Water Intake & Heart Rate.' },
    { id: 'diet', icon: Apple, title: 'AI Diet Planner', desc: 'Personalised diet and lifestyle plans based on your profile.' },
    { id: 'lab', icon: FileBarChart, title: 'Lab Test Explainer', desc: 'Understand your blood reports and test results perfectly.' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-8 md:p-12 shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 backdrop-blur-sm">
            <BrainCircuit size={32} className="text-teal-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">ELSAN AI Tools</h1>
          <p className="text-blue-200 text-lg">Powered by Gemini 3.1 Ultra. Intelligent health analysis, risk prediction, and personalised care.</p>
        </div>
      </div>

      {!activeTool ? (
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map(tool => (
            <button 
              key={tool.id} 
              onClick={() => setActiveTool(tool.id)}
              className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-blue-400 hover:shadow-lg transition text-left group flex items-start gap-6"
            >
              <div className="bg-blue-50 text-blue-600 p-4 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition">
                <tool.icon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{tool.title}</h3>
                <p className="text-slate-600 mb-4">{tool.desc}</p>
                <div className="text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
                  Launch Tool <ChevronRight size={16}/>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-md">
          <button onClick={() => setActiveTool(null)} className="text-sm font-semibold text-slate-500 hover:text-blue-600 mb-6 flex items-center gap-1 transition">
             ← Back to AI Tools
          </button>
          
          {activeTool === 'symptom' && (
            <AIChatTool 
              title="Symptom Analyser" 
              icon={Activity} 
              color="blue"
              desc="Describe how you are feeling, how long it has lasted, and severity."
              systemPrompt="You are a medical AI assistant for Elsan Clinic. Your job is to perform a clinical intake and risk analysis based on the patient's symptoms. Ask clarifying questions if necessary, and advise them on potential risks and whether they should seek immediate medical attention. Keep your responses concise, empathetic, and professional."
              initialMessage="Hello! I am ELSAN AI. Please describe your symptoms. \n\n⚠️ **Note:** If you are experiencing chest pain, difficulty breathing, or severe bleeding, call 108 immediately."
            />
          )}
          {activeTool === 'calculator' && <BMICalculator />}
          {activeTool === 'diet' && (
            <AIChatTool 
              title="AI Diet & Lifestyle Planner" 
              icon={Apple} 
              color="green"
              desc="Get personalised diet and lifestyle plans based on your profile."
              systemPrompt="You are an expert AI nutritionist and lifestyle coach for Elsan Clinic. Ask the user about their health goals, current diet, allergies, and lifestyle, and provide a personalized, realistic diet and lifestyle plan. Be encouraging, clear, and structure your plans with bullet points or tables where helpful."
              initialMessage="Welcome to the AI Diet & Lifestyle Planner! To get started, could you tell me a little about your health goals, current weight/height, and any dietary preferences or restrictions?"
            />
          )}
          {activeTool === 'lab' && (
            <AIChatTool 
              title="Lab Test Explainer" 
              icon={FileBarChart} 
              color="indigo"
              desc="Upload or type your test results to decode them."
              systemPrompt="You are a clinical AI assistant for Elsan Clinic specializing in explaining laboratory test results to patients. The patient will provide their test names, values, and reference ranges. Explain what the tests mean in simple, easy-to-understand language. Do not make a definitive diagnosis, but explain what high/low levels generally indicate and suggest when they should consult their doctor."
              initialMessage="Hello! I can help you understand your lab reports. Please type in the test names, your results, and the normal reference ranges from your report."
            />
          )}
        </div>
      )}
    </motion.div>
  );
}

function AIChatTool({ title, icon: Icon, color, desc, systemPrompt, initialMessage }: any) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: initialMessage }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Assuming backend is running on port 8000
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          system_prompt: systemPrompt
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        const errData = await response.json().catch(() => null);
        const errMsg = errData?.detail ? `Server Error: ${errData.detail}` : "Sorry, I'm having trouble connecting to the server. Please try again later.";
        setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please ensure the backend server is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const colorClass = color === 'green' ? 'text-green-600' : color === 'indigo' ? 'text-indigo-600' : 'text-blue-600';
  const bgClass = color === 'green' ? 'bg-green-600' : color === 'indigo' ? 'bg-indigo-600' : 'bg-blue-600';
  const focusClass = color === 'green' ? 'focus:border-green-500 focus:ring-green-500' : color === 'indigo' ? 'focus:border-indigo-500 focus:ring-indigo-500' : 'focus:border-blue-500 focus:ring-blue-500';

  return (
    <div className="space-y-6 flex flex-col h-[600px]">
      <div className="border-b border-slate-100 pb-4 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Icon className={colorClass}/> {title}
        </h2>
        <p className="text-slate-600 mt-1">{desc}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-700' : bgClass + ' text-white'}`}>
              {msg.role === 'user' ? 'U' : 'AI'}
            </div>
            <div className={`max-w-[80%] p-4 rounded-xl shadow-sm border ${msg.role === 'user' ? 'bg-slate-100 border-slate-200 rounded-tr-none' : 'bg-white border-slate-200 rounded-tl-none'}`}>
              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{__html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}}></p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgClass} text-white`}>AI</div>
             <div className="max-w-[80%] p-4 rounded-xl shadow-sm border bg-white border-slate-200 rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
             </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 shrink-0 pt-2 border-t border-slate-100">
        <input 
          type="text" 
          placeholder="Type your message here..." 
          className={`flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 ${focusClass}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading || !input.trim()} 
          className={`${bgClass} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition`}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function BMICalculator() {
  const [h, setH] = useState(170);
  const [w, setW] = useState(65);
  const bmi = (w / ((h/100)*(h/100))).toFixed(1);
  return (
    <div className="max-w-md mx-auto space-y-6 py-8">
      <h2 className="text-2xl font-bold text-center text-slate-800">BMI Calculator</h2>
      
      <div className="space-y-4">
        <div>
          <label className="flex justify-between font-medium text-slate-700 mb-1"><span>Height (cm)</span><span>{h} cm</span></label>
          <input type="range" min="100" max="220" value={h} onChange={e=>setH(parseInt(e.target.value))} className="w-full accent-blue-600"/>
        </div>
        <div>
          <label className="flex justify-between font-medium text-slate-700 mb-1"><span>Weight (kg)</span><span>{w} kg</span></label>
          <input type="range" min="30" max="150" value={w} onChange={e=>setW(parseInt(e.target.value))} className="w-full accent-blue-600"/>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center shadow-sm">
        <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider mb-2">Calculated BMI</p>
        <p className="text-5xl font-black text-blue-900">{bmi}</p>
        <p className="text-blue-700 font-medium mt-3 bg-blue-100 py-1 px-4 rounded-full inline-block">
          {parseFloat(bmi) < 18.5 ? "Underweight" : parseFloat(bmi) < 25 ? "Healthy Weight" : parseFloat(bmi) < 30 ? "Overweight" : "Obese"}
        </p>
      </div>
    </div>
  );
}
