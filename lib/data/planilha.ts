import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type {
  AnalistaPlanilha,
  ApontamentoPlanilha,
  ApontamentoPorDia,
  PlanilhaMeta,
  UnificacaoAnalista,
} from "@/lib/types/planilha";
import type { Apontamento } from "@/lib/types/apontamento";

const DATA_DIR = join(process.cwd(), "data", "planilha");

function readJson<T>(filename: string): T {
  const path = join(DATA_DIR, filename);
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

export function planilhaDisponivel(): boolean {
  return existsSync(join(DATA_DIR, "meta.json"));
}

export function usePlanilhaData(): boolean {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "planilha") return true;
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase") return false;
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "mock") return false;
  return planilhaDisponivel();
}

export function getPlanilhaMeta(): PlanilhaMeta {
  return readJson<PlanilhaMeta>("meta.json");
}

export function getAnalistasPlanilha(): AnalistaPlanilha[] {
  return readJson<AnalistaPlanilha[]>("analistas.json");
}

export function getUnificacaoPlanilha(): UnificacaoAnalista[] {
  return readJson<UnificacaoAnalista[]>("unificacao.json");
}

export function getApontamentosPorDiaPlanilha(): ApontamentoPorDia {
  return readJson<ApontamentoPorDia>("apontamentos-por-dia.json");
}

export function getApontamentosPlanilha(): Apontamento[] {
  const items = readJson<ApontamentoPlanilha[]>("apontamentos.json");
  return items.map((a) => ({
    id: a.id,
    colaboradorId: a.colaboradorId,
    colaboradorNome: a.colaboradorNome,
    equipe: a.equipe,
    data: a.data,
    projeto: a.projeto,
    cliente: a.cliente ?? undefined,
    horas: a.horas,
    descricao: a.descricao,
    status: a.status,
  }));
}
