import {
  getPlanilhaMeta,
  getUnificacaoPlanilha,
  planilhaDisponivel,
} from "@/lib/data/planilha";

export async function GET() {
  if (!planilhaDisponivel()) {
    return Response.json(
      { error: "Dados da planilha não exportados. Execute scripts/export-planilha.py" },
      { status: 404 }
    );
  }

  return Response.json(
    {
      meta: getPlanilhaMeta(),
      unificacao: getUnificacaoPlanilha(),
    },
    { headers: { "X-Data-Source": "planilha" } }
  );
}
