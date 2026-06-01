-- Schema inicial: apontamentos (fcamarahorashub)
-- Aplicar com: supabase db push

create type public.status_apontamento as enum ('aprovado', 'pendente', 'rejeitado');

create table public.apontamentos (
  id uuid primary key default gen_random_uuid(),
  colaborador_id text not null,
  colaborador_nome text not null,
  equipe text not null,
  data date not null,
  projeto text not null,
  cliente text,
  horas numeric(5, 2) not null check (horas > 0 and horas <= 24),
  descricao text not null,
  status public.status_apontamento not null default 'pendente',
  aprovado_por text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index apontamentos_data_idx on public.apontamentos (data desc);
create index apontamentos_colaborador_idx on public.apontamentos (colaborador_id);
create index apontamentos_status_idx on public.apontamentos (status);

alter table public.apontamentos enable row level security;

-- Políticas temporárias: leitura autenticada (ajustar quando Auth gestor/RH existir)
create policy "apontamentos_select_authenticated"
  on public.apontamentos for select
  to authenticated
  using (true);

comment on table public.apontamentos is 'Lançamentos de horas dos colaboradores — Hub fcamarahorashub';
