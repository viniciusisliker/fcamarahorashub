export interface AnalistaPlanilha {
  nome: string;
  email: string;
  cargo: string;
  responsavel: string;
  status: string;
}

export interface HorasPorFonte {
  horasNormais: number;
  horasExtras: number;
  sobreaviso: number;
  total: number;
}

export interface UnificacaoGraficos {
  tSobreavisoTerco: number;
  fSobreavisoTerco: number;
  tHorasExtras: number;
  fHorasExtras: number;
}

export interface UnificacaoAnalista {
  analista: string;
  tangerino: HorasPorFonte;
  orange: HorasPorFonte;
  graficos: UnificacaoGraficos;
}

export interface ApontamentoPorDiaAnalista {
  analista: string;
  dias: number[];
}

export interface ApontamentoPorDia {
  dias: number[];
  analistas: ApontamentoPorDiaAnalista[];
}

export interface PlanilhaMeta {
  exportadoEm: string;
  arquivoOrigem: string;
  totalApontamentos: number;
  totalAnalistas: number;
  periodo: {
    inicio: string | null;
    fim: string | null;
  };
}

export interface ApontamentoPlanilha {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  equipe: string;
  data: string;
  projeto: string;
  cliente?: string | null;
  horas: number;
  descricao: string;
  status: "aprovado" | "pendente" | "rejeitado";
  fonte: "orange" | "tangerino";
}

export interface PlanilhaExport {
  meta: PlanilhaMeta;
  analistas: AnalistaPlanilha[];
  unificacao: UnificacaoAnalista[];
  apontamentosPorDia: ApontamentoPorDia;
  apontamentos: ApontamentoPlanilha[];
}
