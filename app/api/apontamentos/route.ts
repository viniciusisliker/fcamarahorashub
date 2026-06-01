import { getApontamentos } from "@/lib/data/apontamentos";

export async function GET() {
  const apontamentos = await getApontamentos();
  return Response.json(apontamentos);
}
