"use client";

import { Search } from "lucide-react";
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
    <div className="grid gap-4 rounded-[var(--radius-card)] border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2 sm:col-span-2 lg:col-span-1">
        <Label htmlFor="busca">Busca</Label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="busca"
            placeholder="Nome, projeto, descrição..."
            className="pl-9"
            value={filters.busca}
            onChange={(e) => onChange({ busca: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="colaborador">Colaborador</Label>
        <Select
          value={filters.colaboradorId}
          onValueChange={(v) => onChange({ colaboradorId: v })}
        >
          <SelectTrigger id="colaborador">
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
        <Label htmlFor="projeto">Projeto</Label>
        <Select
          value={filters.projeto}
          onValueChange={(v) => onChange({ projeto: v })}
        >
          <SelectTrigger id="projeto">
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
        <Label htmlFor="status">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(v) =>
            onChange({ status: v as StatusApontamento | "todos" })
          }
        >
          <SelectTrigger id="status">
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
  );
}
