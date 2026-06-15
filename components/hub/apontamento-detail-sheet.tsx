"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/hub/status-badge";
import type { Apontamento } from "@/lib/types/apontamento";
import { formatHoras } from "@/lib/apontamentos/stats";

interface ApontamentoDetailSheetProps {
  apontamento: Apontamento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getIniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

  const iniciais = getIniciais(apontamento.colaboradorNome);

  const fields = [
    { label: "Equipe", value: apontamento.equipe },
    { label: "Projeto", value: apontamento.projeto },
    ...(apontamento.cliente ? [{ label: "Cliente", value: apontamento.cliente }] : []),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full max-h-[100dvh] flex-col gap-0 overflow-hidden border-l-border/80 bg-[var(--ftime-surface)] p-0 sm:max-w-md [&>button]:text-white [&>button]:opacity-80 [&>button]:hover:bg-white/10 [&>button]:hover:opacity-100">
        <div className="relative shrink-0 bg-gradient-to-br from-[var(--ftime-ink)] via-[var(--ftime-ink-soft)] to-[#1a1020] px-6 pb-6 pt-6 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />

          <div className="relative space-y-5">
            <div className="flex items-start gap-4 pr-8">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#c93a00] text-lg font-bold shadow-lg shadow-primary/30">
                {iniciais}
              </span>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-left text-lg font-bold leading-snug text-white sm:text-xl">
                  {apontamento.colaboradorNome}
                </SheetTitle>
                <p className="mt-1 text-sm capitalize text-white/55">{dataFormatada}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-white/45">
                  Horas registradas
                </p>
                <p className="text-4xl font-extrabold tracking-tight text-white">
                  {formatHoras(apontamento.horas)}
                </p>
              </div>
              <StatusBadge status={apontamento.status} className="shrink-0" />
            </div>
          </div>
        </div>

        <div className="hub-scroll-pane min-h-0 flex-1 space-y-5 bg-[var(--ftime-surface)] px-6 py-6">
          <dl className="grid gap-4 text-sm">
            {fields.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-border/80 bg-card/80 p-4"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 break-words font-semibold leading-snug">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-xl border border-border/80 bg-card/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Descrição
            </dt>
            <dd className="mt-2 break-words text-sm leading-relaxed">{apontamento.descricao}</dd>
          </div>

          {apontamento.aprovadoPor ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Aprovado por
              </dt>
              <dd className="mt-1 font-semibold text-emerald-900 dark:text-emerald-100">
                {apontamento.aprovadoPor}
              </dd>
            </div>
          ) : null}

          {apontamento.observacoes ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Observações
              </dt>
              <dd className="mt-2 break-words text-sm leading-relaxed text-amber-950 dark:text-amber-50">
                {apontamento.observacoes}
              </dd>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
