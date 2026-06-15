"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { InstallAppPrompt } from "@/components/pwa/install-app-prompt";
import { MonthPeriodPicker } from "@/components/layout/month-period-picker";
import { DataFreshnessBadge } from "@/components/layout/data-freshness-badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePeriod } from "./period-context";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
}

export function Header({
  onMenuClick,
  sidebarCollapsed = false,
  onToggleSidebarCollapse,
}: HeaderProps) {
  const { inicio } = usePeriod();
  const mesLabel = format(inicio, "MMMM yyyy", { locale: ptBR });

  return (
    <header className="relative z-30 flex min-h-14 shrink-0 items-center gap-2 border-b border-[var(--ftime-border)] bg-card px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[var(--shadow-card)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-1 before:bg-gradient-to-r before:from-[#c93a00] before:via-primary before:to-[#ff8c42] sm:gap-3 sm:px-4 lg:min-h-[72px] lg:gap-4 lg:px-8 lg:pb-0 lg:pt-[env(safe-area-inset-top)]">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {onToggleSidebarCollapse ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden shrink-0 lg:inline-flex"
          onClick={onToggleSidebarCollapse}
          aria-label={sidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" aria-hidden />
          ) : (
            <PanelLeftClose className="h-5 w-5" aria-hidden />
          )}
        </Button>
      ) : null}

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <BrandLogo size="sm" tone="light" showText={false} className="hidden sm:inline-flex" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-foreground">FTimeSheetHub</p>
          <p className="truncate text-[11px] font-medium capitalize tracking-wide text-muted-foreground">
            {mesLabel}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <DataFreshnessBadge />
        <ThemeToggle />
        <InstallAppPrompt variant="icon" />
        <MonthPeriodPicker />
      </div>
    </header>
  );
}
