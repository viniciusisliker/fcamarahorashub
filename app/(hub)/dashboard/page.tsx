"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowRight,
  Clock,
  Hourglass,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { HoursChart } from "@/components/hub/hours-chart";
import { HubPanel } from "@/components/hub/hub-panel";
import { KpiCard } from "@/components/hub/kpi-card";
import { PlanilhaChartsSection } from "@/components/hub/planilha-charts-section";
import { StatusBadge } from "@/components/hub/status-badge";
import { StatusLegend, StatusRing } from "@/components/hub/status-ring";
import { usePeriod } from "@/components/layout/period-context";
import { useApontamentos } from "@/lib/hooks/use-apontamentos";
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
import { cn } from "@/lib/utils";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const { inicio, fim } = usePeriod();
  const { apontamentos, loading } = useApontamentos();

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

  if (loading) {
    return (
      <div className="hub-page">
        <div className="h-24 animate-pulse rounded-[var(--radius-card)] bg-white/60 sm:h-28" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-[108px] animate-pulse rounded-[var(--radius-card)] bg-white/60 sm:h-[132px] lg:h-[140px]",
                i === 0 && "sm:col-span-2 xl:col-span-1",
                i === 3 && "sm:col-span-2 xl:col-span-1"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hub-page">
      <section className="hub-hero animate-fade-up">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 sm:space-y-3">
            <p className="eyebrow flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {getGreeting()}
            </p>
            <h1 className="text-display">
              Sua equipe em{" "}
              <span className="gradient-text">tempo real</span>
            </h1>
            <div className="flex flex-wrap gap-2 sm:hidden">
              <span className="hub-chip">{periodoItems.length} apontamentos</span>
              <span className="hub-chip hub-chip-primary">{formatHoras(totalHoras)}</span>
              {statusCounts.pendente > 0 ? (
                <span className="hub-chip border-amber-500/25 bg-amber-500/10 text-amber-800">
                  {statusCounts.pendente} pendentes
                </span>
              ) : null}
            </div>
            <p className="hidden max-w-xl text-sm text-muted-foreground sm:block sm:text-base">
              {periodoItems.length} apontamentos no período ·{" "}
              {formatHoras(totalHoras)} registradas ·{" "}
              {statusCounts.pendente} aguardando aprovação
            </p>
          </div>
          <Button className="w-full shrink-0 rounded-full px-6 shadow-lg shadow-primary/25 sm:w-auto" asChild>
            <Link href="/apontamentos">
              Ver apontamentos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          className="animate-fade-up-delay-1 sm:col-span-2 xl:col-span-1"
          title="Total de horas"
          value={formatHoras(totalHoras)}
          description="No período selecionado"
          icon={Clock}
          variant="featured"
        />
        <KpiCard
          className="animate-fade-up-delay-1"
          title="Pendentes"
          value={String(statusCounts.pendente)}
          description="Aguardando validação"
          icon={Hourglass}
        />
        <KpiCard
          className="animate-fade-up-delay-2"
          title="Colaboradores"
          value={String(countColaboradoresComLancamento(periodoItems))}
          description="Com lançamentos"
          icon={Users}
        />
        <KpiCard
          className="animate-fade-up-delay-3 sm:col-span-2 xl:col-span-1"
          title="Média / dia útil"
          value={formatHoras(mediaHorasPorDiaUtil(periodoItems))}
          description="Produtividade média"
          icon={TrendingUp}
          trend={
            statusCounts.aprovado > 0
              ? `${Math.round((statusCounts.aprovado / Math.max(periodoItems.length, 1)) * 100)}% aprovados`
              : undefined
          }
        />
      </div>

      <PlanilhaChartsSection />

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        <HubPanel
          className="lg:col-span-8"
          title="Horas por dia"
          description="Evolução diária no período · destaque no pico"
        >
          <div className="chart-scroll sm:overflow-visible">
            <HoursChart data={chartData} />
          </div>
        </HubPanel>

        <HubPanel
          className="lg:col-span-4"
          title="Distribuição"
          description="Status dos apontamentos"
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center sm:gap-8 lg:justify-start">
            <StatusRing counts={statusCounts} total={periodoItems.length} />
            <StatusLegend counts={statusCounts} />
          </div>
        </HubPanel>
      </div>

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
                className="group rounded-xl border border-border/80 bg-gradient-to-br from-white to-muted/20 p-3.5 transition-all sm:p-4 lg:hover:border-primary/30 lg:hover:shadow-md"
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
    </div>
  );
}
