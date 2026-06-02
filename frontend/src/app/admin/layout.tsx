import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-zinc-50/20">
          {children}
        </main>
      </div>
    </div>
  );
}
