"use client";

import { useEffect, useId, useRef, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPeriodoLabel } from "@/lib/apontamentos/stats";
import { cn } from "@/lib/utils";
import { usePeriod } from "./period-context";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const ANO_MIN = 2024;
const ANO_MAX = 2030;

export function MonthPeriodPicker({ className }: { className?: string }) {
  const { inicio, fim, setMesAno, shiftMes, setMesAtual } = usePeriod();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const year = inicio.getFullYear();
  const monthIndex = inicio.getMonth();
  const mesLabel = format(inicio, "MMMM yyyy", { locale: ptBR });
  const anos = Array.from({ length: ANO_MAX - ANO_MIN + 1 }, (_, i) => ANO_MIN + i);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative flex items-center gap-1", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 rounded-full border-border/80 bg-white/80"
        onClick={() => shiftMes(-1)}
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 min-w-[9.5rem] shrink-0 gap-1.5 rounded-full border-border/80 bg-white/80 px-3 shadow-sm sm:min-w-[11rem] sm:gap-2 sm:px-4"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span className="hidden capitalize lg:inline">{mesLabel}</span>
        <span className="hidden sm:inline lg:hidden">
          {format(inicio, "dd/MM", { locale: ptBR })} – {format(fim, "dd/MM", { locale: ptBR })}
        </span>
        <span className="capitalize sm:hidden">{mesLabel}</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 rounded-full border-border/80 bg-white/80"
        onClick={() => shiftMes(1)}
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Selecionar mês"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(100vw-1.5rem,18rem)] rounded-[var(--radius-card)] border border-border/80 bg-white p-4 shadow-xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Período
          </p>
          <p className="mb-4 text-sm text-muted-foreground">{formatPeriodoLabel(inicio, fim)}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`${panelId}-mes`} className="text-[11px] font-semibold uppercase text-muted-foreground">
                Mês
              </Label>
              <Select
                value={String(monthIndex)}
                onValueChange={(value) => setMesAno(year, Number(value))}
              >
                <SelectTrigger id={`${panelId}-mes`} className="rounded-lg border-border/80 bg-muted/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map((nome, index) => (
                    <SelectItem key={nome} value={String(index)}>
                      {nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`${panelId}-ano`} className="text-[11px] font-semibold uppercase text-muted-foreground">
                Ano
              </Label>
              <Select
                value={String(year)}
                onValueChange={(value) => setMesAno(Number(value), monthIndex)}
              >
                <SelectTrigger id={`${panelId}-ano`} className="rounded-lg border-border/80 bg-muted/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {anos.map((ano) => (
                    <SelectItem key={ano} value={String(ano)}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 w-full rounded-full"
            onClick={() => {
              setMesAtual();
              setOpen(false);
            }}
          >
            Ir para mês atual
          </Button>
        </div>
      ) : null}
    </div>
  );
}
