import {
  isPlanilhaDataAvailable,
  loadAnalistasPlanilha,
} from "@/lib/data/planilha-store";

export async function GET() {
  if (!(await isPlanilhaDataAvailable())) {
    return Response.json(
      { error: "Dados da planilha indisponíveis. Execute npm run import-planilha-supabase" },
      { status: 404 }
    );
  }

  const analistas = await loadAnalistasPlanilha();
  return Response.json(analistas, {
    headers: { "X-Data-Source": process.env.NEXT_PUBLIC_DATA_SOURCE ?? "planilha" },
  });
}
