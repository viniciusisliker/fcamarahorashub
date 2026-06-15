"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Database } from "lucide-react";
import { useHubData } from "@/components/layout/hub-data-context";
import { formatPlanilhaMetaLabel } from "@/lib/planilha/period-utils";
import { cn } from "@/lib/utils";

interface DataFreshnessBadgeProps {
  className?: string;
}

export function DataFreshnessBadge({ className }: DataFreshnessBadgeProps) {
  const { planilhaMeta, planilhaAvailable, dataSource, planilhaLoading } = useHubData();

  if (planilhaLoading || dataSource !== "planilha" || !planilhaAvailable || !planilhaMeta) {
    return null;
  }

  const exportadoEm = planilhaMeta.exportadoEm
    ? format(parseISO(planilhaMeta.exportadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })
    : null;

  return (
    <div
      className={cn(
        "hidden items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-muted-foreground xl:flex",
        className
      )}
      title={formatPlanilhaMetaLabel(planilhaMeta)}
    >
      <Database className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
      <span className="max-w-[220px] truncate">
        {exportadoEm ? `Extraído ${exportadoEm}` : "Planilha Tommy"}
      </span>
    </div>
  );
}
