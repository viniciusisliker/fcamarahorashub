import { getColaboradoresFromItems } from "@/lib/apontamentos/catalog";
import { filterByPeriodo } from "@/lib/apontamentos/stats";
import type { Apontamento } from "@/lib/types/apontamento";
import type {
  ColaboradorResumo,
  ColaboradoresSortKey,
  StatusCadastroColaborador,
} from "@/lib/types/colaborador";
import type { AnalistaPlanilha } from "@/lib/types/planilha";

export function normalizeNome(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''`´]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

interface PeriodoStats {
  horasPeriodo: number;
  apontamentosPeriodo: number;
  projetosPeriodo: number;
  ultimoApontamento?: string;
}

function parseStatusCadastro(status?: string): StatusCadastroColaborador {
  if (!status) return "sem_cadastro";
  return status.toLowerCase().startsWith("ativ") ? "ativo" : "inativo";
}

interface StatsAccumulator {
  horasPeriodo: number;
  apontamentosPeriodo: number;
  projetos: Set<string>;
  ultimoApontamento?: string;
  nome: string;
  equipe: string;
}

function buildStatsMap(items: Apontamento[]): Map<string, PeriodoStats & { nome: string; equipe: string }> {
  const map = new Map<string, StatsAccumulator>();
  for (const a of items) {
    const current = map.get(a.colaboradorId) ?? {
      horasPeriodo: 0,
      apontamentosPeriodo: 0,
      projetos: new Set<string>(),
      nome: a.colaboradorNome,
      equipe: a.equipe,
    };

    current.horasPeriodo += a.horas;
    current.apontamentosPeriodo += 1;
    current.projetos.add(a.projeto);
    if (!current.ultimoApontamento || a.data > current.ultimoApontamento) {
      current.ultimoApontamento = a.data;
    }
    map.set(a.colaboradorId, current);
  }

  const result = new Map<string, PeriodoStats & { nome: string; equipe: string }>();
  for (const [id, entry] of map) {
    result.set(id, {
      horasPeriodo: entry.horasPeriodo,
      apontamentosPeriodo: entry.apontamentosPeriodo,
      projetosPeriodo: entry.projetos.size,
      ultimoApontamento: entry.ultimoApontamento,
      nome: entry.nome,
      equipe: entry.equipe,
    });
  }
  return result;
}

function findColaboradorIdByNome(
  nome: string,
  apontamentos: Apontamento[]
): string | undefined {
  const target = normalizeNome(nome);
  for (const a of apontamentos) {
    if (normalizeNome(a.colaboradorNome) === target) return a.colaboradorId;
  }
  return undefined;
}

function findStatsForId(
  id: string,
  nome: string,
  statsById: Map<string, PeriodoStats & { nome: string; equipe: string }>
): (PeriodoStats & { equipe?: string }) | undefined {
  const direct = statsById.get(id);
  if (direct) return direct;

  const target = normalizeNome(nome);
  for (const stats of statsById.values()) {
    if (normalizeNome(stats.nome) === target) return stats;
  }
  return undefined;
}

export function buildColaboradoresResumo(
  allApontamentos: Apontamento[],
  periodoInicio: Date,
  periodoFim: Date,
  analistas: AnalistaPlanilha[] = []
): ColaboradorResumo[] {
  const periodoItems = filterByPeriodo(allApontamentos, periodoInicio, periodoFim);
  const statsById = buildStatsMap(periodoItems);
  const rows: ColaboradorResumo[] = [];
  const seen = new Set<string>();

  if (analistas.length > 0) {
    for (const an of analistas) {
      const id =
        findColaboradorIdByNome(an.nome, allApontamentos) ??
        `cadastro-${normalizeNome(an.nome)}`;
      const stats = findStatsForId(id, an.nome, statsById);
      const key = normalizeNome(an.nome);
      if (seen.has(key)) continue;
      seen.add(key);

      rows.push({
        id: findColaboradorIdByNome(an.nome, allApontamentos) ?? id,
        nome: an.nome,
        email: an.email || undefined,
        cargo: an.cargo || undefined,
        equipe: stats?.equipe ?? an.responsavel,
        responsavel: an.responsavel || undefined,
        statusCadastro: parseStatusCadastro(an.status),
        horasPeriodo: stats?.horasPeriodo ?? 0,
        apontamentosPeriodo: stats?.apontamentosPeriodo ?? 0,
        projetosPeriodo: stats?.projetosPeriodo ?? 0,
        ultimoApontamento: stats?.ultimoApontamento,
      });
    }
  } else {
    for (const c of getColaboradoresFromItems(allApontamentos)) {
      const stats = statsById.get(c.id);
      rows.push({
        id: c.id,
        nome: c.nome,
        equipe: c.equipe,
        statusCadastro: "sem_cadastro",
        horasPeriodo: stats?.horasPeriodo ?? 0,
        apontamentosPeriodo: stats?.apontamentosPeriodo ?? 0,
        projetosPeriodo: stats?.projetosPeriodo ?? 0,
        ultimoApontamento: stats?.ultimoApontamento,
      });
    }
  }

  for (const [id, stats] of statsById) {
    const key = normalizeNome(stats.nome);
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      id,
      nome: stats.nome,
      equipe: stats.equipe,
      statusCadastro: "sem_cadastro",
      horasPeriodo: stats.horasPeriodo,
      apontamentosPeriodo: stats.apontamentosPeriodo,
      projetosPeriodo: stats.projetosPeriodo,
      ultimoApontamento: stats.ultimoApontamento,
    });
  }

  return rows.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export function filterColaboradores(
  items: ColaboradorResumo[],
  opts: {
    busca: string;
    equipe: string;
    status: "todos" | StatusCadastroColaborador | "com_lancamento" | "sem_lancamento";
  }
): ColaboradorResumo[] {
  const busca = opts.busca.trim().toLowerCase();
  return items.filter((c) => {
    if (opts.equipe !== "todos" && c.equipe !== opts.equipe) return false;

    if (opts.status === "ativo" || opts.status === "inativo" || opts.status === "sem_cadastro") {
      if (c.statusCadastro !== opts.status) return false;
    } else if (opts.status === "com_lancamento" && c.apontamentosPeriodo === 0) {
      return false;
    } else if (opts.status === "sem_lancamento" && c.apontamentosPeriodo > 0) {
      return false;
    }

    if (!busca) return true;
    return (
      c.nome.toLowerCase().includes(busca) ||
      c.email?.toLowerCase().includes(busca) ||
      c.cargo?.toLowerCase().includes(busca) ||
      c.equipe.toLowerCase().includes(busca)
    );
  });
}

export function sortColaboradores(
  items: ColaboradorResumo[],
  key: ColaboradoresSortKey,
  direction: "asc" | "desc"
): ColaboradorResumo[] {
  const sorted = [...items].sort((a, b) => {
    switch (key) {
      case "equipe":
        return a.equipe.localeCompare(b.equipe, "pt-BR");
      case "horas":
        return a.horasPeriodo - b.horasPeriodo;
      case "apontamentos":
        return a.apontamentosPeriodo - b.apontamentosPeriodo;
      case "status":
        return a.statusCadastro.localeCompare(b.statusCadastro, "pt-BR");
      default:
        return a.nome.localeCompare(b.nome, "pt-BR");
    }
  });
  return direction === "desc" ? sorted.reverse() : sorted;
}

export function getEquipesFromColaboradores(items: ColaboradorResumo[]): string[] {
  return Array.from(new Set(items.map((c) => c.equipe).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}
