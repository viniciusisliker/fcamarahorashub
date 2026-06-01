# Design tokens — Hub de Apontamentos FCamara

Tokens alinhados à identidade visual de [fcamara.com](https://fcamara.com/), com laranja de marca (#OrangeTeam / #SangueLaranja) e neutros para produto de dados.

## Cores

| Token | Valor | Uso |
|-------|-------|-----|
| `--fcamara-orange` | `#FF4D00` | Primária: CTAs, links ativos, destaques |
| `--fcamara-orange-hover` | `#E64500` | Hover em botões primários |
| `--fcamara-orange-muted` | `#FFF4EE` | Fundos suaves com tom laranja |
| `--fcamara-dark` | `#121212` | Seções escuras, footer, sidebar em destaque |
| `--fcamara-dark-elevated` | `#1E1E1E` | Cards sobre fundo escuro |
| `--fcamara-surface` | `#FAFAFA` | Fundo da área logada |
| `--fcamara-surface-elevated` | `#FFFFFF` | Cards e painéis |
| `--fcamara-muted` | `#6B7280` | Texto secundário |
| `--fcamara-border` | `#E5E7EB` | Bordas e divisores |
| `--fcamara-success` | `#059669` | Status aprovado |
| `--fcamara-warning` | `#D97706` | Status pendente |
| `--fcamara-danger` | `#DC2626` | Status rejeitado |

> **Nota:** O site institucional usa fonte custom via `ma-customfonts`. Neste Hub usamos **DM Sans** (Google Fonts) como fallback corporativo até confirmação da fonte licenciada.

## Tipografia

- Família: `var(--font-dm-sans)` — DM Sans
- Títulos de página: `text-3xl font-bold tracking-tight`
- Subtítulos: `text-muted-foreground text-base`
- Tabela: `text-sm`

## Espaçamento e forma

| Token | Valor |
|-------|-------|
| `--radius-card` | `12px` |
| `--shadow-card` | `0 4px 24px rgba(0, 0, 0, 0.06)` |
| Padding de seção | `1.5rem` (mobile) / `2rem` (desktop) |

## Mapeamento shadcn / Tailwind

Definidos em `app/globals.css` via `@theme inline` como `--color-primary`, `--color-background`, etc.
