import {
  getAnalistasPlanilha,
  getApontamentosPorDiaPlanilha,
  getPlanilhaMeta,
  getUnificacaoPlanilha,
  planilhaDisponivel,
  usePlanilhaData,
} from "@/lib/data/planilha";
import {
  getAnalistasPlanilhaSupabase,
  getApontamentosPorDiaPlanilhaSupabase,
  getPlanilhaMetaSupabase,
  getUnificacaoPlanilhaSupabase,
  planilhaDisponivelSupabase,
} from "@/lib/data/planilha-supabase";
import type {
  AnalistaPlanilha,
  ApontamentoPorDia,
  PlanilhaMeta,
  UnificacaoAnalista,
} from "@/lib/types/planilha";

function usesSupabasePlanilha(): boolean {
  return process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase";
}

export async function isPlanilhaDataAvailable(): Promise<boolean> {
  if (usePlanilhaData()) {
    return planilhaDisponivel();
  }
  if (usesSupabasePlanilha()) {
    return planilhaDisponivelSupabase();
  }
  return false;
}

export async function loadPlanilhaMeta(): Promise<PlanilhaMeta | null> {
  if (usePlanilhaData() && planilhaDisponivel()) {
    return getPlanilhaMeta();
  }
  if (usesSupabasePlanilha()) {
    return getPlanilhaMetaSupabase();
  }
  return null;
}

export async function loadAnalistasPlanilha(): Promise<AnalistaPlanilha[]> {
  if (usePlanilhaData() && planilhaDisponivel()) {
    return getAnalistasPlanilha();
  }
  if (usesSupabasePlanilha()) {
    return getAnalistasPlanilhaSupabase();
  }
  return [];
}

export async function loadUnificacaoPlanilha(): Promise<UnificacaoAnalista[]> {
  if (usePlanilhaData() && planilhaDisponivel()) {
    return getUnificacaoPlanilha();
  }
  if (usesSupabasePlanilha()) {
    return getUnificacaoPlanilhaSupabase();
  }
  return [];
}

export async function loadApontamentosPorDiaPlanilha(): Promise<ApontamentoPorDia | null> {
  if (usePlanilhaData() && planilhaDisponivel()) {
    return getApontamentosPorDiaPlanilha();
  }
  if (usesSupabasePlanilha()) {
    return getApontamentosPorDiaPlanilhaSupabase();
  }
  return null;
}
