"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/hub/status-badge";
import type {
  ApontamentosColumnFilters,
  ApontamentosSortKey,
  SortDirection,
} from "@/lib/apontamentos/table";
import { formatHoras } from "@/lib/apontamentos/stats";
import { useResizableColumns } from "@/lib/hooks/use-resizable-columns";
import type { Apontamento, StatusApontamento } from "@/lib/types/apontamento";
import { cn } from "@/lib/utils";

interface ApontamentosTableProps {
  items: Apontamento[];
  loading?: boolean;
  onView: (item: Apontamento) => void;
  sortKey: ApontamentosSortKey;
  sortDirection: SortDirection;
  onSort: (key: ApontamentosSortKey) => void;
  columnFilters: ApontamentosColumnFilters;
  onColumnFiltersChange: (patch: Partial<ApontamentosColumnFilters>) => void;
}

const COLUMN_IDS = ["colaborador", "data", "projeto", "horas", "status", "acoes"] as const;

function initials(nome: string) {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active) {
    return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden />;
  }
  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-primary" aria-hidden />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-primary" aria-hidden />
  );
}

function ColumnResizeHandle({
  onResizeStart,
}: {
  onResizeStart: (clientX: number) => void;
}) {
  return (
    <button
      type="button"
      aria-label="Redimensionar coluna"
      className="absolute -right-px top-0 z-10 h-full w-2 cursor-col-resize touch-none border-0 bg-transparent p-0 after:absolute after:inset-y-2 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border/80 hover:after:bg-primary/60"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onResizeStart(e.clientX);
      }}
    />
  );
}

