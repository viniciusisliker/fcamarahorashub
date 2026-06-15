"use client";

import {
  BarChart3,
  ClipboardList,
  Clock,
  Download,
  FileSpreadsheet,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { DataLoadError } from "@/components/hub/data-load-error";
import { DivergenciasPlanilhaTable } from "@/components/hub/divergencias-planilha-table";
import { HoursChart } from "@/components/hub/hours-chart";
import { HubPanel } from "@/components/hub/hub-panel";
import { KpiCard } from "@/components/hub/kpi-card";
import { PlanilhaChartsSection } from "@/components/hub/planilha-charts-section";
import { RankedBarChart } from "@/components/hub/ranked-bar-chart";
import { SectionHeader } from "@/components/hub/section-header";
import { StatusDistribution } from "@/components/hub/status-ring";
import { PageHeader } from "@/components/layout/page-header";
import { usePeriod } from "@/components/layout/period-context";
import { Button } from "@/components/ui/button";
import {
  buildApontamentosExportFilename,
  downloadApontamentosCsv,
} from "@/lib/apontamentos/export-csv";
import {
  countByStatus,
  countColaboradoresComLancamento,
  filterByPeriodo,
  formatHoras,
  formatPeriodoLabel,
  horasPorColaborador,
  horasPorDia,
  horasPorProjeto,
  mediaHorasPorDiaUtil,
  sumHoras,
} from "@/lib/apontamentos/stats";
import { useApontamentos } from "@/lib/hooks/use-apontamentos";
import { useDataSource } from "@/lib/hooks/use-data-source";
import { usePlanilhaGraficos } from "@/lib/hooks/use-planilha-graficos";
import { mapDivergencias } from "@/lib/planilha/report-mappers";
import type { StatusApontamento } from "@/lib/types/apontamento";

export function RelatoriosPageContent() {
  const { inicio, fim } = usePeriod();
  const { apontamentos, loading, error, refetch } = useApontamentos();
  const { isPlanilhaReadOnly } = useDataSource();
  const { unificacao, meta, available: planilhaAvailable } = usePlanilhaGraficos();

  const periodoItems = useMemo(
    () => filterByPeriodo(apontamentos, inicio, fim),
    [apontamentos, inicio, fim]
  );

  const periodoLabel = formatPeriodoLabel(inicio, fim);

  const statusCounts = useMemo(
    (): Record<StatusApontamento, number> => ({
      aprovado: countByStatus(periodoItems, "aprovado"),
      pendente: countByStatus(periodoItems, "pendente"),
      rejeitado: countByStatus(periodoItems, "rejeitado"),
    }),
    [periodoItems]
  );

  const totalHoras = sumHoras(periodoItems);
  const taxaAprovacao =
    periodoItems.length > 0
      ? Math.round((statusCounts.aprovado / periodoItems.length) * 100)
      : 0;

  const chartDiario = useMemo(
    () => horasPorDia(periodoItems).map((d) => ({ label: d.label, horas: d.horas })),
    [periodoItems]
  );

  const chartProjetos = useMemo(
    () => horasPorProjeto(periodoItems).map((d) => ({ label: d.projeto, horas: d.horas })),
    [periodoItems]
  );

  const chartColaboradores = useMemo(
    () =>
      horasPorColaborador(periodoItems)
        .slice(0, 10)
        .map((d) => ({ label: d.colaborador, horas: d.horas })),
    [periodoItems]
  );

  const divergencias = useMemo(
    () => (planilhaAvailable ? mapDivergencias(unificacao) : []),
    [planilhaAvailable, unificacao]
  );

  const handleExport = useCallback(() => {
    downloadApontamentosCsv(
      periodoItems,
      buildApontamentosExportFilename(inicio, "relatorio-apontamentos")
    );
  }, [inicio, periodoItems]);

  if (loading) {
    return (
      <div className="hub-page space-y-6">
        <div className="h-20 animate-pulse rounded-[var(--radius-card)] bg-muted/60" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[100px] animate-pulse rounded-[var(--radius-card)] bg-muted/60 sm:h-[120px]"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-[var(--radius-card)] bg-muted/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="hub-page">
        <PageHeader eyebrow="Análise" title="Relatórios" />
        <DataLoadError message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="hub-page">
      <PageHeader
        eyebrow="Análise"
        title="Relatórios"
        description={`Visão consolidada de apontamentos e comparativos da planilha Tommy · ${periodoLabel}`}
        action={
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full sm:w-auto"
            onClick={handleExport}
            disabled={periodoItems.length === 0}
          >
            <Download className="mr-2 h-4 w-4" aria-hidden />
            Exportar CSV
          </Button>
        }
      />

      <section className="space-y-4">
        <SectionHeader
          eyebrow="Apontamentos"
          icon={BarChart3}
          title="Resumo do período"
          description={`${periodoItems.length} lançamentos filtrados pelo seletor de mês no header`}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          <KpiCard
            title="Total de horas"
            value={formatHoras(totalHoras)}
            description="Soma no período"
            icon={Clock}
            accent="orange"
          />
          <KpiCard
            title="Colaboradores"
            value={String(countColaboradoresComLancamento(periodoItems))}
            description="Com lançamentos"
            icon={Users}
            accent="violet"
          />
          <KpiCard
            title={isPlanilhaReadOnly ? "Lançamentos" : "Taxa de aprovação"}
            value={isPlanilhaReadOnly ? String(periodoItems.length) : `${taxaAprovacao}%`}
            description={
              isPlanilhaReadOnly
                ? "Registros no período"
                : `${statusCounts.aprovado} aprovados`
            }
            icon={TrendingUp}
            accent="emerald"
          />
          <KpiCard
            title={isPlanilhaReadOnly ? "Média / registro" : "Pendentes / Rejeitados"}
            value={
              isPlanilhaReadOnly
                ? periodoItems.length > 0
                  ? formatHoras(
                      Math.round((totalHoras / periodoItems.length) * 10) / 10
                    )
                  : formatHoras(0)
                : `${statusCounts.pendente} / ${statusCounts.rejeitado}`
            }
            description={
              isPlanilhaReadOnly ? "Média de horas" : "Requerem atenção"
            }
            icon={XCircle}
            accent="amber"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          <HubPanel
            className="lg:col-span-8"
            title="Evolução diária"
            description="Horas lançadas por dia no mês selecionado"
          >
            <div className="chart-scroll sm:overflow-visible">
              <HoursChart data={chartDiario} />
            </div>
          </HubPanel>

          <HubPanel
            className="lg:col-span-4"
            accent="violet"
            title="Por status"
            description="Distribuição dos apontamentos"
            bodyClassName="overflow-hidden"
          >
            <StatusDistribution counts={statusCounts} total={periodoItems.length} />
          </HubPanel>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <HubPanel
            title="Horas por projeto"
            description={`Top ${chartProjetos.length} projetos · ${formatHoras(totalHoras)} no total`}
          >
            <RankedBarChart data={chartProjetos} />
          </HubPanel>

          <HubPanel
            accent="success"
            title="Horas por colaborador"
            description="Top 10 colaboradores no período"
          >
            <RankedBarChart data={chartColaboradores} />
          </HubPanel>
        </div>

        <HubPanel
          title="Detalhamento por colaborador"
          description="Ranking completo com quantidade de lançamentos"
        >
          {horasPorColaborador(periodoItems).length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center text-sm text-muted-foreground">
              Nenhum apontamento no período selecionado
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/80">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Colaborador</th>
                    <th className="px-4 py-3 text-right">Apontamentos</th>
                    <th className="px-4 py-3 text-right">Horas</th>
                    <th className="px-4 py-3 text-right">Média / lanç.</th>
                  </tr>
                </thead>
                <tbody>
                  {horasPorColaborador(periodoItems).map((row, i) => (
                    <tr
                      key={row.colaborador}
                      className={i % 2 === 0 ? "bg-muted/20" : undefined}
                    >
                      <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3 font-medium">{row.colaborador}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {row.apontamentos}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-primary">
                        {formatHoras(row.horas)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {formatHoras(
                          Math.round((row.horas / row.apontamentos) * 10) / 10
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </HubPanel>

        <div className="rounded-[var(--radius-card)] border border-border/80 bg-muted/20 px-4 py-3 text-xs text-muted-foreground sm:text-sm">
          <span className="font-semibold text-foreground">Média por dia útil:</span>{" "}
          {formatHoras(mediaHorasPorDiaUtil(periodoItems))} ·{" "}
          <span className="font-semibold text-foreground">Total de lançamentos:</span>{" "}
          {periodoItems.length}
        </div>
      </section>

      {planilhaAvailable ? (
        <section className="space-y-4">
          <SectionHeader
            eyebrow="Extração Tommy"
            icon={FileSpreadsheet}
            title="Divergências Tangerino × Orange"
            description={
              meta
                ? `Analistas com diferença de totais · janela da planilha: ${meta.arquivoOrigem}`
                : "Comparativo entre fontes de horas"
            }
          />

          <HubPanel
            title="Totais divergentes"
            description={`${divergencias.length} analista(s) com diferença ≥ 0,5h entre sistemas`}
            noHover
          >
            <DivergenciasPlanilhaTable items={divergencias} />
          </HubPanel>

          <PlanilhaChartsSection />
        </section>
      ) : (
        <HubPanel
          title="Comparativo da planilha"
          description="Dados da extração Tommy não disponíveis"
        >
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 py-12 text-center">
            <ClipboardList className="h-8 w-8 text-muted-foreground/50" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Execute o export da planilha para habilitar relatórios Tangerino × Orange
            </p>
          </div>
        </HubPanel>
      )}
    </div>
  );
}
