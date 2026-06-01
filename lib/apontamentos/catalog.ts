import type { Apontamento } from "@/lib/types/apontamento";

export function getColaboradoresFromItems(items: Apontamento[]) {
  const map = new Map<string, { id: string; nome: string; equipe: string }>();
  for (const a of items) {
    map.set(a.colaboradorId, {
      id: a.colaboradorId,
      nome: a.colaboradorNome,
      equipe: a.equipe,
    });
  }
  return Array.from(map.values()).sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );
}

export function getProjetosFromItems(items: Apontamento[]) {
  const set = new Set<string>();
  for (const a of items) set.add(a.projeto);
  return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
