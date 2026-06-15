import type { StatusApontamento } from "@/lib/types/apontamento";
import { cn } from "@/lib/utils";

const statusColors: Record<StatusApontamento, string> = {
  aprovado: "var(--ftime-success)",
  pendente: "var(--ftime-warning)",
  rejeitado: "var(--ftime-danger)",
};

interface StatusRingProps {
  counts: Record<StatusApontamento, number>;
  total: number;
  size?: "md" | "lg";
}

const ringSizes = {
  md: {
    outer: "h-[7.5rem] w-[7.5rem] sm:h-[8.5rem] sm:w-[8.5rem]",
    inner: "h-[5.25rem] w-[5.25rem] sm:h-[6rem] sm:w-[6rem]",
    total: "text-lg sm:text-xl",
    label: "text-[8px] sm:text-[9px]",
  },
  lg: {
    outer: "h-32 w-32 sm:h-36 sm:w-36",
    inner: "h-[5.75rem] w-[5.75rem] sm:h-[6.5rem] sm:w-[6.5rem]",
    total: "text-xl sm:text-2xl",
    label: "text-[9px] sm:text-[10px]",
  },
};

export function StatusRing({ counts, total, size = "lg" }: StatusRingProps) {
  const sizes = ringSizes[size];

  if (total === 0) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border border-dashed border-border text-xs text-muted-foreground",
          sizes.outer
        )}
      >
        Sem dados
      </div>
    );
  }

  const aPct = (counts.aprovado / total) * 100;
  const pPct = (counts.pendente / total) * 100;
  const aEnd = aPct;
  const pEnd = aEnd + pPct;

  const gradient = `conic-gradient(
    ${statusColors.aprovado} 0% ${aEnd}%,
    ${statusColors.pendente} ${aEnd}% ${pEnd}%,
    ${statusColors.rejeitado} ${pEnd}% 100%
  )`;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        sizes.outer
      )}
      role="img"
      aria-label={`${total} registros: ${counts.aprovado} aprovados, ${counts.pendente} pendentes, ${counts.rejeitado} rejeitados`}
    >
      <div
        className="absolute inset-0 rounded-full opacity-95 ring-1 ring-black/[0.04]"
        style={{ background: gradient }}
      />
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-full bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ring-1 ring-border/60",
          sizes.inner
        )}
      >
        <span className={cn("font-extrabold leading-none tracking-tight", sizes.total)}>
          {total.toLocaleString("pt-BR")}
        </span>
        <span
          className={cn(
            "mt-1 font-semibold uppercase tracking-[0.14em] text-muted-foreground",
            sizes.label
          )}
        >
          registros
        </span>
      </div>
    </div>
  );
}

export function StatusLegend({
  counts,
  total,
}: {
  counts: Record<StatusApontamento, number>;
  total: number;
}) {
  const items: { key: StatusApontamento; label: string; color: string }[] = [
    { key: "aprovado", label: "Aprovados", color: statusColors.aprovado },
    { key: "pendente", label: "Pendentes", color: statusColors.pendente },
    { key: "rejeitado", label: "Rejeitados", color: statusColors.rejeitado },
  ];

  return (
    <ul className="w-full min-w-0 space-y-2.5 sm:w-[11.5rem]">
      {items.map(({ key, label, color }) => {
        const count = counts[key];
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <li key={key}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5">
              <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/5"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
                <span className="truncate">{label}</span>
              </span>
              <span className="text-right text-sm font-bold tabular-nums text-foreground">
                {count.toLocaleString("pt-BR")}
              </span>
              <div className="col-span-2 h-1 overflow-hidden rounded-full bg-muted/80">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color,
                    minWidth: count > 0 ? "4px" : 0,
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

interface StatusDistributionProps {
  counts: Record<StatusApontamento, number>;
  total: number;
  className?: string;
}

/** Anel + legenda alinhados ao painel, com altura compatível aos gráficos adjacentes. */
export function StatusDistribution({ counts, total, className }: StatusDistributionProps) {
  return (
    <div
      className={cn(
        "grid h-full min-h-[220px] w-full flex-1 place-content-center gap-6 sm:min-h-[260px] sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8 lg:min-h-[300px]",
        className
      )}
    >
      <div className="flex justify-center sm:justify-end">
        <StatusRing counts={counts} total={total} size="md" />
      </div>
      <div className="mx-auto w-full max-w-[14rem] sm:mx-0 sm:max-w-none sm:justify-self-start">
        <StatusLegend counts={counts} total={total} />
      </div>
    </div>
  );
}
