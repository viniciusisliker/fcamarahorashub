import {
  isPlanilhaDataAvailable,
  loadPlanilhaMeta,
  loadUnificacaoPlanilha,
} from "@/lib/data/planilha-store";

export async function GET() {
  if (!(await isPlanilhaDataAvailable())) {
    return Response.json(
      { error: "Dados da planilha indisponíveis. Execute npm run import-planilha-supabase" },
      { status: 404 }
    );
  }

  const meta = await loadPlanilhaMeta();
  const unificacao = await loadUnificacaoPlanilha();

  return Response.json(
    { meta, unificacao },
    { headers: { "X-Data-Source": process.env.NEXT_PUBLIC_DATA_SOURCE ?? "planilha" } }
  );
}
