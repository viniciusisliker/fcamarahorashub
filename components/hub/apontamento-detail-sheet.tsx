"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/hub/status-badge";
import type { Apontamento } from "@/lib/types/apontamento";
import { formatHoras } from "@/lib/apontamentos/stats";

interface ApontamentoDetailSheetProps {
  apontamento: Apontamento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApontamentoDetailSheet({
  apontamento,
  open,
  onOpenChange,
}: ApontamentoDetailSheetProps) {
  if (!apontamento) return null;

  const dataFormatada = format(parseISO(apontamento.data), "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  const iniciais = apontamento.colaboradorNome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto border-l-border/80 bg-[var(--ftime-surface)] p-0 sm:max-w-md">
        <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ftime-ink)] via-[var(--ftime-ink-soft)] to-[#1a1020] px-6 pb-8 pt-6 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
          <SheetHeader className="relative space-y-4 text-left">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#c93a00] text-lg font-bold shadow-lg shadow-primary/30">
                {iniciais}
              </span>
              <div>
                <SheetTitle className="text-xl font-bold text-white">
                  {apontamento.colaboradorNome}
                </SheetTitle>
                <SheetDescription className="capitalize text-white/50">
                  {dataFormatada}
                </SheetDescription>
              </div>
            </div>
            <div className="flex items-end justify-between rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/45">
                  Horas registradas
                </p>
                <p className="text-4xl font-extrabold tracking-tight text-white">
                  {formatHoras(apontamento.horas)}
                </p>
              </div>
              <StatusBadge status={apontamento.status} />
            </div>
          </SheetHeader>
        </div>

        <div className="space-y-5 px-6 py-6">
          <dl className="grid gap-4 text-sm">
            {[
              { label: "Equipe", value: apontamento.equipe },
              { label: "Projeto", value: apontamento.projeto },
              ...(apontamento.cliente
                ? [{ label: "Cliente", value: apontamento.cliente }]
                : []),
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-border/80 bg-white/80 p-4"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-xl border border-border/80 bg-white/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Descrição
            </dt>
            <dd className="mt-2 text-sm leading-relaxed">{apontamento.descricao}</dd>
          </div>

          {apontamento.aprovadoPor ? (
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Aprovado por
              </dt>
              <dd className="mt-1 font-semibold text-emerald-900">
                {apontamento.aprovadoPor}
              </dd>
            </div>
          ) : null}

          {apontamento.observacoes ? (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Observações
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-amber-950">
                {apontamento.observacoes}
              </dd>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
