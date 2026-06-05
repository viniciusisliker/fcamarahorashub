# Hub de Apontamentos — FCamara

Hub web para gestores e RH consultarem apontamentos de horas dos colaboradores. Identidade visual inspirada em [fcamara.com](https://fcamara.com/).

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Deploy:** [Vercel](https://vercel.com) — [ftimehub.vercel.app](https://ftimehub.vercel.app)
- **Dados:** [Supabase](https://supabase.com) `fcamarahorashub` (schema preparado; UI usa mock por padrão)
- **Repo:** GitHub `fcamarahorashub`

## Desenvolvimento local

> **Workspace recomendado:** `C:\dev\fcamarahorashub` (fora do OneDrive). O projeto foi validado com `npm run build` neste caminho. Evite `npm install` em pastas sincronizadas pelo OneDrive.

```bash
cd C:\dev\fcamarahorashub
copy .env.example .env.local
npm install
npm run dev
```

Scripts usam **Webpack** (`--webpack`) por compatibilidade Windows.

Abra [http://localhost:3000](http://localhost:3000) → redireciona para `/dashboard`.

| Rota | Descrição |
|------|-----------|
| `/login` | Entrada mock (sem auth real) |
| `/dashboard` | KPIs e gráfico |
| `/apontamentos` | Tabela com filtros e detalhe |

## Variáveis de ambiente

Veja [.env.example](.env.example). Com `NEXT_PUBLIC_USE_MOCK_DATA=true` (padrão), nenhuma credencial Supabase é necessária.

## Deploy

Instruções completas em [docs/DEPLOY.md](docs/DEPLOY.md).

Design tokens: [docs/design-tokens.md](docs/design-tokens.md).
