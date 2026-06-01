import type { Apontamento, StatusApontamento } from "@/lib/types/apontamento";

const COLABORADORES = [
  { id: "c01", nome: "Ana Silva", equipe: "Digital" },
  { id: "c02", nome: "Bruno Costa", equipe: "Cloud" },
  { id: "c03", nome: "Carla Mendes", equipe: "Data & Analytics" },
  { id: "c04", nome: "Diego Oliveira", equipe: "E-commerce" },
  { id: "c05", nome: "Elena Rocha", equipe: "Inovação" },
  { id: "c06", nome: "Felipe Alves", equipe: "Digital" },
  { id: "c07", nome: "Gabriela Lima", equipe: "Open Finance" },
  { id: "c08", nome: "Henrique Souza", equipe: "Cloud" },
  { id: "c09", nome: "Isabela Martins", equipe: "Marketing Digital" },
  { id: "c10", nome: "João Pereira", equipe: "Data & Analytics" },
  { id: "c11", nome: "Karina Duarte", equipe: "Digital" },
  { id: "c12", nome: "Lucas Ferreira", equipe: "E-commerce" },
  { id: "c13", nome: "Mariana Nunes", equipe: "Inovação" },
  { id: "c14", nome: "Nicolas Barbosa", equipe: "Cloud" },
  { id: "c15", nome: "Olivia Campos", equipe: "Open Finance" },
  { id: "c16", nome: "Paulo Ribeiro", equipe: "Digital" },
  { id: "c17", nome: "Rafaela Gomes", equipe: "Data & Analytics" },
  { id: "c18", nome: "Thiago Azevedo", equipe: "E-commerce" },
];

const PROJETOS = [
  { projeto: "Portal Cliente", cliente: "Banco Horizonte" },
  { projeto: "Migração Cloud", cliente: "RetailMax" },
  { projeto: "Data Lake", cliente: "Saúde+ Vida" },
  { projeto: "App Marketplace", cliente: "ShopConnect" },
  { projeto: "Open Banking API", cliente: "FinCore" },
  { projeto: "Campanha Performance", cliente: "FCamara Interno" },
  { projeto: "Modernização Legado", cliente: "LogiTrans" },
  { projeto: "PoC Inovação", cliente: "Indústria Nova" },
];

const DESCRICOES = [
  "Desenvolvimento de feature no sprint",
  "Reunião de alinhamento com cliente",
  "Code review e pair programming",
  "Análise de requisitos e documentação",
  "Correção de bugs em homologação",
  "Configuração de pipeline CI/CD",
  "Modelagem de dados e dashboards",
  "Testes de integração",
  "Suporte à implantação em produção",
  "Workshop de discovery",
];

const APROVADORES = [
  "Maria Gestora",
  "Carlos RH",
  "Patricia Líder",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function generateApontamentos(): Apontamento[] {
  const items: Apontamento[] = [];
  const today = new Date();
  let id = 1;

  for (let dayOffset = 0; dayOffset < 60; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const entriesPerDay = 3 + (dayOffset % 4);
    for (let e = 0; e < entriesPerDay; e++) {
      const colab = pick(COLABORADORES, id + dayOffset);
      const proj = pick(PROJETOS, id * 3 + e);
      const statusSeed = (id + dayOffset) % 10;
      let status: StatusApontamento = "aprovado";
      if (statusSeed < 2) status = "pendente";
      else if (statusSeed === 2) status = "rejeitado";

      const horas = [2, 4, 6, 8][(id + e) % 4];

      items.push({
        id: `apt-${String(id).padStart(4, "0")}`,
        colaboradorId: colab.id,
        colaboradorNome: colab.nome,
        equipe: colab.equipe,
        data: formatDate(date),
        projeto: proj.projeto,
        cliente: proj.cliente,
        horas,
        descricao: pick(DESCRICOES, id + e),
        status,
        aprovadoPor:
          status === "aprovado" ? pick(APROVADORES, id) : undefined,
        observacoes:
          status === "rejeitado"
            ? "Horas divergentes do planejamento semanal. Reenviar com justificativa."
            : status === "pendente"
              ? "Aguardando validação do gestor da equipe."
              : undefined,
      });
      id++;
      if (items.length >= 110) return items;
    }
  }

  return items;
}

export const APONTAMENTOS_MOCK: Apontamento[] = generateApontamentos();

export function getColaboradoresFromMock() {
  const map = new Map<string, { id: string; nome: string; equipe: string }>();
  for (const a of APONTAMENTOS_MOCK) {
    map.set(a.colaboradorId, {
      id: a.colaboradorId,
      nome: a.colaboradorNome,
      equipe: a.equipe,
    });
  }
  return Array.from(map.values()).sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );
}

export function getProjetosFromMock() {
  const set = new Set<string>();
  for (const a of APONTAMENTOS_MOCK) set.add(a.projeto);
  return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
