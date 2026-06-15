import type { StatusApontamento } from "@/lib/types/apontamento";

export type StatusCadastroColaborador = "ativo" | "inativo" | "sem_cadastro";

export interface ColaboradorResumo {
  id: string;
  nome: string;
  email?: string;
  cargo?: string;
  equipe: string;
  responsavel?: string;
  statusCadastro: StatusCadastroColaborador;
  horasPeriodo: number;
  apontamentosPeriodo: number;
  projetosPeriodo: number;
  ultimoApontamento?: string;
}

export type ColaboradoresSortKey =
  | "nome"
  | "equipe"
  | "horas"
  | "apontamentos"
  | "status";

export interface ColaboradorApontamentoResumo {
  id: string;
  data: string;
  projeto: string;
  horas: number;
  status: StatusApontamento;
}

export interface ColaboradorDetalhe extends ColaboradorResumo {
  projetos: string[];
  apontamentosRecentes: ColaboradorApontamentoResumo[];
}
