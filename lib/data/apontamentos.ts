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

export async function getApontamentos(): Promise<Apontamento[]> {
  if (useMockData()) {
    return APONTAMENTOS_MOCK;
  }

  const supabase = await createClient();
  if (!supabase) {
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
    return APONTAMENTOS_MOCK;
  }

  if (!data?.length) {
    return APONTAMENTOS_MOCK;
  }

  return (data as ApontamentoRow[]).map(mapRow);
}
