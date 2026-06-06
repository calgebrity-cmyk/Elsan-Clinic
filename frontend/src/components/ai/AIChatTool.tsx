"use client";

import { useState } from 'react';

interface AIChatToolProps {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  desc: string;
  systemPrompt: string;
  initialMessage: string;
}

export default function AIChatTool({ title, icon: Icon, color, desc, systemPrompt, initialMessage }: AIChatToolProps) {
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
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch {
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
