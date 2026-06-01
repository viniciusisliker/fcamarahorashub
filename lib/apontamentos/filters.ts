import { parseISO } from "date-fns";
import type { Apontamento, StatusApontamento } from "@/lib/types/apontamento";

export interface ApontamentosFilters {
  inicio: Date;
  fim: Date;
  colaboradorId: string;
  projeto: string;
  status: StatusApontamento | "todos";
  busca: string;
}

export function filterApontamentos(
  items: Apontamento[],
  filters: ApontamentosFilters
): Apontamento[] {
  const buscaLower = filters.busca.trim().toLowerCase();

  return items.filter((a) => {
    const d = parseISO(a.data);
    if (d < filters.inicio || d > filters.fim) return false;
    if (filters.colaboradorId !== "todos" && a.colaboradorId !== filters.colaboradorId)
      return false;
    if (filters.projeto !== "todos" && a.projeto !== filters.projeto) return false;
    if (filters.status !== "todos" && a.status !== filters.status) return false;
    if (buscaLower) {
      const haystack = [
        a.colaboradorNome,
        a.projeto,
        a.cliente ?? "",
        a.descricao,
        a.equipe,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(buscaLower)) return false;
    }
    return true;
  });
}
