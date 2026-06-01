"use client";

import { useState, type ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { PeriodProvider } from "./period-context";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PeriodProvider>
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </PeriodProvider>
  );
}
