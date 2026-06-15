"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowRight,
  ClipboardList,
  Clock,
  Hourglass,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataLoadError } from "@/components/hub/data-load-error";
import { CommandHero } from "@/components/hub/command-hero";
import { HoursChart } from "@/components/hub/hours-chart";
import { HubPanel } from "@/components/hub/hub-panel";
import { KpiCard } from "@/components/hub/kpi-card";
import { PlanilhaChartsSection } from "@/components/hub/planilha-charts-section";
import { StatusBadge } from "@/components/hub/status-badge";
import { StatusDistribution } from "@/components/hub/status-ring";
import { usePeriod } from "@/components/layout/period-context";
import { useApontamentos } from "@/lib/hooks/use-apontamentos";
import { useDataSource } from "@/lib/hooks/use-data-source";
import {
  countByStatus,
  countColaboradoresComLancamento,
  filterByPeriodo,
  formatHoras,
  horasPorDia,
  mediaHorasPorDiaUtil,
  sumHoras,
} from "@/lib/apontamentos/stats";
import type { StatusApontamento } from "@/lib/types/apontamento";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const { inicio, fim } = usePeriod();
  const { apontamentos, loading, error, refetch } = useApontamentos();
  const { isPlanilhaReadOnly } = useDataSource();

  const periodoItems = useMemo(
    () => filterByPeriodo(apontamentos, inicio, fim),
    [apontamentos, inicio, fim]
  );

  const statusCounts = useMemo(
    (): Record<StatusApontamento, number> => ({
      aprovado: countByStatus(periodoItems, "aprovado"),
      pendente: countByStatus(periodoItems, "pendente"),
      rejeitado: countByStatus(periodoItems, "rejeitado"),
    }),
    [periodoItems]
  );

  const pendentes = useMemo(
    () =>
      periodoItems
        .filter((a) => a.status === "pendente")
        .sort((a, b) => b.data.localeCompare(a.data))
        .slice(0, 5),
    [periodoItems]
  );

  const chartData = useMemo(
    () => horasPorDia(periodoItems).map((d) => ({ label: d.label, horas: d.horas })),
    [periodoItems]
  );

  const totalHoras = sumHoras(periodoItems);

  const taxaAprovacao =
    periodoItems.length > 0
      ? Math.round((statusCounts.aprovado / periodoItems.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="hub-page">
        <div className="h-48 animate-pulse rounded-[var(--radius-panel)] bg-muted/60 sm:h-56" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[100px] animate-pulse rounded-[var(--radius-card)] bg-muted/60 sm:h-[120px]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hub-page">
        <DataLoadError message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="hub-page">
      <CommandHero
        greeting={getGreeting()}
        title={
          <>
            Sua equipe em{" "}
            <span className="bg-gradient-to-r from-primary via-[#ff8c42] to-[#ffb347] bg-clip-text text-transparent">
              tempo real
            </span>
          </>
        }
        subtitle={`${periodoItems.length} apontamentos no período selecionado${
          isPlanilhaReadOnly ? " · consulta da planilha Tommy" : ""
        }`}
        stats={[
          {
            label: "Total de horas",
            value: formatHoras(totalHoras),
            icon: Clock,
            accent: "orange",
          },
          {
            label: "Apontamentos",
            value: String(periodoItems.length),
            icon: ClipboardList,
          },
          {
            label: "Colaboradores",
            value: String(countColaboradoresComLancamento(periodoItems)),
            icon: Users,
          },
          ...(isPlanilhaReadOnly
            ? []
            : [
                {
                  label: "Pendentes",
                  value: String(statusCounts.pendente),
                  icon: Hourglass,
                  accent: statusCounts.pendente > 0 ? ("amber" as const) : undefined,
                },
              ]),
        ]}
        ctaHref="/apontamentos"
        ctaLabel="Ver apontamentos"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <KpiCard
          className="animate-fade-up-delay-1"
          title="Média / dia útil"
          value={formatHoras(mediaHorasPorDiaUtil(periodoItems))}
          description="Produtividade média"
          icon={TrendingUp}
          accent="emerald"
        />
        <KpiCard
          className="animate-fade-up-delay-2"
          title={isPlanilhaReadOnly ? "Lançamentos" : "Taxa de aprovação"}
          value={isPlanilhaReadOnly ? String(periodoItems.length) : `${taxaAprovacao}%`}
          description={
            isPlanilhaReadOnly
              ? "Registros no período (consulta)"
              : `${statusCounts.aprovado} de ${periodoItems.length} aprovados`
          }
          icon={Users}
          accent="violet"
        />
        {!isPlanilhaReadOnly ? (
          <KpiCard
            className="animate-fade-up-delay-3"
            title="Rejeitados"
            value={String(statusCounts.rejeitado)}
            description="Precisam de correção"
            icon={XCircle}
            accent="amber"
          />
        ) : (
          <KpiCard
            className="animate-fade-up-delay-3"
            title="Média horas / registro"
            value={
              periodoItems.length > 0
                ? formatHoras(
                    Math.round((totalHoras / periodoItems.length) * 10) / 10
                  )
                : formatHoras(0)
            }
            description="Média por lançamento"
            icon={TrendingUp}
            accent="emerald"
          />
        )}
      </div>

      <PlanilhaChartsSection />

      <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch lg:gap-6">
        <HubPanel
          className="flex h-full flex-col lg:col-span-8"
          title="Horas por dia"
          description="Evolução diária no período · destaque no pico"
        >
          <div className="chart-scroll sm:overflow-visible">
            <HoursChart data={chartData} />
          </div>
        </HubPanel>

        <HubPanel
          className="flex h-full flex-col lg:col-span-4"
          accent="violet"
          title="Distribuição"
          description="Status dos apontamentos"
          bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <StatusDistribution
            counts={statusCounts}
            total={periodoItems.length}
            className="flex-1"
          />
        </HubPanel>
      </div>

      {!isPlanilhaReadOnly ? (
        <HubPanel
          title="Fila de aprovação"
          description="Últimos pendentes que precisam da sua atenção"
          action={
            <Button variant="outline" size="sm" className="w-full rounded-full sm:w-auto" asChild>
              <Link href="/apontamentos?status=pendente">
                Ver todos
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          {pendentes.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center text-sm text-muted-foreground">
              Nenhum apontamento pendente — equipe em dia!
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pendentes.map((a) => (
                <div
                  key={a.id}
                  className="group rounded-xl border border-border/80 bg-gradient-to-br from-card to-muted/20 p-3.5 transition-all sm:p-4 lg:hover:border-primary/30 lg:hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {a.colaboradorNome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="font-semibold leading-tight">{a.colaboradorNome}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{a.projeto}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(a.data), "dd MMM", { locale: ptBR })}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {formatHoras(a.horas)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </HubPanel>
      ) : null}
    </div>
  );
}
