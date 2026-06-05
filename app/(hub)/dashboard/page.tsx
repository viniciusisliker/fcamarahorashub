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
import { KpiCard } from "@/components/hub/kpi-card";
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
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-[var(--radius-card)] bg-white/60" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-[var(--radius-card)] bg-white/60"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="animate-fade-up relative overflow-hidden rounded-[20px] border border-border/60 bg-white/80 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
              {getGreeting()}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Sua equipe em{" "}
              <span className="gradient-text">tempo real</span>
            </h1>
            <p className="max-w-xl text-muted-foreground">
              {periodoItems.length} apontamentos no período ·{" "}
              {formatHoras(totalHoras)} registradas ·{" "}
              {statusCounts.pendente} aguardando aprovação
            </p>
          </div>
          <Button className="shrink-0 rounded-full px-6 shadow-lg shadow-primary/25" asChild>
            <Link href="/apontamentos">
              Ver apontamentos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-12">
        <KpiCard
          className="animate-fade-up-delay-1 xl:col-span-5"
          title="Total de horas"
          value={formatHoras(totalHoras)}
          description="Consolidado no período selecionado"
          icon={Clock}
          variant="featured"
        />
        <KpiCard
          className="animate-fade-up-delay-1 xl:col-span-2"
          title="Pendentes"
          value={String(statusCounts.pendente)}
          description="Aguardando validação"
          icon={Hourglass}
        />
        <KpiCard
          className="animate-fade-up-delay-2 xl:col-span-2"
          title="Colaboradores"
          value={String(countColaboradoresComLancamento(periodoItems))}
          description="Com lançamentos"
          icon={Users}
        />
        <KpiCard
          className="animate-fade-up-delay-3 xl:col-span-3"
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

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-[var(--radius-card)] border border-border/80 bg-white/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm lg:col-span-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Horas por dia</h2>
              <p className="text-sm text-muted-foreground">
                Evolução diária no período · destaque no pico
              </p>
            </div>
          </div>
          <HoursChart data={chartData} />
        </div>

        <div className="rounded-[var(--radius-card)] border border-border/80 bg-white/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm lg:col-span-4">
          <h2 className="text-lg font-bold tracking-tight">Distribuição</h2>
          <p className="mb-6 text-sm text-muted-foreground">Status dos apontamentos</p>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <StatusRing counts={statusCounts} total={periodoItems.length} />
            <StatusLegend counts={statusCounts} />
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-border/80 bg-white/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Fila de aprovação</h2>
            <p className="text-sm text-muted-foreground">
              Últimos pendentes que precisam da sua atenção
            </p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href="/apontamentos?status=pendente">
              Ver todos
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {pendentes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center text-sm text-muted-foreground">
            Nenhum apontamento pendente — equipe em dia!
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pendentes.map((a) => (
              <div
                key={a.id}
                className="group rounded-xl border border-border/80 bg-gradient-to-br from-white to-muted/20 p-4 transition-all hover:border-primary/30 hover:shadow-md"
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
      </div>
    </div>
  );
}
