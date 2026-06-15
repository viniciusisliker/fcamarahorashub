"use client";

import { Info } from "lucide-react";
import { usePeriod } from "@/components/layout/period-context";
import { useHubData } from "@/components/layout/hub-data-context";
import {
  formatPlanilhaMetaLabel,
  isPlanilhaReadOnlySource,
  selectedMonthOverlapsPlanilha,
} from "@/lib/planilha/period-utils";

export function PlanilhaScopeBanner() {
  const { inicio, fim } = usePeriod();
  const { dataSource, planilhaMeta, planilhaAvailable } = useHubData();

  if (!isPlanilhaReadOnlySource(dataSource) || !planilhaAvailable || !planilhaMeta) {
    return null;
  }

  const overlaps = selectedMonthOverlapsPlanilha(inicio, fim, planilhaMeta);
  const janela = formatPlanilhaMetaLabel(planilhaMeta);

  return (
    <div
      className="flex gap-3 rounded-[var(--radius-card)] border border-primary/15 bg-primary/5 px-4 py-3 text-sm"
      role="status"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <div className="space-y-1 text-muted-foreground">
        <p className="font-medium text-foreground">
          Dados de consulta da planilha Tommy
        </p>
        <p>
          Janela da extração: <span className="font-medium text-foreground">{janela}</span>
          {!overlaps ? (
            <>
              {" "}
              — o mês selecionado no header pode não ter lançamentos nesta extração.
            </>
          ) : null}
        </p>
        <p className="text-xs">
          Status de aprovação não vem da planilha; lançamentos são exibidos como consulta.
        </p>
      </div>
    </div>
  );
}
