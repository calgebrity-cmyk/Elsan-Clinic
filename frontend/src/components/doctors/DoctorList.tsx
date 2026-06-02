"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, MapPin, Clock, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_DOCTORS = [
  {
    id: "1",
    name: "Dr. Sarah Smith",
    specialization: "Cardiologist",
    qualification: "MBBS, MD",
    experience: "12 Years",
    fee: "₹800",
    timings: "10:00 AM - 02:00 PM",
    status: "Active",
    image: "https://ui-avatars.com/api/?name=Sarah+Smith&background=random"
  },
  {
    id: "2",
    name: "Dr. John Doe",
    specialization: "Dermatologist",
    qualification: "MBBS, DDVL",
    experience: "8 Years",
    fee: "₹600",
    timings: "04:00 PM - 08:00 PM",
    status: "Active",
    image: "https://ui-avatars.com/api/?name=John+Doe&background=random"
  }
];

export function DoctorList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = MOCK_DOCTORS.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search doctors by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-white"
          />
        </div>
        <Link href="/admin/doctors/create">
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Doctor
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-zinc-500 bg-white rounded-xl border">
            No doctors found matching your search.
          </div>
        ) : (
          filteredDoctors.map(doc => (
            <Card key={doc.id} className="overflow-hidden bg-white hover:shadow-md transition-all">
              <div className="h-24 bg-gradient-to-r from-blue-50 to-blue-100 relative">
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "absolute top-2 right-2 h-8 w-8 bg-white/50 hover:bg-white text-zinc-700 rounded-full")}>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/admin/doctors/${doc.id}/edit`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="px-6 relative pb-4">
                <div className="flex justify-between items-end -mt-10 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    className="w-20 h-20 rounded-full border-4 border-white shadow-sm bg-white"
                  />
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-800'}`}>
                    {doc.status}
                  </span>
                </div>
                
                <CardTitle className="text-lg mb-1">{doc.name}</CardTitle>
                <p className="text-sm text-blue-600 font-medium mb-4">{doc.specialization}</p>
                
                <div className="space-y-2 text-sm text-zinc-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                    <span>{doc.qualification} • {doc.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    <span>{doc.timings}</span>
                  </div>
                </div>
              </div>
              <CardFooter className="bg-zinc-50 border-t px-6 py-3 flex justify-between items-center text-sm">
                <span className="text-zinc-500">Consultation Fee</span>
                <span className="font-semibold text-zinc-900">{doc.fee}</span>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
