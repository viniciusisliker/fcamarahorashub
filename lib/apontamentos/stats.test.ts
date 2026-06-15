import { describe, expect, it } from "vitest";
import { sumHoras, filterByPeriodo } from "@/lib/apontamentos/stats";
import type { Apontamento } from "@/lib/types/apontamento";
import { endOfMonth, parseISO, startOfMonth } from "date-fns";

const items: Apontamento[] = [
  {
    id: "1",
    colaboradorId: "a",
    colaboradorNome: "Ana",
    equipe: "Hyper",
    data: "2026-06-02",
    projeto: "P1",
    horas: 8,
    descricao: "x",
    status: "aprovado",
  },
  {
    id: "2",
    colaboradorId: "b",
    colaboradorNome: "Bob",
    equipe: "Hyper",
    data: "2026-07-01",
    projeto: "P2",
    horas: 2,
    descricao: "y",
    status: "aprovado",
  },
];

describe("sumHoras", () => {
  it("soma horas dos itens", () => {
    expect(sumHoras(items)).toBe(10);
  });
});

describe("filterByPeriodo", () => {
  it("mantém apenas junho/2026", () => {
    const inicio = startOfMonth(parseISO("2026-06-01"));
    const fim = endOfMonth(parseISO("2026-06-01"));
    const filtered = filterByPeriodo(items, inicio, fim);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });
});
