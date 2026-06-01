"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowRight,
  Clock,
  Hourglass,
  Users,
  AlertCircle,
} from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HoursChart } from "@/components/hub/hours-chart";
import { KpiCard } from "@/components/hub/kpi-card";
import { StatusBadge } from "@/components/hub/status-badge";
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

export default function DashboardPage() {
  const { inicio, fim } = usePeriod();
  const { apontamentos, loading } = useApontamentos();

  const periodoItems = useMemo(
    () => filterByPeriodo(apontamentos, inicio, fim),
    [apontamentos, inicio, fim]
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Visão consolidada dos apontamentos do período para gestores e RH.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total de horas"
          value={formatHoras(sumHoras(periodoItems))}
          description="No período selecionado"
          icon={Clock}
          accent="orange"
        />
        <KpiCard
          title="Pendentes de aprovação"
          value={String(countByStatus(periodoItems, "pendente"))}
          description="Apontamentos aguardando validação"
          icon={Hourglass}
        />
        <KpiCard
          title="Colaboradores com lançamento"
          value={String(countColaboradoresComLancamento(periodoItems))}
          description="Com pelo menos um registro"
          icon={Users}
        />
        <KpiCard
          title="Média horas / dia útil"
          value={formatHoras(mediaHorasPorDiaUtil(periodoItems))}
          description="Média no período"
          icon={AlertCircle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Horas por dia</CardTitle>
            <CardDescription>Últimos 14 dias com lançamento no período</CardDescription>
          </CardHeader>
          <CardContent>
            <HoursChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pendentes recentes</CardTitle>
              <CardDescription>Últimos 5 aguardando aprovação</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum apontamento pendente no período.
              </p>
            ) : (
              pendentes.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {a.colaboradorNome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(a.data), "dd/MM", { locale: ptBR })} ·{" "}
                      {a.projeto}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">{formatHoras(a.horas)}</p>
                    <StatusBadge status={a.status} />
                  </div>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/apontamentos?status=pendente">
                Ver todos os pendentes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
