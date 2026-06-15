"use client";

import { useMemo, useState } from "react";
import { Clock, Search, UserCheck, Users, UserX } from "lucide-react";
import { ColaboradoresTable } from "@/components/hub/colaboradores-table";
import { DataLoadError } from "@/components/hub/data-load-error";
import { HubPanel } from "@/components/hub/hub-panel";
import { KpiCard } from "@/components/hub/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { useHubData } from "@/components/layout/hub-data-context";
import { usePeriod } from "@/components/layout/period-context";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildColaboradoresResumo,
  filterColaboradores,
  getEquipesFromColaboradores,
  sortColaboradores,
} from "@/lib/colaboradores/aggregate";
import {
  filterByPeriodo,
  formatHoras,
  formatPeriodoLabel,
  sumHoras,
} from "@/lib/apontamentos/stats";
import { useAnalistasPlanilha } from "@/lib/hooks/use-analistas-planilha";
import { useApontamentos } from "@/lib/hooks/use-apontamentos";
import { useDataSource } from "@/lib/hooks/use-data-source";
import type { ColaboradoresSortKey } from "@/lib/types/colaborador";

export function ColaboradoresPageContent() {
  const { inicio, fim } = usePeriod();
  const { apontamentos, loading, error, refetch } = useApontamentos();
  const { analistas, loading: analistasLoading } = useAnalistasPlanilha();
  const { isPlanilhaReadOnly } = useDataSource();
  const { planilhaAvailable } = useHubData();

  const [busca, setBusca] = useState("");
  const [equipe, setEquipe] = useState("todos");
  const [status, setStatus] = useState<
    "todos" | "ativo" | "inativo" | "sem_cadastro" | "com_lancamento" | "sem_lancamento"
  >("todos");
  const [sortKey, setSortKey] = useState<ColaboradoresSortKey>("nome");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const colaboradores = useMemo(
    () => buildColaboradoresResumo(apontamentos, inicio, fim, analistas),
    [analistas, apontamentos, fim, inicio]
  );

  const equipes = useMemo(() => getEquipesFromColaboradores(colaboradores), [colaboradores]);

  const filtered = useMemo(
    () => sortColaboradores(filterColaboradores(colaboradores, { busca, equipe, status }), sortKey, sortDirection),
    [busca, colaboradores, equipe, sortDirection, sortKey, status]
  );

  const periodoItems = useMemo(
    () => filterByPeriodo(apontamentos, inicio, fim),
    [apontamentos, fim, inicio]
  );

  const totalHoras = sumHoras(periodoItems);
  const comLancamento = colaboradores.filter((c) => c.apontamentosPeriodo > 0).length;
  const semLancamento = colaboradores.length - comLancamento;
  const ativos = colaboradores.filter((c) => c.statusCadastro === "ativo").length;

  const handleSort = (key: ColaboradoresSortKey) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection(key === "nome" || key === "equipe" || key === "status" ? "asc" : "desc");
  };

  const isLoading = loading || (planilhaAvailable && analistasLoading);

  if (isLoading) {
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
        <div className="h-96 animate-pulse rounded-[var(--radius-card)] bg-muted/60" />
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
    <div className="hub-page space-y-6">
      <PageHeader
        eyebrow="Equipe"
        title="Colaboradores"
        description={
          isPlanilhaReadOnly
            ? `Cadastro da planilha Tommy e horas lançadas no período (${formatPeriodoLabel(inicio, fim)}).`
            : `Visão da equipe com horas e lançamentos no período (${formatPeriodoLabel(inicio, fim)}).`
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Colaboradores"
          value={String(colaboradores.length)}
          description="No cadastro ou com histórico"
          icon={Users}
          accent="orange"
        />
        <KpiCard
          title="Com lançamentos"
          value={String(comLancamento)}
          description="Registraram horas no período"
          icon={UserCheck}
          accent="emerald"
        />
        <KpiCard
          title="Sem lançamentos"
          value={String(semLancamento)}
          description="Sem apontamentos no período"
          icon={UserX}
          accent="amber"
        />
        <KpiCard
          title="Horas no período"
          value={formatHoras(Math.round(totalHoras * 10) / 10)}
          description={
            planilhaAvailable && ativos > 0
              ? `${ativos} ativos no cadastro`
              : "Total consolidado da equipe"
          }
          icon={Clock}
          variant="featured"
        />
      </div>

      <HubPanel
        title="Lista da equipe"
        description={`${filtered.length} de ${colaboradores.length} colaboradores`}
      >
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, e-mail, cargo ou equipe…"
              className="rounded-full border-border/80 bg-muted/30 pl-9"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={equipe} onValueChange={setEquipe}>
              <SelectTrigger className="w-full rounded-full border-border/80 bg-muted/30 sm:w-[200px]">
                <SelectValue placeholder="Equipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as equipes</SelectItem>
                {equipes.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger className="w-full rounded-full border-border/80 bg-muted/30 sm:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
                <SelectItem value="sem_cadastro">Sem cadastro</SelectItem>
                <SelectItem value="com_lancamento">Com lançamentos</SelectItem>
                <SelectItem value="sem_lancamento">Sem lançamentos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ColaboradoresTable
          items={filtered}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          showCadastroColumns={planilhaAvailable}
        />
      </HubPanel>
    </div>
  );
}
