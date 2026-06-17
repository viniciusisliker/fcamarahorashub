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

Projeto: **fcamarahorashub** — ref `kjfwstmxldxbbuwmjtji` — [dashboard](https://supabase.com/dashboard/project/kjfwstmxldxbbuwmjtji)

1. Instalar CLI: `npm i -g supabase`
2. Vincular: `supabase link --project-ref kjfwstmxldxbbuwmjtji`
3. Aplicar migrations: `supabase db push`
4. Copiar do dashboard → Settings → API:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (só servidor / import)

### Importar dados da planilha Tommy

Após `export-planilha` (ou com JSON já em `data/planilha/`):

```powershell
copy .env.example .env.local
# Preencher URL + service_role em .env.local
npm run import-planilha-supabase
```

Isso carrega `apontamentos`, `planilha_analistas`, `planilha_unificacao` e `planilha_meta` no Postgres. Repita após cada nova extração.

Migrations: `supabase/migrations/` (apontamentos + tabelas planilha).

## 3. Vercel

1. Projeto **fcamarahorashub** → [ftimesheethub.vercel.app](https://ftimesheethub.vercel.app)
2. **Environment Variables** (Production):

| Variável | Valor |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://kjfwstmxldxbbuwmjtji.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave anon do dashboard |
| `NEXT_PUBLIC_DATA_SOURCE` | `supabase` (também em `vercel.json`) |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `false` (também em `vercel.json`) |
| `NEXT_PUBLIC_SITE_URL` | `https://ftimesheethub.vercel.app` |

`SUPABASE_SERVICE_ROLE_KEY` **não** vai na Vercel — só localmente para `import-planilha-supabase`.

3. Deploy: push na `main` dispara build automático.

## 4. Integração Vercel ↔ Supabase

Opcional: instalar integração [Supabase no Vercel Marketplace](https://vercel.com/integrations/supabase) no projeto **fcamarahorashub** para sincronizar env vars.

## 5. Checklist pós-deploy

- [ ] `/` e `/login` redirecionam para `/dashboard`
- [ ] KPIs e gráfico carregam
- [ ] `/apontamentos` filtros e paginação
- [ ] Com `NEXT_PUBLIC_USE_MOCK_DATA=false`, dados vêm do Supabase
- [ ] RLS validado para perfil gestor/RH (fase auth)

## Estado atual

- **Produção:** `NEXT_PUBLIC_DATA_SOURCE=supabase` — dados da extração Tommy no Postgres.
- **Import:** `npm run import-planilha-supabase` após export da planilha.
- **Manter projeto ativo:** tráfego real do hub + reimport periódico evitam pausa no plano free.
