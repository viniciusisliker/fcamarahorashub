# FTimeSheetHub

Hub web para gestores e RH consultarem apontamentos de horas dos colaboradores.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Deploy:** [Vercel](https://vercel.com) — [ftimesheethub.vercel.app](https://ftimesheethub.vercel.app)
- **Dados:** mock local, [Supabase](https://supabase.com) ou JSON da planilha Tommy (`data/planilha/`)
- **PWA:** instalação no mobile/desktop
- **Tema:** claro / escuro com persistência

## Desenvolvimento local

```bash
cd C:\dev\FCamara\fcamarahorashub
copy .env.example .env.local
npm install
npm run dev
```

Scripts usam **Webpack** (`--webpack`) por compatibilidade Windows.

Abra [http://localhost:3000](http://localhost:3000) → redireciona para `/dashboard`.

| Rota | Descrição |
|------|-----------|
| `/dashboard` | KPIs, gráficos e visão geral |
| `/apontamentos` | Tabela com filtros, ordenação, export CSV |
| `/relatorios` | Relatórios consolidados e comparativo Tommy |

## Fonte de dados

Configure em `.env.local`:

| Variável | Valores | Descrição |
|----------|---------|-----------|
| `NEXT_PUBLIC_DATA_SOURCE` | `planilha` \| `supabase` \| `mock` | Fonte principal |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` \| `false` | Fallback mock quando Supabase ausente |

**Planilha Tommy:** `npm run export-planilha` → `npm run import-planilha-supabase` (grava no Supabase).

## Variáveis de ambiente

Veja [.env.example](.env.example). Credenciais Supabase devem ficar nas **Environment Variables da Vercel**, não versionadas.

## Testes

```bash
npm test
```

## Deploy

Instruções em [docs/DEPLOY.md](docs/DEPLOY.md).

Design tokens: [docs/design-tokens.md](docs/design-tokens.md).
