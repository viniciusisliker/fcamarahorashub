"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PlanilhaScopeBanner } from "@/components/hub/planilha-scope-banner";
import { InstallAppPrompt } from "@/components/pwa/install-app-prompt";
import { InstallAppProvider } from "@/components/pwa/install-app-provider";
import { Header } from "./header";
import { HubDataProvider } from "./hub-data-context";
import { PeriodProvider } from "./period-context";
import { Sidebar } from "./sidebar";
import { useSidebarCollapsed } from "@/lib/hooks/use-sidebar-collapsed";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { collapsed: sidebarCollapsed, toggleCollapsed } = useSidebarCollapsed();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <HubDataProvider>
      <PeriodProvider>
        <InstallAppProvider>
        <div className="flex min-h-[100dvh] bg-[var(--ftime-ink)]">
          <Sidebar
            open={sidebarOpen}
            collapsed={sidebarCollapsed}
            onClose={() => setSidebarOpen(false)}
            onToggleCollapse={toggleCollapsed}
          />
          <div className="mesh-bg dot-grid flex min-h-[100dvh] min-w-0 flex-1 flex-col max-lg:rounded-none lg:rounded-tl-[36px] lg:shadow-[-12px_0_48px_rgba(0,0,0,0.18)] lg:ring-1 lg:ring-white/10">
            <Header
              onMenuClick={() => setSidebarOpen(true)}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebarCollapse={toggleCollapsed}
            />
            <main className="flex-1 overflow-x-hidden px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-6 lg:px-8 lg:py-8">
              <div className="mx-auto w-full max-w-[1440px] space-y-4">
                <InstallAppPrompt variant="banner" />
                <PlanilhaScopeBanner />
                {children}
              </div>
            </main>
          </div>
        </div>
        </InstallAppProvider>
      </PeriodProvider>
    </HubDataProvider>
  );
}
