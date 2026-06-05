import { getApontamentos, getDataSource } from "@/lib/data/apontamentos";

export async function GET() {
  try {
    const apontamentos = await getApontamentos();
    return Response.json(apontamentos, {
      headers: { "X-Data-Source": getDataSource() },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao carregar apontamentos";
    return Response.json({ error: message }, { status: 500 });
  }
}
