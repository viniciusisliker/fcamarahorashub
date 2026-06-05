"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
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
import { useApontamentos } from "@/lib/hooks/use-apontamentos";
import type { Apontamento, StatusApontamento } from "@/lib/types/apontamento";

const PAGE_SIZE = 10;

export function ApontamentosPageContent() {
  const { inicio, fim } = usePeriod();
  const { apontamentos: allApontamentos, loading: dataLoading } =
    useApontamentos();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as StatusApontamento | null;

  const [filters, setFilters] = useState<ApontamentosFilters>(() => ({
    inicio,
    fim,
    colaboradorId: "todos",
    projeto: "todos",
    status:
      statusParam && ["aprovado", "pendente", "rejeitado"].includes(statusParam)
        ? statusParam
        : "todos",
    busca: "",
  }));

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Apontamento | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setFilters((f) => ({ ...f, inicio, fim }));
  }, [inicio, fim]);

  useEffect(() => {
    if (
      statusParam &&
      ["aprovado", "pendente", "rejeitado"].includes(statusParam)
    ) {
      setFilters((f) => ({ ...f, status: statusParam }));
    }
  }, [statusParam]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

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

  const loading = dataLoading;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const patchFilters = useCallback((patch: Partial<ApontamentosFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const handleView = (item: Apontamento) => {
    setSelected(item);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Registros"
        title="Apontamentos"
        description="Consulte, filtre e analise os lançamentos de horas da equipe."
        action={
          <Button variant="outline" disabled className="w-full shrink-0 gap-2 rounded-full sm:w-auto">
            <Download className="h-4 w-4" aria-hidden />
            Exportar (em breve)
          </Button>
        }
      />

      <ApontamentosFiltersBar
        filters={filters}
        onChange={patchFilters}
        colaboradores={colaboradores}
        projetos={projetos}
      />

      <p className="text-sm font-medium text-muted-foreground">
        <span className="font-bold text-foreground">{filtered.length}</span> registro(s)
        encontrado(s)
      </p>

      <ApontamentosTable
        items={paginated}
        loading={loading}
        onView={handleView}
      />

      {filtered.length > 0 && !loading ? (
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
