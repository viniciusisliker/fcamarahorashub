"use client";

import { AlertTriangle } from "lucide-react";
import type { DivergenciaAnalista } from "@/lib/planilha/report-mappers";
import { cn } from "@/lib/utils";

interface DivergenciasPlanilhaTableProps {
  items: DivergenciaAnalista[];
}

export function DivergenciasPlanilhaTable({ items }: DivergenciasPlanilhaTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Nenhuma divergência relevante entre Tangerino e Orange
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Totais alinhados para todos os analistas no período da extração
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/80">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Analista</th>
            <th className="px-4 py-3 text-right">Tangerino</th>
            <th className="px-4 py-3 text-right">Orange</th>
            <th className="px-4 py-3 text-right">Diferença</th>
            <th className="px-4 py-3 text-right">%</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr
              key={row.analista}
              className={cn(
                "border-b border-border/60 last:border-0",
                i % 2 === 0 && "bg-muted/20"
              )}
            >
              <td className="px-4 py-3 font-medium text-foreground">{row.analista}</td>
              <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                {row.tangerino}h
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                {row.orange}h
              </td>
              <td
                className={cn(
                  "px-4 py-3 text-right font-semibold tabular-nums",
                  row.diferenca > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : row.diferenca < 0
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-foreground"
                )}
              >
                {row.diferenca > 0 ? "+" : ""}
                {row.diferenca}h
              </td>
              <td className="px-4 py-3 text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  {row.percentual >= 5 ? (
                    <AlertTriangle className="h-3 w-3" aria-hidden />
                  ) : null}
                  {row.percentual}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
