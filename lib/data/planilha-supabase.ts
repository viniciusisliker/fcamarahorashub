import { createClient } from "@/lib/supabase/server";
import type {
  AnalistaPlanilha,
  ApontamentoPorDia,
  PlanilhaMeta,
  UnificacaoAnalista,
} from "@/lib/types/planilha";

type PlanilhaMetaRow = {
  exportado_em: string;
  arquivo_origem: string;
  total_apontamentos: number;
  total_analistas: number;
  periodo_inicio: string | null;
  periodo_fim: string | null;
  apontamentos_por_dia: ApontamentoPorDia | null;
};

type AnalistaRow = {
  email: string;
  nome: string;
  cargo: string;
  responsavel: string;
  status: string;
};

type UnificacaoRow = {
  analista: string;
  tangerino: UnificacaoAnalista["tangerino"];
  orange: UnificacaoAnalista["orange"];
  graficos: UnificacaoAnalista["graficos"];
};

function mapMeta(row: PlanilhaMetaRow): PlanilhaMeta {
  return {
    exportadoEm: row.exportado_em,
    arquivoOrigem: row.arquivo_origem,
    totalApontamentos: row.total_apontamentos,
    totalAnalistas: row.total_analistas,
    periodo: {
      inicio: row.periodo_inicio,
      fim: row.periodo_fim,
    },
  };
}

function mapAnalista(row: AnalistaRow): AnalistaPlanilha {
  return {
    nome: row.nome,
    email: row.email,
    cargo: row.cargo,
    responsavel: row.responsavel,
    status: row.status,
  };
}

function mapUnificacao(row: UnificacaoRow): UnificacaoAnalista {
  return {
    analista: row.analista,
    tangerino: row.tangerino,
    orange: row.orange,
    graficos: row.graficos,
  };
}

export async function planilhaDisponivelSupabase(): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return false;

  const { count, error } = await supabase
    .from("planilha_meta")
    .select("id", { count: "exact", head: true });

  return !error && (count ?? 0) > 0;
}

export async function getPlanilhaMetaSupabase(): Promise<PlanilhaMeta | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("planilha_meta")
    .select(
      "exportado_em, arquivo_origem, total_apontamentos, total_analistas, periodo_inicio, periodo_fim"
    )
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return null;
  return mapMeta(data as PlanilhaMetaRow);
}

export async function getAnalistasPlanilhaSupabase(): Promise<AnalistaPlanilha[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("planilha_analistas")
    .select("email, nome, cargo, responsavel, status")
    .order("nome");

  if (error || !data) return [];
  return (data as AnalistaRow[]).map(mapAnalista);
}

export async function getUnificacaoPlanilhaSupabase(): Promise<UnificacaoAnalista[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("planilha_unificacao")
    .select("analista, tangerino, orange, graficos")
    .order("analista");

  if (error || !data) return [];
  return (data as UnificacaoRow[]).map(mapUnificacao);
}

export async function getApontamentosPorDiaPlanilhaSupabase(): Promise<ApontamentoPorDia | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("planilha_meta")
    .select("apontamentos_por_dia")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return null;
  return (data as { apontamentos_por_dia: ApontamentoPorDia | null }).apontamentos_por_dia;
}
