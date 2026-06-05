"use client";

import { useState, type ReactNode } from "react";
import { Header } from "./header";
import { PeriodProvider } from "./period-context";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PeriodProvider>
      <div className="flex min-h-screen bg-[var(--ftime-ink)]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="mesh-bg dot-grid flex min-h-screen min-w-0 flex-1 flex-col max-lg:rounded-none lg:rounded-tl-[32px] lg:shadow-[-8px_0_32px_rgba(0,0,0,0.15)]">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </PeriodProvider>
  );
}
