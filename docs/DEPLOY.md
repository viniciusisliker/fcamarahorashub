# Deploy — fcamarahorashub

Stack alvo (mesmo nome em todos os serviços):

| Serviço | Nome do projeto | Função |
|---------|-----------------|--------|
| **GitHub** | `fcamarahorashub` | Repositório e CI |
| **Vercel** | `fcamarahorashub` | Hosting Next.js |
| **Supabase** | `fcamarahorashub` | Postgres, Auth (futuro), API |

## 1. GitHub

```bash
git init
git add .
git commit -m "feat: hub de apontamentos — design v0.1"
git branch -M main
git remote add origin https://github.com/<org>/fcamarahorashub.git
git push -u origin main
```

## 2. Supabase

1. Criar/confirmar projeto **fcamarahorashub** no [dashboard](https://supabase.com/dashboard).
2. Instalar CLI: `npm i -g supabase` (ou usar MCP Supabase no Cursor).
3. Vincular: `supabase link --project-ref <project-ref>`
4. Aplicar migrations: `supabase db push`
5. Copiar URL e **anon/publishable key** para o Vercel.

Schema inicial: `supabase/migrations/20250601000000_apontamentos.sql`

## 3. Vercel

1. Importar repositório **fcamarahorashub** em [vercel.com/new](https://vercel.com/new).
2. Nome do projeto: **fcamarahorashub**.
3. Framework: Next.js (detectado automaticamente).
4. Variáveis de ambiente (Production + Preview):

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim* | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim* | Chave pública |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Não | `true` = mock; `false` = Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Não** | Apenas rotas server/admin |

\* Obrigatórias quando `NEXT_PUBLIC_USE_MOCK_DATA=false`.  
\** Nunca marcar como exposta ao browser no Vercel.

5. Deploy: push na `main` dispara build automático.

## 4. Integração Vercel ↔ Supabase

Opcional: instalar integração [Supabase no Vercel Marketplace](https://vercel.com/integrations/supabase) no projeto **fcamarahorashub** para sincronizar env vars.

## 5. Checklist pós-deploy

- [ ] `/login` → Entrar → `/dashboard`
- [ ] KPIs e gráfico carregam
- [ ] `/apontamentos` filtros e paginação
- [ ] Com `NEXT_PUBLIC_USE_MOCK_DATA=false`, dados vêm do Supabase
- [ ] RLS validado para perfil gestor/RH (fase auth)

## Estado atual (fase design)

- UI completa com **dados mock**.
- Schema Supabase **preparado**, consumo real na **próxima fase** (`lib/data/apontamentos.ts`).
