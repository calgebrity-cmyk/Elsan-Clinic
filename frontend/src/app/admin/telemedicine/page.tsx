"use client";

import { useState } from "react";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Settings, Users, MonitorUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TelemedicinePage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Telemedicine Consultation</h1>
          <p className="text-sm text-zinc-500">Live Video Consultation with patients.</p>
        </div>
        <Button onClick={() => setIsCallActive(!isCallActive)} variant={isCallActive ? "destructive" : "default"}>
          {isCallActive ? "End Consultation" : "Start Next Consultation"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Main Video Area */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card className="flex-1 bg-zinc-900 border-zinc-800 relative overflow-hidden flex items-center justify-center">
            {!isCallActive ? (
              <div className="text-zinc-500 flex flex-col items-center">
                <Video size={48} className="mb-4 opacity-50" />
                <p>Waiting for consultation to begin...</p>
              </div>
            ) : (
              <>
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80" 
                  alt="Patient" 
                  className="w-full h-full object-cover opacity-90"
                />
                
                {/* Self View */}
                <div className="absolute bottom-6 right-6 w-48 h-32 bg-black rounded-lg overflow-hidden border-2 border-zinc-700 shadow-2xl">
                  {isVideoOff ? (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-400">
                      <VideoOff size={24} />
                    </div>
                  ) : (
                    <img 
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80" 
                      alt="Doctor" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-full hover:bg-white/20 text-white ${isMuted ? 'bg-red-500/80 hover:bg-red-500/90' : ''}`}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-full hover:bg-white/20 text-white ${isVideoOff ? 'bg-red-500/80 hover:bg-red-500/90' : ''}`}
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20 text-white">
                    <MonitorUp size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20 text-white">
                    <Settings size={20} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-full w-12 h-12 shadow-lg"
                    onClick={() => setIsCallActive(false)}
                  >
                    <PhoneOff size={20} />
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="p-4 flex-1 overflow-auto">
            <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Users size={16} /> Patient Details
            </h3>
            
            {isCallActive ? (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Name</p>
                  <p className="font-medium">Sarah Jenkins</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Age / Gender</p>
                  <p className="font-medium">34 / Female</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Chief Complaint</p>
                  <p className="font-medium">Persistent migraine for 3 days</p>
                </div>
                <div className="pt-4 border-t border-zinc-100">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Previous Records</p>
                  <Button variant="outline" className="w-full justify-start text-xs h-8 mb-2">
                    Blood Report (Jan 2026)
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-8">
                    Past Prescription
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-zinc-500 text-sm mt-8">
                Select a patient from the queue to view details.
              </div>
            )}
          </Card>

          <Card className="p-4 h-64">
             <h3 className="font-semibold text-zinc-900 mb-4">Upcoming Queue</h3>
             <div className="space-y-3">
               {[
                 { name: "Michael Chen", time: "10:30 AM" },
                 { name: "Emma Thompson", time: "11:00 AM" },
                 { name: "David Miller", time: "11:30 AM" },
               ].map((p, i) => (
                 <div key={i} className="flex justify-between items-center text-sm p-2 bg-zinc-50 rounded-lg">
                   <span className="font-medium text-zinc-700">{p.name}</span>
                   <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{p.time}</span>
                 </div>
               ))}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
