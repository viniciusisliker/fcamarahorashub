"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDown, ExternalLink, Mail } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/hub/status-badge";
import { Button } from "@/components/ui/button";
import { formatHoras, formatPeriodoLabel } from "@/lib/apontamentos/stats";
import type { ColaboradorDetalhe, StatusCadastroColaborador } from "@/lib/types/colaborador";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 30;

interface ColaboradorDetailSheetProps {
  colaborador: ColaboradorDetalhe | null;
  periodoInicio: Date;
  periodoFim: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getIniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function CadastroStatusBadge({ status }: { status: StatusCadastroColaborador }) {
  const styles = {
    ativo: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
    inativo: "bg-white/10 text-white/60 ring-white/15",
    sem_cadastro: "bg-amber-500/15 text-amber-200 ring-amber-500/25",
  } as const;
  const labels = {
    ativo: "Ativo",
    inativo: "Inativo",
    sem_cadastro: "Sem cadastro",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}

export function ColaboradorDetailSheet({
  colaborador,
  periodoInicio,
  periodoFim,
  open,
  onOpenChange,
}: ColaboradorDetailSheetProps) {
  const [visibleApontamentos, setVisibleApontamentos] = useState(PAGE_SIZE);
  const [visibleProjetos, setVisibleProjetos] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleApontamentos(PAGE_SIZE);
    setVisibleProjetos(PAGE_SIZE);
  }, [colaborador?.id, open]);

  if (!colaborador) return null;

  const iniciais = getIniciais(colaborador.nome);
  const periodoLabel = formatPeriodoLabel(periodoInicio, periodoFim);
  const podeVerApontamentos =
    colaborador.apontamentosPeriodo > 0 && !colaborador.id.startsWith("cadastro-");

  const projetosVisiveis = colaborador.projetos.slice(0, visibleProjetos);
  const apontamentosVisiveis = colaborador.apontamentosRecentes.slice(0, visibleApontamentos);
  const hasMoreProjetos = visibleProjetos < colaborador.projetos.length;
  const hasMoreApontamentos = visibleApontamentos < colaborador.apontamentosRecentes.length;

  const infoFields = [
    ...(colaborador.cargo ? [{ label: "Cargo", value: colaborador.cargo }] : []),
    ...(colaborador.email ? [{ label: "E-mail", value: colaborador.email, isEmail: true }] : []),
    { label: "Equipe", value: colaborador.equipe },
    ...(colaborador.responsavel ? [{ label: "Responsável", value: colaborador.responsavel }] : []),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full max-h-[100dvh] flex-col gap-0 overflow-hidden border-l-border/80 bg-[var(--ftime-surface)] p-0 sm:max-w-md [&>button]:text-white [&>button]:opacity-80 [&>button]:hover:bg-white/10 [&>button]:hover:opacity-100">
        <div className="relative shrink-0 bg-gradient-to-br from-[var(--ftime-ink)] via-[var(--ftime-ink-soft)] to-[#1a1020] px-6 pb-6 pt-6 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />

          <div className="relative space-y-5">
            <div className="flex items-start gap-4 pr-8">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#c93a00] text-lg font-bold shadow-lg shadow-primary/30">
                {iniciais}
              </span>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-left text-lg font-bold leading-snug text-white sm:text-xl">
                  {colaborador.nome}
                </SheetTitle>
                <p className="mt-1 text-sm text-white/55">{periodoLabel}</p>
              </div>
              <CadastroStatusBadge status={colaborador.statusCadastro} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Horas", value: formatHoras(Math.round(colaborador.horasPeriodo * 10) / 10) },
                { label: "Lançamentos", value: String(colaborador.apontamentosPeriodo) },
                { label: "Projetos", value: String(colaborador.projetosPeriodo) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-center backdrop-blur-sm"
                >
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/45">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-lg font-bold tabular-nums text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hub-scroll-pane min-h-0 flex-1 space-y-5 bg-[var(--ftime-surface)] px-6 py-6">
          {infoFields.length > 0 ? (
            <dl className="grid gap-3 text-sm">
              {infoFields.map(({ label, value, isEmail }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border/80 bg-card/80 p-4"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 break-words font-semibold leading-snug">
                    {isEmail ? (
                      <a
                        href={`mailto:${value}`}
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {colaborador.ultimoApontamento ? (
            <div className="rounded-xl border border-border/80 bg-card/80 p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Último lançamento no período
              </p>
              <p className="mt-1 font-semibold capitalize text-foreground">
                {format(parseISO(colaborador.ultimoApontamento), "EEEE, d 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              Nenhum lançamento registrado neste período.
            </div>
          )}

          {colaborador.projetos.length > 0 ? (
            <div className="rounded-xl border border-border/80 bg-card/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Projetos no período
                <span className="ml-1 font-normal normal-case text-muted-foreground/80">
                  ({projetosVisiveis.length} de {colaborador.projetos.length})
                </span>
              </p>
              <ul className="mt-3 space-y-2">
                {projetosVisiveis.map((projeto) => (
                  <li
                    key={projeto}
                    className="rounded-lg bg-muted/40 px-3 py-2 text-sm leading-snug text-foreground"
                  >
                    {projeto}
                  </li>
                ))}
              </ul>
              {hasMoreProjetos ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full gap-2 rounded-full"
                  onClick={() => setVisibleProjetos((n) => n + PAGE_SIZE)}
                >
                  Mostrar mais
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </Button>
              ) : null}
            </div>
          ) : null}

          {colaborador.apontamentosRecentes.length > 0 ? (
            <div className="rounded-xl border border-border/80 bg-card/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Lançamentos no período
                <span className="ml-1 font-normal normal-case text-muted-foreground/80">
                  ({apontamentosVisiveis.length} de {colaborador.apontamentosRecentes.length})
                </span>
              </p>
              <ul className="mt-3 divide-y divide-border/60">
                {apontamentosVisiveis.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {format(parseISO(a.data), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.projeto}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-semibold tabular-nums">
                        {formatHoras(Math.round(a.horas * 10) / 10)}
                      </span>
                      <StatusBadge status={a.status} />
                    </div>
                  </li>
                ))}
              </ul>
              {hasMoreApontamentos ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full gap-2 rounded-full"
                  onClick={() => setVisibleApontamentos((n) => n + PAGE_SIZE)}
                >
                  Mostrar mais
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </Button>
              ) : null}
            </div>
          ) : null}

          {podeVerApontamentos ? (
            <Button className="w-full gap-2 rounded-full" asChild>
              <Link href={`/apontamentos?colaborador=${encodeURIComponent(colaborador.id)}`}>
                Ver todos os apontamentos
                <ExternalLink className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
