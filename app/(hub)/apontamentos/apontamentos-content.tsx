"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApontamentoDetailSheet } from "@/components/hub/apontamento-detail-sheet";
import { ApontamentosFiltersBar } from "@/components/hub/apontamentos-filters";
import { ApontamentosTable } from "@/components/hub/apontamentos-table";
import { usePeriod } from "@/components/layout/period-context";
import {
  filterApontamentos,
  type ApontamentosFilters,
} from "@/lib/apontamentos/filters";
import {
  APONTAMENTOS_MOCK,
  getColaboradoresFromMock,
  getProjetosFromMock,
} from "@/lib/mock/apontamentos";
import type { Apontamento, StatusApontamento } from "@/lib/types/apontamento";

const PAGE_SIZE = 10;

export function ApontamentosPageContent() {
  const { inicio, fim } = usePeriod();
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
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const colaboradores = useMemo(() => getColaboradoresFromMock(), []);
  const projetos = useMemo(() => getProjetosFromMock(), []);

  const filtered = useMemo(
    () => filterApontamentos(APONTAMENTOS_MOCK, filters),
    [filters]
  );

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Apontamentos</h1>
          <p className="mt-1 text-muted-foreground">
            Consulte e filtre os lançamentos de horas dos colaboradores.
          </p>
        </div>
        <Button variant="outline" disabled className="shrink-0 gap-2">
          <Download className="h-4 w-4" aria-hidden />
          Exportar (em breve)
        </Button>
      </div>

      <ApontamentosFiltersBar
        filters={filters}
        onChange={patchFilters}
        colaboradores={colaboradores}
        projetos={projetos}
      />

      <p className="text-sm text-muted-foreground">
        {filtered.length} registro(s) encontrado(s)
      </p>

      <ApontamentosTable
        items={paginated}
        loading={loading}
        onView={handleView}
      />

      {filtered.length > 0 && !loading ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
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
