-- Seed demo: 5 apontamentos para validação do hub (idempotente)
insert into public.apontamentos (
  id,
  colaborador_id,
  colaborador_nome,
  equipe,
  data,
  projeto,
  cliente,
  horas,
  descricao,
  status,
  aprovado_por,
  observacoes
)
values
  (
    'a0000001-0000-4000-8000-000000000001',
    'c01',
    'Ana Silva',
    'Digital',
    '2026-05-31',
    'Portal Cliente',
    'Banco Horizonte',
    8,
    'Desenvolvimento de feature no sprint',
    'aprovado',
    'Maria Gestora',
    null
  ),
  (
    'a0000002-0000-4000-8000-000000000002',
    'c02',
    'Bruno Costa',
    'Cloud',
    '2026-05-30',
    'Migração Cloud',
    'RetailMax',
    6,
    'Reunião de alinhamento com cliente',
    'pendente',
    null,
    'Aguardando validação do gestor da equipe.'
  ),
  (
    'a0000003-0000-4000-8000-000000000003',
    'c03',
    'Carla Mendes',
    'Data & Analytics',
    '2026-05-29',
    'Data Lake',
    'Saúde+ Vida',
    4,
    'Code review e pair programming',
    'rejeitado',
    null,
    'Horas divergentes do planejamento semanal. Reenviar com justificativa.'
  ),
  (
    'a0000004-0000-4000-8000-000000000004',
    'c04',
    'Diego Oliveira',
    'E-commerce',
    '2026-05-28',
    'App Marketplace',
    'ShopConnect',
    8,
    'Análise de requisitos e documentação',
    'aprovado',
    'Carlos RH',
    null
  ),
  (
    'a0000005-0000-4000-8000-000000000005',
    'c05',
    'Elena Rocha',
    'Inovação',
    '2026-05-27',
    'PoC Inovação',
    'Indústria Nova',
    2,
    'Workshop de discovery',
    'aprovado',
    'Patricia Líder',
    null
  )
on conflict (id) do nothing;
