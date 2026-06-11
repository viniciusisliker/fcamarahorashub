import { getApontamentosPlanilha, usePlanilhaData } from "@/lib/data/planilha";
import { APONTAMENTOS_MOCK } from "@/lib/mock/apontamentos";
import { createClient } from "@/lib/supabase/server";
import type { Apontamento, StatusApontamento } from "@/lib/types/apontamento";

type ApontamentoRow = {
  id: string;
  colaborador_id: string;
  colaborador_nome: string;
  equipe: string;
  data: string;
  projeto: string;
  cliente: string | null;
  horas: number;
  descricao: string;
  status: StatusApontamento;
  aprovado_por: string | null;
  observacoes: string | null;
};

function mapRow(row: ApontamentoRow): Apontamento {
  return {
    id: row.id,
    colaboradorId: row.colaborador_id,
    colaboradorNome: row.colaborador_nome,
    equipe: row.equipe,
    data: row.data,
    projeto: row.projeto,
    cliente: row.cliente ?? undefined,
    horas: Number(row.horas),
    descricao: row.descricao,
    status: row.status,
    aprovadoPor: row.aprovado_por ?? undefined,
    observacoes: row.observacoes ?? undefined,
  };
}

export function useMockData(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";
}

export function getDataSource(): "mock" | "supabase" | "planilha" {
  if (usePlanilhaData()) return "planilha";
  return useMockData() ? "mock" : "supabase";
}

export async function getApontamentos(): Promise<Apontamento[]> {
  if (usePlanilhaData()) {
    return getApontamentosPlanilha();
  }

  if (useMockData()) {
    return APONTAMENTOS_MOCK;
  }

  const supabase = await createClient();
  if (!supabase) {
    console.warn("[getApontamentos] Supabase não configurado; usando mock.");
    return APONTAMENTOS_MOCK;
  }

  const { data, error } = await supabase
    .from("apontamentos")
    .select(
      "id, colaborador_id, colaborador_nome, equipe, data, projeto, cliente, horas, descricao, status, aprovado_por, observacoes"
    )
    .order("data", { ascending: false });

  if (error) {
    console.error("[getApontamentos]", error.message);
    throw new Error("Falha ao carregar apontamentos do Supabase.");
  }

  return (data as ApontamentoRow[] | null)?.map(mapRow) ?? [];
}
