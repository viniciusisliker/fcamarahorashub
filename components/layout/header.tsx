"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center gap-4 border-b border-border/60 bg-white/60 px-4 backdrop-blur-xl lg:px-8">
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
          <p className="truncate text-sm font-bold tracking-tight">FTimeHub</p>
          <p className="truncate text-xs capitalize text-muted-foreground">
            {mesLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 rounded-full border-border/80 bg-white/80 shadow-sm sm:inline-flex"
          onClick={setMesAtual}
        >
          <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
          <span className="hidden md:inline">{formatPeriodoLabel(inicio, fim)}</span>
          <span className="md:hidden">Período</span>
        </Button>

        <div className="flex items-center gap-2.5 rounded-full border border-border/80 bg-white/80 py-1 pl-3 pr-1 shadow-sm">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold leading-tight">Gestor RH</p>
            <p className="text-[10px] text-muted-foreground">gestor@ftimehub.app</p>
          </div>
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-[#c93a00] text-xs font-bold text-white">
              GR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
