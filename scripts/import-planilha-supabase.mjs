/**
 * Importa data/planilha/*.json para o Supabase (fcamarahorashub).
 *
 * Requer em .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Uso: node --env-file=.env.local scripts/import-planilha-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data", "planilha");
const BATCH = 400;

function readJson(name) {
  const path = join(DATA_DIR, name);
  if (!existsSync(path)) {
    throw new Error(`Arquivo não encontrado: ${path}`);
  }
  return JSON.parse(readFileSync(path, "utf-8"));
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const meta = readJson("meta.json");
  const analistas = readJson("analistas.json");
  const unificacao = readJson("unificacao.json");
  const apontamentos = readJson("apontamentos.json");
  const apontamentosPorDia = readJson("apontamentos-por-dia.json");

  console.log(`Importando ${apontamentos.length} apontamentos, ${analistas.length} analistas...`);

  const { error: clearApontamentos } = await supabase
    .from("apontamentos")
    .delete()
    .neq("id", "");
  if (clearApontamentos) {
    console.error("Falha ao limpar apontamentos:", clearApontamentos.message);
    process.exit(1);
  }

  const { error: clearAnalistas } = await supabase
    .from("planilha_analistas")
    .delete()
    .neq("email", "");
  if (clearAnalistas) {
    console.error("Falha ao limpar analistas:", clearAnalistas.message);
    process.exit(1);
  }

  const { error: clearUnificacao } = await supabase
    .from("planilha_unificacao")
    .delete()
    .neq("analista", "");
  if (clearUnificacao) {
    console.error("Falha ao limpar unificacao:", clearUnificacao.message);
    process.exit(1);
  }

  const { error: clearMeta } = await supabase.from("planilha_meta").delete().eq("id", 1);
  if (clearMeta) {
    console.error("Falha ao limpar meta:", clearMeta.message);
    process.exit(1);
  }

  const metaRow = {
    id: 1,
    exportado_em: meta.exportadoEm,
    arquivo_origem: meta.arquivoOrigem,
    total_apontamentos: meta.totalApontamentos,
    total_analistas: meta.totalAnalistas,
    periodo_inicio: meta.periodo?.inicio ?? null,
    periodo_fim: meta.periodo?.fim ?? null,
    apontamentos_por_dia: apontamentosPorDia,
  };

  const { error: metaError } = await supabase.from("planilha_meta").upsert(metaRow);
  if (metaError) {
    console.error("Falha ao importar meta:", metaError.message);
    process.exit(1);
  }
  console.log("  planilha_meta: ok");

  const analistaRows = analistas.map((a) => ({
    email: a.email,
    nome: a.nome,
    cargo: a.cargo ?? "",
    responsavel: a.responsavel ?? "",
    status: a.status ?? "",
  }));

  const { error: analistasError } = await supabase.from("planilha_analistas").insert(analistaRows);
  if (analistasError) {
    console.error("Falha ao importar analistas:", analistasError.message);
    process.exit(1);
  }
  console.log(`  planilha_analistas: ${analistaRows.length}`);

  const unificacaoRows = unificacao.map((u) => ({
    analista: u.analista,
    tangerino: u.tangerino,
    orange: u.orange,
    graficos: u.graficos,
  }));

  const { error: unificacaoError } = await supabase.from("planilha_unificacao").insert(unificacaoRows);
  if (unificacaoError) {
    console.error("Falha ao importar unificacao:", unificacaoError.message);
    process.exit(1);
  }
  console.log(`  planilha_unificacao: ${unificacaoRows.length}`);

  const apontamentoRows = apontamentos.map((a) => ({
    id: a.id,
    colaborador_id: a.colaboradorId,
    colaborador_nome: a.colaboradorNome,
    equipe: a.equipe,
    data: a.data,
    projeto: a.projeto,
    cliente: a.cliente ?? null,
    horas: a.horas,
    descricao: a.descricao,
    status: a.status,
    fonte: a.fonte ?? null,
  }));

  let imported = 0;
  for (const batch of chunk(apontamentoRows, BATCH)) {
    const { error } = await supabase.from("apontamentos").insert(batch);
    if (error) {
      console.error("Falha ao importar apontamentos:", error.message);
      process.exit(1);
    }
    imported += batch.length;
    console.log(`  apontamentos: ${imported}/${apontamentoRows.length}`);
  }

  console.log("Importação concluída.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
