import type { UnificacaoAnalista } from "@/lib/types/planilha";

export interface ComparativoAnalista {
  analista: string;
  tangerino: number;
  orange: number;
}

/** Total — U_DinamicaColada colunas E e I (Tangerino Total × FcTeam_Total). */
export function mapUnificacaoTotal(items: UnificacaoAnalista[]): ComparativoAnalista[] {
  return items.map((u) => ({
    analista: u.analista,
    tangerino: u.tangerino.total,
    orange: u.orange.total,
  }));
}

/** Sobreaviso — U_DinamicaColada colunas D e H (T_Sobreaviso × F_Sobreaviso). */
export function mapUnificacaoSobreaviso(items: UnificacaoAnalista[]): ComparativoAnalista[] {
  return items.map((u) => ({
    analista: u.analista,
    tangerino: u.tangerino.sobreaviso,
    orange: u.orange.sobreaviso,
  }));
}

/** Horas extras — U_DinamicaColada colunas C e G (T_Horas Extras × F_Horas Extras). */
export function mapUnificacaoHorasExtras(items: UnificacaoAnalista[]): ComparativoAnalista[] {
  return items.map((u) => ({
    analista: u.analista,
    tangerino: u.tangerino.horasExtras,
    orange: u.orange.horasExtras,
  }));
}
