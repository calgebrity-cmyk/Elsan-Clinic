"use client";

import { useState } from "react";
import { Building2, MessageSquare, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("clinic");

  const tabs = [
    { id: "clinic", label: "Clinic Profile", icon: Building2 },
    { id: "whatsapp", label: "WhatsApp Integration", icon: MessageSquare },
    { id: "system", label: "System Preferences", icon: MonitorSmartphone },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500">Manage your clinic configurations and integrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === tab.id 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === "clinic" && (
            <Card>
              <CardHeader>
                <CardTitle>Clinic Profile</CardTitle>
                <CardDescription>Update your clinic's public-facing information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input id="clinicName" defaultValue="Elsan Clinic" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Contact Number</Label>
                    <Input id="phone" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="contact@elsan.com" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" defaultValue="123 Health Avenue, Medical District" />
                </div>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "whatsapp" && (
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Business API</CardTitle>
                <CardDescription>Configure Meta WhatsApp integration for digital prescriptions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-green-900">Connection Status</h4>
                    <p className="text-sm text-green-700">Successfully connected to Meta API.</p>
                  </div>
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneId">Phone Number ID</Label>
                  <Input id="phoneId" defaultValue="123456789012345" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="token">Permanent Access Token</Label>
                  <Input id="token" defaultValue="EAAxyz123..." type="password" />
                </div>
                <div className="flex gap-4 mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">Save Configuration</Button>
                  <Button variant="outline">Test Connection</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System and Security tabs would follow similarly */}
          {(activeTab === "system" || activeTab === "security") && (
            <Card>
              <CardHeader>
                <CardTitle>{tabs.find(t => t.id === activeTab)?.label}</CardTitle>
                <CardDescription>Configuration options for {activeTab}.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">Settings form fields go here...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
