"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import type { ColaboradorResumo, ColaboradoresSortKey } from "@/lib/types/colaborador";
import { formatHoras } from "@/lib/apontamentos/stats";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ColaboradoresTableProps {
  items: ColaboradorResumo[];
  sortKey: ColaboradoresSortKey;
  sortDirection: "asc" | "desc";
  onSort: (key: ColaboradoresSortKey) => void;
  onSelect?: (colaborador: ColaboradorResumo) => void;
  showCadastroColumns?: boolean;
}

function SortButton({
  label,
  active,
  direction,
  onClick,
  align = "left",
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground",
        align === "right" && "ml-auto"
      )}
    >
      {label}
      <ArrowUpDown
        className={cn("h-3 w-3", active && direction === "asc" && "rotate-180")}
        aria-hidden
      />
    </button>
  );
}

function StatusBadge({ status }: { status: ColaboradorResumo["statusCadastro"] }) {
  const styles = {
    ativo: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    inativo: "bg-muted text-muted-foreground",
    sem_cadastro: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  } as const;
  const labels = {
    ativo: "Ativo",
    inativo: "Inativo",
    sem_cadastro: "Sem cadastro",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}

export function ColaboradoresTable({
  items,
  sortKey,
  sortDirection,
  onSort,
  onSelect,
  showCadastroColumns = false,
}: ColaboradoresTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Nenhum colaborador encontrado com os filtros atuais
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/80">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border/80 bg-muted/40">
            <th className="px-4 py-3">
              <SortButton
                label="Colaborador"
                active={sortKey === "nome"}
                direction={sortDirection}
                onClick={() => onSort("nome")}
              />
            </th>
            {showCadastroColumns ? (
              <>
                <th className="hidden px-4 py-3 lg:table-cell">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Cargo
                  </span>
                </th>
                <th className="hidden px-4 py-3 xl:table-cell">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    E-mail
                  </span>
                </th>
              </>
            ) : null}
            <th className="px-4 py-3">
              <SortButton
                label="Equipe"
                active={sortKey === "equipe"}
                direction={sortDirection}
                onClick={() => onSort("equipe")}
              />
            </th>
            <th className="px-4 py-3 text-right">
              <SortButton
                label="Horas"
                active={sortKey === "horas"}
                direction={sortDirection}
                onClick={() => onSort("horas")}
                align="right"
              />
            </th>
            <th className="hidden px-4 py-3 text-right sm:table-cell">
              <SortButton
                label="Lançamentos"
                active={sortKey === "apontamentos"}
                direction={sortDirection}
                onClick={() => onSort("apontamentos")}
                align="right"
              />
            </th>
            <th className="hidden px-4 py-3 md:table-cell">
              <SortButton
                label="Status"
                active={sortKey === "status"}
                direction={sortDirection}
                onClick={() => onSort("status")}
              />
            </th>
            <th className="px-4 py-3 text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Ações
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr
              key={row.id}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              onClick={onSelect ? () => onSelect(row) : undefined}
              onKeyDown={
                onSelect
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(row);
                      }
                    }
                  : undefined
              }
              className={cn(
                "border-b border-border/60 last:border-0",
                i % 2 === 0 && "bg-muted/15",
                onSelect && "cursor-pointer transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset"
              )}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-xs font-bold text-primary ring-1 ring-primary/10">
                    {row.nome
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{row.nome}</p>
                    {row.ultimoApontamento ? (
                      <p className="truncate text-[11px] text-muted-foreground">
                        Último:{" "}
                        {format(parseISO(row.ultimoApontamento), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">Sem lançamentos no período</p>
                    )}
                  </div>
                </div>
              </td>
              {showCadastroColumns ? (
                <>
                  <td className="hidden max-w-[200px] truncate px-4 py-3 text-muted-foreground lg:table-cell">
                    {row.cargo ?? "—"}
                  </td>
                  <td className="hidden max-w-[220px] truncate px-4 py-3 text-muted-foreground xl:table-cell">
                    {row.email ? (
                      <a
                        href={`mailto:${row.email}`}
                        className="hover:text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {row.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </>
              ) : null}
              <td className="max-w-[180px] truncate px-4 py-3 text-muted-foreground">{row.equipe}</td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                {formatHoras(Math.round(row.horasPeriodo * 10) / 10)}
              </td>
              <td className="hidden px-4 py-3 text-right tabular-nums text-muted-foreground sm:table-cell">
                {row.apontamentosPeriodo}
                {row.projetosPeriodo > 0 ? (
                  <span className="ml-1 text-[11px] text-muted-foreground/70">
                    · {row.projetosPeriodo} proj.
                  </span>
                ) : null}
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <StatusBadge status={row.statusCadastro} />
              </td>
              <td className="px-4 py-3 text-right">
                {row.apontamentosPeriodo > 0 && !row.id.startsWith("cadastro-") ? (
                  <Button variant="ghost" size="sm" className="h-8 gap-1 rounded-full" asChild>
                    <Link
                      href={`/apontamentos?colaborador=${encodeURIComponent(row.id)}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ver horas
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