function SortableHeader({
  label,
  columnKey,
  sortKey,
  sortDirection,
  onSort,
  width,
  onResizeStart,
  className,
  sortable = true,
}: {
  label: string;
  columnKey?: ApontamentosSortKey;
  sortKey: ApontamentosSortKey;
  sortDirection: SortDirection;
  onSort: (key: ApontamentosSortKey) => void;
  width: number;
  onResizeStart: (clientX: number) => void;
  className?: string;
  sortable?: boolean;
}) {
  const active = sortable && columnKey === sortKey;

  return (
    <th
      scope="col"
      style={{ width, minWidth: width, maxWidth: width }}
      className={cn("relative px-3 py-2.5 text-left sm:px-4", className)}
    >
      {sortable && columnKey ? (
        <button
          type="button"
          className="flex w-full items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => onSort(columnKey)}
        >
          <span className="truncate">{label}</span>
          <SortIcon active={active} direction={sortDirection} />
        </button>
      ) : (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
      <ColumnResizeHandle onResizeStart={onResizeStart} />
    </th>
  );
}

export function ApontamentosTable({
  items,
  loading,
  onView,
  sortKey,
  sortDirection,
  onSort,
  columnFilters,
  onColumnFiltersChange,
}: ApontamentosTableProps) {
  const { widths, startResize, resetWidths, totalWidth } =
    useResizableColumns([...COLUMN_IDS]);

  if (loading) {
    return (
      <div className="space-y-3 rounded-[var(--radius-card)] border border-border/80 bg-card/90 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="hub-panel overflow-hidden !p-0 lg:hover:shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-end border-b border-border/60 bg-muted/20 px-3 py-2 sm:px-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 rounded-full text-xs text-muted-foreground"
          onClick={resetWidths}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Resetar colunas
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table
          className="w-full table-fixed text-sm"
          style={{ minWidth: totalWidth }}
        >
          <colgroup>
            {COLUMN_IDS.map((id) => (
              <col key={id} style={{ width: widths[id] }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <SortableHeader
                label="Colaborador"
                columnKey="colaborador"
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={onSort}
                width={widths.colaborador}
                onResizeStart={(x) => startResize("colaborador", x)}
              />
              <SortableHeader
                label="Data"
                columnKey="data"
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={onSort}
                width={widths.data}
                onResizeStart={(x) => startResize("data", x)}
                className="hidden md:table-cell"
              />
              <SortableHeader
                label="Projeto"
                columnKey="projeto"
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={onSort}
                width={widths.projeto}
                onResizeStart={(x) => startResize("projeto", x)}
                className="hidden lg:table-cell"
              />
              <SortableHeader
                label="Horas"
                columnKey="horas"
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={onSort}
                width={widths.horas}
                onResizeStart={(x) => startResize("horas", x)}
                className="text-right"
              />
              <SortableHeader
                label="Status"
                columnKey="status"
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={onSort}
                width={widths.status}
                onResizeStart={(x) => startResize("status", x)}
              />
              <th
                scope="col"
                style={{
                  width: widths.acoes,
                  minWidth: widths.acoes,
                  maxWidth: widths.acoes,
                }}
                className="relative px-3 py-2.5 text-right sm:px-4"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ações
                </span>
              </th>
            </tr>

            <tr className="border-b border-border/80 bg-card/80">
              <th className="px-2 py-2 sm:px-3">
                <Input
                  aria-label="Filtrar colaborador"
                  placeholder="Filtrar..."
                  value={columnFilters.colaborador}
                  onChange={(e) =>
                    onColumnFiltersChange({ colaborador: e.target.value })
                  }
                  className="h-8 rounded-lg border-border/70 bg-muted/30 text-xs"
                />
              </th>
              <th className="hidden px-2 py-2 md:table-cell sm:px-3">
                <Input
                  aria-label="Filtrar data"
                  placeholder="AAAA-MM-DD"
                  value={columnFilters.data}
                  onChange={(e) => onColumnFiltersChange({ data: e.target.value })}
                  className="h-8 rounded-lg border-border/70 bg-muted/30 text-xs"
                />
              </th>
              <th className="hidden px-2 py-2 lg:table-cell sm:px-3">
                <Input
                  aria-label="Filtrar projeto"
                  placeholder="Filtrar..."
                  value={columnFilters.projeto}
                  onChange={(e) =>
                    onColumnFiltersChange({ projeto: e.target.value })
                  }
                  className="h-8 rounded-lg border-border/70 bg-muted/30 text-xs"
                />
              </th>
              <th className="px-2 py-2 sm:px-3">
                <Input
                  aria-label="Filtrar horas"
                  placeholder="h"
                  value={columnFilters.horas}
                  onChange={(e) => onColumnFiltersChange({ horas: e.target.value })}
                  className="h-8 rounded-lg border-border/70 bg-muted/30 text-xs text-right"
                />
              </th>
              <th className="px-2 py-2 sm:px-3">
                <Select
                  value={columnFilters.status}
                  onValueChange={(v) =>
                    onColumnFiltersChange({
                      status: v as StatusApontamento | "todos",
                    })
                  }
                >
                  <SelectTrigger
                    aria-label="Filtrar status"
                    className="h-8 rounded-lg border-border/70 bg-muted/30 text-xs"
                  >
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </th>
              <th className="px-2 py-2 sm:px-3" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <p className="text-base font-semibold">Nenhum apontamento encontrado</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ajuste os filtros das colunas ou o período para ver resultados.
                  </p>
                </td>
              </tr>
            ) : (
              items.map((a, i) => (
              <tr
                key={a.id}
                className={cn(
                  "border-b border-border/50 transition-colors last:border-0 hover:bg-primary/[0.03]",
                  i % 2 === 0 && "bg-muted/30"
                )}
              >
                <td className="overflow-hidden px-3 py-3 sm:px-4 sm:py-3.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-[10px] font-bold text-primary ring-1 ring-primary/10 sm:h-9 sm:w-9 sm:text-xs">
                      {initials(a.colaboradorNome)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{a.colaboradorNome}</div>
                      <div className="truncate text-xs text-muted-foreground md:hidden">
                        {format(parseISO(a.data), "dd/MM/yyyy", { locale: ptBR })} ·{" "}
                        {a.projeto}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden overflow-hidden truncate whitespace-nowrap px-3 py-3.5 text-muted-foreground md:table-cell sm:px-4">
                  {format(parseISO(a.data), "dd/MM/yyyy", { locale: ptBR })}
                </td>
                <td className="hidden overflow-hidden truncate px-3 py-3.5 lg:table-cell sm:px-4">
                  {a.projeto}
                </td>
                <td className="overflow-hidden px-3 py-3.5 text-right sm:px-4">
                  <span className="font-bold tabular-nums text-primary">
                    {formatHoras(a.horas)}
                  </span>
                </td>
                <td className="overflow-hidden px-3 py-3 sm:px-4 sm:py-3.5">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-3 py-3 text-right sm:px-4 sm:py-3.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full hover:bg-primary/10 hover:text-primary"
                    onClick={() => onView(a)}
                    aria-label={`Ver detalhe de ${a.colaboradorNome}`}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1.5">Ver</span>
                  </Button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
