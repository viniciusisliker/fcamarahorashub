"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/hub/status-badge";
import type { Apontamento } from "@/lib/types/apontamento";
import { formatHoras } from "@/lib/apontamentos/stats";

interface ApontamentosTableProps {
  items: Apontamento[];
  loading?: boolean;
  onView: (item: Apontamento) => void;
}

export function ApontamentosTable({
  items,
  loading,
  onView,
}: ApontamentosTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 rounded-[var(--radius-card)] border border-border bg-card p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-16 text-center">
        <p className="text-lg font-medium">Nenhum apontamento encontrado</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ajuste os filtros ou o período para ver resultados.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Data
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Colaborador
              </th>
              <th scope="col" className="hidden px-4 py-3 text-left font-medium md:table-cell">
                Projeto
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Horas
              </th>
              <th scope="col" className="hidden px-4 py-3 text-left font-medium lg:table-cell">
                Descrição
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr
                key={a.id}
                className="border-b border-border last:border-0 hover:bg-muted/30"
              >
                <td className="whitespace-nowrap px-4 py-3">
                  {format(parseISO(a.data), "dd/MM/yyyy", { locale: ptBR })}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{a.colaboradorNome}</div>
                  <div className="text-xs text-muted-foreground md:hidden">
                    {a.projeto}
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">{a.projeto}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatHoras(a.horas)}
                </td>
                <td className="hidden max-w-[200px] truncate px-4 py-3 lg:table-cell">
                  {a.descricao}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(a)}
                    aria-label={`Ver detalhe de ${a.colaboradorNome}`}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1">Ver</span>
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
