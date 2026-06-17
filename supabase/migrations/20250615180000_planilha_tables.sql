-- Tabelas da extração Tommy + ajuste em apontamentos para IDs da planilha

alter table public.apontamentos alter column id drop default;
alter table public.apontamentos alter column id type text using id::text;

alter table public.apontamentos
  add column if not exists fonte text
  check (fonte is null or fonte in ('orange', 'tangerino'));

create table public.planilha_meta (
  id int primary key default 1 check (id = 1),
  exportado_em timestamptz not null,
  arquivo_origem text not null,
  total_apontamentos int not null default 0,
  total_analistas int not null default 0,
  periodo_inicio date,
  periodo_fim date,
  apontamentos_por_dia jsonb
);

create table public.planilha_analistas (
  email text primary key,
  nome text not null,
  cargo text not null default '',
  responsavel text not null default '',
  status text not null default ''
);

create table public.planilha_unificacao (
  analista text primary key,
  tangerino jsonb not null,
  orange jsonb not null,
  graficos jsonb not null
);

alter table public.planilha_meta enable row level security;
alter table public.planilha_analistas enable row level security;
alter table public.planilha_unificacao enable row level security;

create policy "planilha_meta_select_anon"
  on public.planilha_meta for select to anon using (true);

create policy "planilha_meta_select_authenticated"
  on public.planilha_meta for select to authenticated using (true);

create policy "planilha_analistas_select_anon"
  on public.planilha_analistas for select to anon using (true);

create policy "planilha_analistas_select_authenticated"
  on public.planilha_analistas for select to authenticated using (true);

create policy "planilha_unificacao_select_anon"
  on public.planilha_unificacao for select to anon using (true);

create policy "planilha_unificacao_select_authenticated"
  on public.planilha_unificacao for select to authenticated using (true);

comment on table public.planilha_meta is 'Metadados da última extração Tommy';
comment on table public.planilha_analistas is 'Cadastro de analistas da planilha Principal';
comment on table public.planilha_unificacao is 'Comparativo Tangerino × Orange por analista';
