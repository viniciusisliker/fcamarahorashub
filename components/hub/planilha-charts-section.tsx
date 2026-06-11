"use client";

import { FileSpreadsheet } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ComparisonHoursChart } from "@/components/hub/comparison-hours-chart";
import { usePlanilhaGraficos } from "@/lib/hooks/use-planilha-graficos";
import type { UnificacaoAnalista } from "@/lib/types/planilha";

function mapTotal(items: UnificacaoAnalista[]) {
  return items.map((u) => ({
    analista: u.analista,
    tangerino: u.tangerino.total,
    orange: u.orange.total,
  }));
}

function mapSobreaviso(items: UnificacaoAnalista[]) {
  return items.map((u) => ({
    analista: u.analista,
    tangerino: u.tangerino.sobreaviso,
    orange: u.orange.sobreaviso,
  }));
}

function mapExtras(items: UnificacaoAnalista[]) {
  return items.map((u) => ({
    analista: u.analista,
    tangerino: u.tangerino.horasExtras,
    orange: u.orange.horasExtras,
  }));
}

export function PlanilhaChartsSection() {
  const { meta, unificacao, loading, available } = usePlanilhaGraficos();

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-white/60" />
    );
  }

  if (!available || !meta) return null;

  const periodoLabel =
    meta.periodo.inicio && meta.periodo.fim
      ? `${format(parseISO(meta.periodo.inicio), "dd/MM/yyyy", { locale: ptBR })} – ${format(parseISO(meta.periodo.fim), "dd/MM/yyyy", { locale: ptBR })}`
      : "Período da extração";

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <FileSpreadsheet className="h-4 w-4" aria-hidden />
            Extração Tommy
          </p>
          <h2 className="text-base font-bold tracking-tight sm:text-lg">
            Comparativo Tangerino × Orange
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {meta.arquivoOrigem} · {periodoLabel} · {meta.totalApontamentos} lançamentos
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="rounded-[var(--radius-card)] border border-border/80 bg-white/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-6 lg:col-span-2">
          <h3 className="mb-1 text-sm font-bold sm:text-base">Total de horas por analista</h3>
          <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
            Mesma visão da aba Gráficos — Tangerino vs Orange (FCTeam)
          </p>
          <ComparisonHoursChart data={mapTotal(unificacao)} />
        </div>

        <div className="rounded-[var(--radius-card)] border border-border/80 bg-white/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-6">
          <h3 className="mb-1 text-sm font-bold sm:text-base">Sobreaviso</h3>
          <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
            Horas de sobreaviso por ferramenta
          </p>
          <ComparisonHoursChart data={mapSobreaviso(unificacao)} height={280} />
        </div>

        <div className="rounded-[var(--radius-card)] border border-border/80 bg-white/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-6">
          <h3 className="mb-1 text-sm font-bold sm:text-base">Horas extras</h3>
          <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
            Comparativo de horas extras lançadas
          </p>
          <ComparisonHoursChart data={mapExtras(unificacao)} height={280} />
        </div>
      </div>
    </section>
  );
}
