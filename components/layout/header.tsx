"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPeriodoLabel } from "@/lib/apontamentos/stats";
import { usePeriod } from "./period-context";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { inicio, fim, setMesAtual } = usePeriod();
  const mesLabel = format(inicio, "MMMM yyyy", { locale: ptBR });

  return (
    <header className="relative sticky top-0 z-30 flex min-h-14 shrink-0 items-center gap-2 border-b border-[var(--ftime-border)] bg-white px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_4px_24px_rgba(15,23,42,0.08)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-1 before:bg-gradient-to-r before:from-[#c93a00] before:via-primary before:to-[#ff8c42] sm:gap-3 sm:px-4 lg:min-h-[72px] lg:gap-4 lg:px-8 lg:pb-0 lg:pt-[env(safe-area-inset-top)]">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <BrandLogo size="sm" tone="light" showText={false} className="hidden sm:inline-flex" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-foreground">FTimeSheetHub</p>
          <p className="truncate text-[11px] font-medium capitalize tracking-wide text-muted-foreground">
            {mesLabel}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-9 shrink-0 gap-1.5 rounded-full border-border/80 bg-white/80 px-3 shadow-sm sm:gap-2 sm:px-4"
        onClick={setMesAtual}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span className="hidden lg:inline">{formatPeriodoLabel(inicio, fim)}</span>
        <span className="hidden sm:inline lg:hidden">
          {format(inicio, "dd/MM", { locale: ptBR })} – {format(fim, "dd/MM", { locale: ptBR })}
        </span>
        <span className="capitalize sm:hidden">{mesLabel}</span>
      </Button>
    </header>
  );
}
