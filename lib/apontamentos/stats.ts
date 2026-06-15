import {
  endOfMonth,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Apontamento } from "@/lib/types/apontamento";

export function filterByPeriodo(
  items: Apontamento[],
  inicio: Date,
  fim: Date
): Apontamento[] {
  return items.filter((a) => {
    const d = parseISO(a.data);
    return isWithinInterval(d, { start: inicio, end: fim });
  });
}

export function sumHoras(items: Apontamento[]): number {
  return items.reduce((acc, a) => acc + a.horas, 0);
}

export function countByStatus(items: Apontamento[], status: Apontamento["status"]) {
  return items.filter((a) => a.status === status).length;
}

export function countColaboradoresComLancamento(items: Apontamento[]): number {
  return new Set(items.map((a) => a.colaboradorId)).size;
}

export function mediaHorasPorDiaUtil(items: Apontamento[]): number {
  const dias = new Set(items.map((a) => a.data));
  if (dias.size === 0) return 0;
  return Math.round((sumHoras(items) / dias.size) * 10) / 10;
}

export function horasPorDia(
  items: Apontamento[],
  limit?: number
): { data: string; horas: number; label: string }[] {
  const map = new Map<string, number>();
  for (const a of items) {
    map.set(a.data, (map.get(a.data) ?? 0) + a.horas);
  }
  const sorted = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([data, horas]) => ({
      data,
      horas,
      label: format(parseISO(data), "dd/MM", { locale: ptBR }),
    }));
  return limit ? sorted.slice(-limit) : sorted;
}

export function horasPorColaborador(
  items: Apontamento[]
): { colaborador: string; horas: number; apontamentos: number }[] {
  const map = new Map<string, { horas: number; apontamentos: number }>();
  for (const a of items) {
    const current = map.get(a.colaboradorNome) ?? { horas: 0, apontamentos: 0 };
    map.set(a.colaboradorNome, {
      horas: current.horas + a.horas,
      apontamentos: current.apontamentos + 1,
    });
  }
  return Array.from(map.entries())
    .map(([colaborador, stats]) => ({ colaborador, ...stats }))
    .sort((a, b) => b.horas - a.horas);
}

export function horasPorProjeto(items: Apontamento[]): { projeto: string; horas: number }[] {
  const map = new Map<string, number>();
  for (const a of items) {
    map.set(a.projeto, (map.get(a.projeto) ?? 0) + a.horas);
  }
  return Array.from(map.entries())
    .map(([projeto, horas]) => ({ projeto, horas }))
    .sort((a, b) => b.horas - a.horas)
    .slice(0, 6);
}

export function getDefaultPeriodo(): { inicio: Date; fim: Date } {
  const now = new Date();
  return { inicio: startOfMonth(now), fim: endOfMonth(now) };
}

export function formatPeriodoLabel(inicio: Date, fim: Date): string {
  return `${format(inicio, "dd/MM/yyyy", { locale: ptBR })} – ${format(fim, "dd/MM/yyyy", { locale: ptBR })}`;
}

export function formatHoras(h: number): string {
  return `${h.toLocaleString("pt-BR")}h`;
}
