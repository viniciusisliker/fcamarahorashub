"use client";

import { FileSpreadsheet } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ComparisonHoursChart } from "@/components/hub/comparison-hours-chart";
import { HubPanel } from "@/components/hub/hub-panel";
import { SectionHeader } from "@/components/hub/section-header";
import {
  mapUnificacaoHorasExtras,
  mapUnificacaoSobreaviso,
  mapUnificacaoTotal,
} from "@/lib/planilha/chart-mappers";
import { usePlanilhaGraficos } from "@/lib/hooks/use-planilha-graficos";

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
          accent="orange"
          title="Total de horas por analista"
          description="U_DinamicaColada · colunas Tangerino Total × FcTeam_Total"
          noHover
        >
          <ComparisonHoursChart data={mapUnificacaoTotal(unificacao)} />
        </HubPanel>

        <HubPanel
          title="Sobreaviso"
          description="U_DinamicaColada · Soma de T_Sobreaviso × F_Sobreaviso"
          noHover
        >
          <ComparisonHoursChart data={mapUnificacaoSobreaviso(unificacao)} height={280} />
        </HubPanel>

        <HubPanel
          title="Horas extras"
          description="U_DinamicaColada · Soma de T_Horas Extras × F_Horas Extras"
          noHover
        >
          <ComparisonHoursChart
            data={mapUnificacaoHorasExtras(unificacao)}
            height={280}
            emptyMessage="Nenhuma hora extra no período (U_DinamicaColada)"
          />
        </HubPanel>
      </div>
    </section>
  );
}
