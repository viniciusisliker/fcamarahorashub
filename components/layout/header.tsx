"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Menu } from "lucide-react";
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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
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
          <p className="truncate text-sm font-semibold">FTimeHub</p>
          <p className="truncate text-xs text-muted-foreground capitalize">
            {mesLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 sm:inline-flex"
          onClick={setMesAtual}
        >
          <Calendar className="h-4 w-4" aria-hidden />
          <span className="hidden md:inline">
            {formatPeriodoLabel(inicio, fim)}
          </span>
          <span className="md:hidden">Mês atual</span>
        </Button>

        <div className="flex items-center gap-2 border-l border-border pl-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">Gestor RH</p>
            <p className="text-xs text-muted-foreground">gestor@ftimehub.app</p>
          </div>
          <Avatar>
            <AvatarFallback>GR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
