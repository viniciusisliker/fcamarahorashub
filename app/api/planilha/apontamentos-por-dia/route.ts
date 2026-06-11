import {
  getApontamentosPorDiaPlanilha,
  getPlanilhaMeta,
  planilhaDisponivel,
} from "@/lib/data/planilha";

export async function GET() {
  if (!planilhaDisponivel()) {
    return Response.json({ error: "Dados da planilha indisponíveis" }, { status: 404 });
  }

  return Response.json(
    {
      meta: getPlanilhaMeta(),
      apontamentosPorDia: getApontamentosPorDiaPlanilha(),
    },
    { headers: { "X-Data-Source": "planilha" } }
  );
}
