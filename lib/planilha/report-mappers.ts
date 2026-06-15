import type { UnificacaoAnalista } from "@/lib/types/planilha";

export interface DivergenciaAnalista {
  analista: string;
  tangerino: number;
  orange: number;
  diferenca: number;
  percentual: number;
}

export function mapDivergencias(
  items: UnificacaoAnalista[],
  minDiferenca = 0.5
): DivergenciaAnalista[] {
  return items
    .map((u) => {
      const tangerino = u.tangerino.total;
      const orange = u.orange.total;
      const diferenca = Math.round((orange - tangerino) * 100) / 100;
      const base = Math.max(tangerino, orange, 1);
      const percentual = Math.round((Math.abs(diferenca) / base) * 1000) / 10;
      return { analista: u.analista, tangerino, orange, diferenca, percentual };
    })
    .filter((d) => Math.abs(d.diferenca) >= minDiferenca)
    .sort((a, b) => Math.abs(b.diferenca) - Math.abs(a.diferenca));
}
