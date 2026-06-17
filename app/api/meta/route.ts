import { getDataSource } from "@/lib/data/apontamentos";
import { loadPlanilhaMeta, isPlanilhaDataAvailable } from "@/lib/data/planilha-store";

export async function GET() {
  const dataSource = getDataSource();
  const planilha = (await isPlanilhaDataAvailable()) ? await loadPlanilhaMeta() : null;

  return Response.json({ dataSource, planilha });
}
