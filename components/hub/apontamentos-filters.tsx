"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApontamentosFilters } from "@/lib/apontamentos/filters";
import type { StatusApontamento } from "@/lib/types/apontamento";

interface ApontamentosFiltersProps {
  filters: ApontamentosFilters;
  onChange: (patch: Partial<ApontamentosFilters>) => void;
  colaboradores: { id: string; nome: string }[];
  projetos: string[];
}

export function ApontamentosFiltersBar({
  filters,
  onChange,
  colaboradores,
  projetos,
}: ApontamentosFiltersProps) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border/80 bg-white/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden />
        Filtros
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="busca" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Busca
          </Label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="busca"
              placeholder="Nome, projeto, descrição..."
              className="rounded-full border-border/80 bg-muted/30 pl-9 focus-visible:ring-primary/30"
              value={filters.busca}
              onChange={(e) => onChange({ busca: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="colaborador" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Colaborador
          </Label>
          <Select
            value={filters.colaboradorId}
            onValueChange={(v) => onChange({ colaboradorId: v })}
          >
            <SelectTrigger id="colaborador" className="rounded-full border-border/80 bg-muted/30">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {colaboradores.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projeto" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Projeto
          </Label>
          <Select
            value={filters.projeto}
            onValueChange={(v) => onChange({ projeto: v })}
          >
            <SelectTrigger id="projeto" className="rounded-full border-border/80 bg-muted/30">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {projetos.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </Label>
          <Select
            value={filters.status}
            onValueChange={(v) =>
              onChange({ status: v as StatusApontamento | "todos" })
            }
          >
            <SelectTrigger id="status" className="rounded-full border-border/80 bg-muted/30">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
