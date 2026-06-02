"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Shield, UserX, UserCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_STAFF = [
  { id: "1", name: "Alice Johnson", email: "alice@elsan.com", phone: "+1234567890", role: "RECEPTIONIST", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@elsan.com", phone: "+1987654321", role: "SUPER_ADMIN", status: "Active" },
  { id: "3", name: "Charlie Brown", email: "charlie@elsan.com", phone: "+1122334455", role: "RECEPTIONIST", status: "Inactive" },
];

export function StaffTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = MOCK_STAFF.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-white"
          />
        </div>
        <Link href="/admin/staff/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Add Staff
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                  No staff members found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${staff.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {staff.role === 'SUPER_ADMIN' ? <Shield className="w-3 h-3 mr-1" /> : <UserCheck className="w-3 h-3 mr-1" />}
                      {staff.role.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${staff.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-800'}`}>
                      {staff.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 p-0")}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/admin/staff/${staff.id}/edit`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        </Link>
                        {staff.status === 'Active' ? (
                          <DropdownMenuItem className="cursor-pointer text-yellow-600">
                            <UserX className="mr-2 h-4 w-4" /> Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="cursor-pointer text-green-600">
                            <UserCheck className="mr-2 h-4 w-4" /> Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
