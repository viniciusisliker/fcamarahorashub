import { parseISO } from "date-fns";
import type { Apontamento, StatusApontamento } from "@/lib/types/apontamento";

export type ApontamentosSortKey =
  | "colaborador"
  | "data"
  | "projeto"
  | "horas"
  | "status";

export type SortDirection = "asc" | "desc";

export interface ApontamentosColumnFilters {
  colaborador: string;
  data: string;
  projeto: string;
  horas: string;
  status: StatusApontamento | "todos";
}

export const defaultColumnFilters: ApontamentosColumnFilters = {
  colaborador: "",
  data: "",
  projeto: "",
  horas: "",
  status: "todos",
};

const statusOrder: Record<StatusApontamento, number> = {
  aprovado: 0,
  pendente: 1,
  rejeitado: 2,
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function applyColumnFilters(
  items: Apontamento[],
  filters: ApontamentosColumnFilters
): Apontamento[] {
  const colaborador = normalize(filters.colaborador.trim());
  const data = filters.data.trim();
  const projeto = normalize(filters.projeto.trim());
  const horas = filters.horas.trim();

  return items.filter((item) => {
    if (colaborador && !normalize(item.colaboradorNome).includes(colaborador)) {
      return false;
    }
    if (data && !item.data.includes(data) && !formatDataBr(item.data).includes(data)) {
      return false;
    }
    if (projeto && !normalize(item.projeto).includes(projeto)) {
      return false;
    }
    if (horas) {
      const horasStr = String(item.horas).replace(".", ",");
      if (!horasStr.includes(horas.replace(",", "."))) return false;
    }
    if (filters.status !== "todos" && item.status !== filters.status) {
      return false;
    }
    return true;
  });
}

function formatDataBr(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function compareStrings(a: string, b: string) {
  return a.localeCompare(b, "pt-BR", { sensitivity: "base" });
}

export function sortApontamentos(
  items: Apontamento[],
  key: ApontamentosSortKey,
  direction: SortDirection
): Apontamento[] {
  const sorted = [...items].sort((a, b) => {
    let result = 0;
    switch (key) {
      case "colaborador":
        result = compareStrings(a.colaboradorNome, b.colaboradorNome);
        break;
      case "data":
        result = a.data.localeCompare(b.data);
        break;
      case "projeto":
        result = compareStrings(a.projeto, b.projeto);
        break;
      case "horas":
        result = a.horas - b.horas;
        break;
      case "status":
        result = statusOrder[a.status] - statusOrder[b.status];
        break;
    }
    return direction === "asc" ? result : -result;
  });
  return sorted;
}

export const defaultColumnWidths: Record<string, number> = {
  colaborador: 240,
  data: 120,
  projeto: 220,
  horas: 96,
  status: 128,
  acoes: 88,
};

export const minColumnWidths: Record<string, number> = {
  colaborador: 160,
  data: 96,
  projeto: 140,
  horas: 72,
  status: 100,
  acoes: 72,
};
