"use client";

import { Bell, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
      <Button variant="outline" size="icon" className="shrink-0 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="search"
              placeholder="Search patients, doctors..."
              className="w-full appearance-none bg-zinc-50 border-none pl-8 shadow-none h-9 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-zinc-300 md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5 text-zinc-600" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
      <Button variant="secondary" size="icon" className="rounded-full">
        <User className="h-5 w-5 text-zinc-600" />
        <span className="sr-only">Toggle user menu</span>
      </Button>
    </header>
  );
}
