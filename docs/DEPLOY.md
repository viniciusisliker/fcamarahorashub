# Deploy — fcamarahorashub

Stack alvo (mesmo nome em todos os serviços):

| Serviço | Nome do projeto | Função |
|---------|-----------------|--------|
| **GitHub** | `fcamarahorashub` | Repositório e CI |
| **Vercel** | `fcamarahorashub` | [ftimesheethub.vercel.app](https://ftimesheethub.vercel.app) — team **Vinicius Isliker's projects** — `prj_N2WRxmWV9jEBpa7W4NBL1QXKKqJe` |
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
4. Variáveis de ambiente:

**Produção (Vercel):** já definidas em [`vercel.json`](../vercel.json) (`NEXT_PUBLIC_USE_MOCK_DATA=false` + credenciais Supabase). Novo deploy aplica automaticamente.

**Local / CI:**

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` (padrão em `.env.example` e GitHub Actions) |
| `NEXT_PUBLIC_SUPABASE_URL` | Só se testar Supabase localmente |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon (pública; protegida por RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Não** — apenas rotas server/admin |

\** Nunca expor ao browser.

5. Deploy: push na `main` dispara build automático.

## 4. Integração Vercel ↔ Supabase

Opcional: instalar integração [Supabase no Vercel Marketplace](https://vercel.com/integrations/supabase) no projeto **fcamarahorashub** para sincronizar env vars.

## 5. Checklist pós-deploy

- [ ] `/` e `/login` redirecionam para `/dashboard`
- [ ] KPIs e gráfico carregam
- [ ] `/apontamentos` filtros e paginação
- [ ] Com `NEXT_PUBLIC_USE_MOCK_DATA=false`, dados vêm do Supabase
- [ ] RLS validado para perfil gestor/RH (fase auth)

## Estado atual

- UI completa; **produção** consome Supabase quando `NEXT_PUBLIC_USE_MOCK_DATA=false`.
- Local/CI usam mock por padrão (`NEXT_PUBLIC_USE_MOCK_DATA=true`).
- Schema + seed: `supabase/migrations/` (5 registros demo).
