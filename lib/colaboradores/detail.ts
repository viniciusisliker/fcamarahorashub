import { filterByPeriodo } from "@/lib/apontamentos/stats";
import { normalizeNome } from "@/lib/colaboradores/aggregate";
import type { Apontamento } from "@/lib/types/apontamento";
import type { ColaboradorDetalhe, ColaboradorResumo } from "@/lib/types/colaborador";

function matchesColaborador(apontamento: Apontamento, colaborador: ColaboradorResumo): boolean {
  if (!colaborador.id.startsWith("cadastro-") && apontamento.colaboradorId === colaborador.id) {
    return true;
  }
  return normalizeNome(apontamento.colaboradorNome) === normalizeNome(colaborador.nome);
}

export function buildColaboradorDetalhe(
  colaborador: ColaboradorResumo,
  apontamentos: Apontamento[],
  periodoInicio: Date,
  periodoFim: Date
): ColaboradorDetalhe {
  const periodoItems = filterByPeriodo(apontamentos, periodoInicio, periodoFim).filter((a) =>
    matchesColaborador(a, colaborador)
  );

  const projetosSet = new Set<string>();
  for (const a of periodoItems) projetosSet.add(a.projeto);

  const apontamentosRecentes = [...periodoItems]
    .sort((a, b) => b.data.localeCompare(a.data) || b.id.localeCompare(a.id))
    .map((a) => ({
      id: a.id,
      data: a.data,
      projeto: a.projeto,
      horas: a.horas,
      status: a.status,
    }));

  return {
    ...colaborador,
    projetos: Array.from(projetosSet).sort((a, b) => a.localeCompare(b, "pt-BR")),
    apontamentosRecentes,
  };
}
