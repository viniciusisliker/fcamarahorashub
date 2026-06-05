"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/hub/status-badge";
import type { Apontamento } from "@/lib/types/apontamento";
import { formatHoras } from "@/lib/apontamentos/stats";
import { cn } from "@/lib/utils";

interface ApontamentosTableProps {
  items: Apontamento[];
  loading?: boolean;
  onView: (item: Apontamento) => void;
}

function initials(nome: string) {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ApontamentosTable({
  items,
  loading,
  onView,
}: ApontamentosTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 rounded-[var(--radius-card)] border border-border/80 bg-white/90 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-white/60 px-6 py-20 text-center">
        <p className="text-lg font-semibold">Nenhum apontamento encontrado</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ajuste os filtros ou o período para ver resultados.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border/80 bg-white/90 shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px] text-sm">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-4">
                Colaborador
              </th>
              <th scope="col" className="hidden px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                Data
              </th>
              <th scope="col" className="hidden px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">
                Projeto
              </th>
              <th scope="col" className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Horas
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-4">
                Status
              </th>
              <th scope="col" className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((a, i) => (
              <tr
                key={a.id}
                className={cn(
                  "border-b border-border/50 transition-colors last:border-0 hover:bg-primary/[0.03]",
                  i % 2 === 0 && "bg-white/50"
                )}
              >
                <td className="px-3 py-3 sm:px-5 sm:py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-xs font-bold text-primary ring-1 ring-primary/10">
                      {initials(a.colaboradorNome)}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold">{a.colaboradorNome}</div>
                      <div className="truncate text-xs text-muted-foreground md:hidden">
                        {format(parseISO(a.data), "dd/MM/yyyy", { locale: ptBR })} · {a.projeto}
                      </div>
                      <div className="hidden truncate text-xs text-muted-foreground lg:block max-w-[180px]">
                        {a.descricao}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden whitespace-nowrap px-5 py-4 text-muted-foreground md:table-cell">
                  {format(parseISO(a.data), "dd/MM/yyyy", { locale: ptBR })}
                </td>
                <td className="hidden px-5 py-4 lg:table-cell">{a.projeto}</td>
                <td className="px-5 py-4 text-right">
                  <span className="font-bold tabular-nums text-primary">
                    {formatHoras(a.horas)}
                  </span>
                </td>
                <td className="px-3 py-3 sm:px-5 sm:py-4">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full hover:bg-primary/10 hover:text-primary"
                    onClick={() => onView(a)}
                    aria-label={`Ver detalhe de ${a.colaboradorNome}`}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1.5">Ver</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
