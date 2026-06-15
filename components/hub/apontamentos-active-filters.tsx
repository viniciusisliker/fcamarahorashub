"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApontamentosColumnFilters } from "@/lib/apontamentos/table";
import { defaultColumnFilters } from "@/lib/apontamentos/table";
import type { ApontamentosFilters } from "@/lib/apontamentos/filters";

interface ApontamentosActiveFiltersProps {
  filters: ApontamentosFilters;
  columnFilters: ApontamentosColumnFilters;
  colaboradores: { id: string; nome: string }[];
  onClearAll: () => void;
  onPatchFilters: (patch: Partial<ApontamentosFilters>) => void;
  onPatchColumnFilters: (patch: Partial<ApontamentosColumnFilters>) => void;
}

export function ApontamentosActiveFilters({
  filters,
  columnFilters,
  colaboradores,
  onClearAll,
  onPatchFilters,
  onPatchColumnFilters,
}: ApontamentosActiveFiltersProps) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.busca.trim()) {
    chips.push({
      key: "busca",
      label: `Busca: ${filters.busca.trim()}`,
      onRemove: () => onPatchFilters({ busca: "" }),
    });
  }
  if (filters.colaboradorId !== "todos") {
    const nome =
      colaboradores.find((c) => c.id === filters.colaboradorId)?.nome ??
      filters.colaboradorId;
    chips.push({
      key: "colaborador",
      label: `Colaborador: ${nome}`,
      onRemove: () => onPatchFilters({ colaboradorId: "todos" }),
    });
  }
  if (filters.projeto !== "todos") {
    chips.push({
      key: "projeto",
      label: `Projeto: ${filters.projeto}`,
      onRemove: () => onPatchFilters({ projeto: "todos" }),
    });
  }
  if (filters.status !== "todos") {
    chips.push({
      key: "status",
      label: `Status: ${filters.status}`,
      onRemove: () => onPatchFilters({ status: "todos" }),
    });
  }
  if (columnFilters.colaborador.trim()) {
    chips.push({
      key: "cf_colab",
      label: `Col. tabela: ${columnFilters.colaborador.trim()}`,
      onRemove: () => onPatchColumnFilters({ colaborador: "" }),
    });
  }
  if (columnFilters.data.trim()) {
    chips.push({
      key: "cf_data",
      label: `Data: ${columnFilters.data.trim()}`,
      onRemove: () => onPatchColumnFilters({ data: "" }),
    });
  }
  if (columnFilters.projeto.trim()) {
    chips.push({
      key: "cf_proj",
      label: `Proj. tabela: ${columnFilters.projeto.trim()}`,
      onRemove: () => onPatchColumnFilters({ projeto: "" }),
    });
  }
  if (columnFilters.horas.trim()) {
    chips.push({
      key: "cf_horas",
      label: `Horas: ${columnFilters.horas.trim()}`,
      onRemove: () => onPatchColumnFilters({ horas: "" }),
    });
  }
  if (columnFilters.status !== "todos") {
    chips.push({
      key: "cf_status",
      label: `Status tabela: ${columnFilters.status}`,
      onRemove: () => onPatchColumnFilters({ status: "todos" }),
    });
  }

  const hasColumnFilters =
    columnFilters.colaborador !== defaultColumnFilters.colaborador ||
    columnFilters.data !== defaultColumnFilters.data ||
    columnFilters.projeto !== defaultColumnFilters.projeto ||
    columnFilters.horas !== defaultColumnFilters.horas ||
    columnFilters.status !== defaultColumnFilters.status;

  const hasFilters =
    filters.busca.trim() !== "" ||
    filters.colaboradorId !== "todos" ||
    filters.projeto !== "todos" ||
    filters.status !== "todos" ||
    hasColumnFilters;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/70"
        >
          {chip.label}
          <X className="h-3 w-3 opacity-60" aria-hidden />
        </button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 rounded-full text-xs text-muted-foreground"
        onClick={onClearAll}
      >
        Limpar tudo
      </Button>
    </div>
  );
}
