# Deploy — fcamarahorashub

Stack alvo (mesmo nome em todos os serviços):

| Serviço | Nome do projeto | Função |
|---------|-----------------|--------|
| **GitHub** | `fcamarahorashub` | Repositório e CI |
| **Vercel** | `fcamarahorashub` | [ftimehub.vercel.app](https://ftimehub.vercel.app) — team **Vinicius Isliker's projects** — `prj_N2WRxmWV9jEBpa7W4NBL1QXKKqJe` |
| **Supabase** | `fcamarahorashub` | Ref `kjfwstmxldxbbuwmjtji` — org FCamara |

## 1. GitHub

Commits locais já existem em `C:\dev\fcamarahorashub` (branch `main`).

```powershell
gh auth login
cd C:\dev\fcamarahorashub
.\scripts\deploy-github.ps1
```

Ou manualmente:

```bash
gh repo create fcamarahorashub --public --source=. --remote=origin --push
```

## 2. Supabase

> **Cota free:** se aparecer erro de limite de projetos, pause ou exclua um projeto antigo no [dashboard](https://supabase.com/dashboard) antes de criar **fcamarahorashub**.

1. Criar projeto **fcamarahorashub** no [dashboard](https://supabase.com/dashboard) (região `sa-east-1` recomendada).
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
| `NEXT_PUBLIC_SUPABASE_URL` | Sim (prod) | `https://kjfwstmxldxbbuwmjtji.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim (prod) | Chave anon/publishable do projeto |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Sim | `true` = mock (local/CI); `false` = Supabase (produção) |
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

## Estado atual

- UI completa; **produção** consome Supabase quando `NEXT_PUBLIC_USE_MOCK_DATA=false`.
- Local/CI usam mock por padrão (`NEXT_PUBLIC_USE_MOCK_DATA=true`).
- Schema + seed: `supabase/migrations/` (5 registros demo).
