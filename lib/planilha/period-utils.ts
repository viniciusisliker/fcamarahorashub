import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from "date-fns";
import type { PlanilhaMeta } from "@/lib/types/planilha";
import { formatPeriodoLabel } from "@/lib/apontamentos/stats";

export function getPlanilhaBounds(meta: PlanilhaMeta): { inicio: Date; fim: Date } | null {
  if (!meta.periodo.inicio || !meta.periodo.fim) return null;
  return {
    inicio: parseISO(meta.periodo.inicio),
    fim: parseISO(meta.periodo.fim),
  };
}

export function formatPlanilhaMetaLabel(meta: PlanilhaMeta): string {
  const bounds = getPlanilhaBounds(meta);
  if (!bounds) return meta.arquivoOrigem;
  return `${formatPeriodoLabel(bounds.inicio, bounds.fim)} · ${meta.arquivoOrigem}`;
}

/** Mês selecionado no picker tem interseção com a janela exportada da planilha. */
export function selectedMonthOverlapsPlanilha(
  selectedInicio: Date,
  selectedFim: Date,
  meta: PlanilhaMeta
): boolean {
  const bounds = getPlanilhaBounds(meta);
  if (!bounds) return true;
  const monthStart = startOfMonth(selectedInicio);
  const monthEnd = endOfMonth(selectedFim);
  return (
    isWithinInterval(bounds.inicio, { start: monthStart, end: monthEnd }) ||
    isWithinInterval(bounds.fim, { start: monthStart, end: monthEnd }) ||
    isWithinInterval(monthStart, { start: bounds.inicio, end: bounds.fim })
  );
}

export function isPlanilhaReadOnlySource(dataSource: string): boolean {
  return dataSource === "planilha" || dataSource === "supabase";
}
