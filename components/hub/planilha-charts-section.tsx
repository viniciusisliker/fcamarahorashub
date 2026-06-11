"use client";

import { FileSpreadsheet } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ComparisonHoursChart } from "@/components/hub/comparison-hours-chart";
import { HubPanel } from "@/components/hub/hub-panel";
import { SectionHeader } from "@/components/hub/section-header";
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
    tangerino: u.graficos?.tSobreavisoTerco ?? u.tangerino.sobreaviso,
    orange: u.graficos?.fSobreavisoTerco ?? u.orange.sobreaviso,
  }));
}

function mapExtras(items: UnificacaoAnalista[]) {
  return items.map((u) => ({
    analista: u.analista,
    tangerino: u.graficos?.tHorasExtras ?? u.tangerino.horasExtras,
    orange: u.graficos?.fHorasExtras ?? u.orange.horasExtras,
  }));
}

export function PlanilhaChartsSection() {
  const { meta, unificacao, loading, available } = usePlanilhaGraficos();

  if (loading) {
    return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-white/60" />;
  }

  if (!available || !meta) return null;

  const periodoLabel =
    meta.periodo.inicio && meta.periodo.fim
      ? `${format(parseISO(meta.periodo.inicio), "dd/MM/yyyy", { locale: ptBR })} – ${format(parseISO(meta.periodo.fim), "dd/MM/yyyy", { locale: ptBR })}`
      : "Período da extração";

  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Extração Tommy"
        icon={FileSpreadsheet}
        title="Comparativo Tangerino × Orange"
        description={`${meta.arquivoOrigem} · ${periodoLabel} · ${meta.totalApontamentos} lançamentos`}
      />

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <HubPanel
          className="lg:col-span-2"
          title="Total de horas por analista"
          description="Mesma visão da aba Gráficos — Tangerino vs Orange (FCTeam)"
          noHover
        >
          <ComparisonHoursChart data={mapTotal(unificacao)} />
        </HubPanel>

        <HubPanel title="Sobreaviso" description="Horas de sobreaviso por ferramenta" noHover>
          <ComparisonHoursChart data={mapSobreaviso(unificacao)} height={280} />
        </HubPanel>

        <HubPanel title="Horas extras" description="Comparativo de horas extras lançadas" noHover>
          <ComparisonHoursChart data={mapExtras(unificacao)} height={280} />
        </HubPanel>
      </div>
    </section>
  );
}
