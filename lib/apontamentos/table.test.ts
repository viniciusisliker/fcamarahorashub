import { describe, expect, it } from "vitest";
import {
  applyColumnFilters,
  sortApontamentos,
} from "@/lib/apontamentos/table";
import type { Apontamento } from "@/lib/types/apontamento";

const sample: Apontamento[] = [
  {
    id: "1",
    colaboradorId: "a",
    colaboradorNome: "Ana Silva",
    equipe: "Hyper",
    data: "2026-06-02",
    projeto: "Projeto A",
    horas: 8,
    descricao: "Dev",
    status: "aprovado",
  },
  {
    id: "2",
    colaboradorId: "b",
    colaboradorNome: "Bruno Costa",
    equipe: "Hyper",
    data: "2026-06-03",
    projeto: "Projeto B",
    horas: 4,
    descricao: "Review",
    status: "pendente",
  },
];

describe("sortApontamentos", () => {
  it("ordena por horas decrescente", () => {
    const sorted = sortApontamentos(sample, "horas", "desc");
    expect(sorted[0].id).toBe("1");
    expect(sorted[1].id).toBe("2");
  });
});

describe("applyColumnFilters", () => {
  it("filtra por colaborador na tabela", () => {
    const result = applyColumnFilters(sample, {
      colaborador: "bruno",
      data: "",
      projeto: "",
      horas: "",
      status: "todos",
    });
    expect(result).toHaveLength(1);
    expect(result[0].colaboradorNome).toBe("Bruno Costa");
  });
});
