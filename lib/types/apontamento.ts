export type StatusApontamento = "aprovado" | "pendente" | "rejeitado";

export interface Apontamento {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  equipe: string;
  data: string;
  projeto: string;
  cliente?: string;
  horas: number;
  descricao: string;
  status: StatusApontamento;
  aprovadoPor?: string;
  observacoes?: string;
}

export interface PeriodoFiltro {
  inicio: Date;
  fim: Date;
}
