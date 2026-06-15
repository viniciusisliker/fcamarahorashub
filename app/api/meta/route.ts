import { getDataSource } from "@/lib/data/apontamentos";
import { getPlanilhaMeta, planilhaDisponivel, usePlanilhaData } from "@/lib/data/planilha";

export async function GET() {
  const dataSource = getDataSource();
  const planilha =
    usePlanilhaData() && planilhaDisponivel() ? getPlanilhaMeta() : null;

  return Response.json({ dataSource, planilha });
}
