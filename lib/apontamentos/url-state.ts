import type { ApontamentosColumnFilters } from "@/lib/apontamentos/table";
import type { ApontamentosFilters } from "@/lib/apontamentos/filters";
import type { ApontamentosSortKey, SortDirection } from "@/lib/apontamentos/table";
import type { StatusApontamento } from "@/lib/types/apontamento";

export interface ApontamentosUrlState {
  page?: number;
  sortKey?: ApontamentosSortKey;
  sortDirection?: SortDirection;
  filters?: Partial<Pick<ApontamentosFilters, "colaboradorId" | "projeto" | "status" | "busca">>;
  columnFilters?: Partial<ApontamentosColumnFilters>;
}

const SORT_KEYS: ApontamentosSortKey[] = [
  "colaborador",
  "data",
  "projeto",
  "horas",
  "status",
];

const STATUS_VALUES: (StatusApontamento | "todos")[] = [
  "todos",
  "aprovado",
  "pendente",
  "rejeitado",
];

function parseSortKey(value: string | null): ApontamentosSortKey {
  return SORT_KEYS.includes(value as ApontamentosSortKey)
    ? (value as ApontamentosSortKey)
    : "data";
}

function parseDirection(value: string | null): SortDirection {
  return value === "asc" ? "asc" : "desc";
}

function parseStatus(value: string | null): StatusApontamento | "todos" {
  return STATUS_VALUES.includes(value as StatusApontamento | "todos")
    ? (value as StatusApontamento | "todos")
    : "todos";
}

export function parseApontamentosUrl(params: URLSearchParams): ApontamentosUrlState {
  const pageRaw = Number(params.get("page"));
  return {
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : undefined,
    sortKey: params.has("sort") ? parseSortKey(params.get("sort")) : undefined,
    sortDirection: params.has("dir") ? parseDirection(params.get("dir")) : undefined,
    filters: {
      ...(params.has("colaborador")
        ? { colaboradorId: params.get("colaborador") ?? "todos" }
        : {}),
      ...(params.has("projeto") ? { projeto: params.get("projeto") ?? "todos" } : {}),
      ...(params.has("status")
        ? { status: parseStatus(params.get("status")) }
        : {}),
      ...(params.has("busca") ? { busca: params.get("busca") ?? "" } : {}),
    },
    columnFilters: {
      ...(params.has("cf_colab") ? { colaborador: params.get("cf_colab") ?? "" } : {}),
      ...(params.has("cf_data") ? { data: params.get("cf_data") ?? "" } : {}),
      ...(params.has("cf_proj") ? { projeto: params.get("cf_proj") ?? "" } : {}),
      ...(params.has("cf_horas") ? { horas: params.get("cf_horas") ?? "" } : {}),
      ...(params.has("cf_status")
        ? { status: parseStatus(params.get("cf_status")) }
        : {}),
    },
  };
}

export function buildApontamentosUrl(state: {
  page: number;
  sortKey: ApontamentosSortKey;
  sortDirection: SortDirection;
  filters: ApontamentosFilters;
  columnFilters: ApontamentosColumnFilters;
}): string {
  const params = new URLSearchParams();

  if (state.filters.status !== "todos") params.set("status", state.filters.status);
  if (state.filters.colaboradorId !== "todos") {
    params.set("colaborador", state.filters.colaboradorId);
  }
  if (state.filters.projeto !== "todos") params.set("projeto", state.filters.projeto);
  if (state.filters.busca.trim()) params.set("busca", state.filters.busca.trim());

  if (state.sortKey !== "data") params.set("sort", state.sortKey);
  if (state.sortDirection !== "desc") params.set("dir", state.sortDirection);
  if (state.page > 1) params.set("page", String(state.page));

  if (state.columnFilters.colaborador.trim()) {
    params.set("cf_colab", state.columnFilters.colaborador.trim());
  }
  if (state.columnFilters.data.trim()) params.set("cf_data", state.columnFilters.data.trim());
  if (state.columnFilters.projeto.trim()) {
    params.set("cf_proj", state.columnFilters.projeto.trim());
  }
  if (state.columnFilters.horas.trim()) params.set("cf_horas", state.columnFilters.horas.trim());
  if (state.columnFilters.status !== "todos") {
    params.set("cf_status", state.columnFilters.status);
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
