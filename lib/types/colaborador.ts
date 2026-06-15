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
