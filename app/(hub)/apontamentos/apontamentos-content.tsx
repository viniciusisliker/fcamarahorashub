"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { ApontamentosActiveFilters } from "@/components/hub/apontamentos-active-filters";
import { DataLoadError } from "@/components/hub/data-load-error";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { ApontamentoDetailSheet } from "@/components/hub/apontamento-detail-sheet";
import { ApontamentosFiltersBar } from "@/components/hub/apontamentos-filters";
import { ApontamentosTable } from "@/components/hub/apontamentos-table";
import { usePeriod } from "@/components/layout/period-context";
import {
  getColaboradoresFromItems,
  getProjetosFromItems,
} from "@/lib/apontamentos/catalog";
import {
  filterApontamentos,
  type ApontamentosFilters,
} from "@/lib/apontamentos/filters";
import {
  applyColumnFilters,
  defaultColumnFilters,
  sortApontamentos,
  type ApontamentosColumnFilters,
  type ApontamentosSortKey,
  type SortDirection,
} from "@/lib/apontamentos/table";
import {
  buildApontamentosExportFilename,
  downloadApontamentosCsv,
} from "@/lib/apontamentos/export-csv";
import {
  buildApontamentosUrl,
  parseApontamentosUrl,
} from "@/lib/apontamentos/url-state";
import { useApontamentos } from "@/lib/hooks/use-apontamentos";
import type { Apontamento } from "@/lib/types/apontamento";

const PAGE_SIZE = 10;

export function ApontamentosPageContent() {
  const { inicio, fim } = usePeriod();
  const {
    apontamentos: allApontamentos,
    loading: dataLoading,
    error,
    refetch,
  } = useApontamentos();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlBootstrapped = useRef(false);
  const skipPageReset = useRef(true);

  const urlState = useMemo(
    () => parseApontamentosUrl(searchParams),
    [searchParams]
  );

  const [filters, setFilters] = useState<ApontamentosFilters>(() => ({
    inicio,
    fim,
    colaboradorId: urlState.filters?.colaboradorId ?? "todos",
    projeto: urlState.filters?.projeto ?? "todos",
    status: urlState.filters?.status ?? "todos",
    busca: urlState.filters?.busca ?? "",
  }));

  const [page, setPage] = useState(urlState.page ?? 1);
  const [selected, setSelected] = useState<Apontamento | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortKey, setSortKey] = useState<ApontamentosSortKey>(
    urlState.sortKey ?? "data"
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    urlState.sortDirection ?? "desc"
  );
  const [columnFilters, setColumnFilters] = useState<ApontamentosColumnFilters>(() => ({
    ...defaultColumnFilters,
    ...(urlState.columnFilters ?? {}),
  }));

  useEffect(() => {
    setFilters((f) => ({ ...f, inicio, fim }));
  }, [inicio, fim]);

  useEffect(() => {
    if (!urlBootstrapped.current) {
      urlBootstrapped.current = true;
      return;
    }
    const next = buildApontamentosUrl({
      page,
      sortKey,
      sortDirection,
      filters,
      columnFilters,
    });
    router.replace(`${pathname}${next}`, { scroll: false });
  }, [page, sortKey, sortDirection, filters, columnFilters, pathname, router]);

  useEffect(() => {
    if (skipPageReset.current) {
      skipPageReset.current = false;
      return;
    }
    setPage(1);
  }, [filters, columnFilters, sortKey, sortDirection]);

  const colaboradores = useMemo(
    () => getColaboradoresFromItems(allApontamentos),
    [allApontamentos]
  );
  const projetos = useMemo(
    () => getProjetosFromItems(allApontamentos),
    [allApontamentos]
  );

  const filtered = useMemo(
    () => filterApontamentos(allApontamentos, filters),
    [allApontamentos, filters]
  );

  const columnFiltered = useMemo(
    () => applyColumnFilters(filtered, columnFilters),
    [filtered, columnFilters]
  );

  const sorted = useMemo(
    () => sortApontamentos(columnFiltered, sortKey, sortDirection),
    [columnFiltered, sortKey, sortDirection]
  );

  const loading = dataLoading;

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  const patchFilters = useCallback((patch: Partial<ApontamentosFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const patchColumnFilters = useCallback(
    (patch: Partial<ApontamentosColumnFilters>) => {
      setColumnFilters((f) => ({ ...f, ...patch }));
    },
    []
  );

  const handleSort = useCallback(
    (key: ApontamentosSortKey) => {
      if (sortKey === key) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        return;
      }
      setSortKey(key);
      setSortDirection(key === "data" ? "desc" : "asc");
    },
    [sortKey]
  );

  const handleView = (item: Apontamento) => {
    setSelected(item);
    setSheetOpen(true);
  };

  const handleExport = useCallback(() => {
    if (sorted.length === 0) return;
    downloadApontamentosCsv(
      sorted,
      buildApontamentosExportFilename(inicio, "apontamentos")
    );
  }, [inicio, sorted]);

  const handleClearAll = useCallback(() => {
    setFilters((f) => ({
      ...f,
      colaboradorId: "todos",
      projeto: "todos",
      status: "todos",
      busca: "",
    }));
    setColumnFilters(defaultColumnFilters);
    setPage(1);
  }, []);

  if (error && !loading) {
    return (
      <div className="hub-page">
        <PageHeader
          eyebrow="Registros"
          title="Apontamentos"
          description="Consulte, filtre e analise os lançamentos de horas da equipe."
        />
        <DataLoadError message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="hub-page">
      <PageHeader
        eyebrow="Registros"
        title="Apontamentos"
        description="Consulte, filtre e analise os lançamentos de horas da equipe."
        action={
          <Button
            type="button"
            variant="outline"
            className="w-full shrink-0 gap-2 rounded-full sm:w-auto"
            onClick={handleExport}
            disabled={loading || sorted.length === 0}
            title={
              sorted.length === 0
                ? "Nenhum registro para exportar"
                : `Exportar ${sorted.length} registro(s) em CSV`
            }
          >
            <Download className="h-4 w-4" aria-hidden />
            Exportar CSV
          </Button>
        }
      />

      <ApontamentosFiltersBar
        filters={filters}
        onChange={patchFilters}
        colaboradores={colaboradores}
        projetos={projetos}
        onClearAll={handleClearAll}
      />

      <ApontamentosActiveFilters
        filters={filters}
        columnFilters={columnFilters}
        colaboradores={colaboradores}
        onClearAll={handleClearAll}
        onPatchFilters={patchFilters}
        onPatchColumnFilters={patchColumnFilters}
      />

      <p className="text-sm font-medium text-muted-foreground">
        <span className="font-bold text-foreground">{sorted.length}</span> registro(s)
        encontrado(s)
      </p>

      <ApontamentosTable
        items={paginated}
        loading={loading}
        onView={handleView}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        columnFilters={columnFilters}
        onColumnFiltersChange={patchColumnFilters}
      />

      {sorted.length > 0 && !loading ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            Página {page} de {totalPages}
          </p>
          <div className="flex justify-center gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      ) : null}

      <ApontamentoDetailSheet
        apontamento={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
