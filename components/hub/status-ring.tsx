import type { StatusApontamento } from "@/lib/types/apontamento";

const statusColors: Record<StatusApontamento, string> = {
  aprovado: "var(--ftime-success)",
  pendente: "var(--ftime-warning)",
  rejeitado: "var(--ftime-danger)",
};

interface StatusRingProps {
  counts: Record<StatusApontamento, number>;
  total: number;
}

export function StatusRing({ counts, total }: StatusRingProps) {
  if (total === 0) {
    return (
      <div className="flex h-36 w-36 items-center justify-center rounded-full border border-dashed border-border text-xs text-muted-foreground">
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
    <div className="relative flex h-36 w-36 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full opacity-90"
        style={{ background: gradient }}
      />
      <div className="relative flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
        <span className="text-2xl font-extrabold tracking-tight">{total}</span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          registros
        </span>
      </div>
    </div>
  );
}

export function StatusLegend({
  counts,
}: {
  counts: Record<StatusApontamento, number>;
}) {
  const items: { key: StatusApontamento; label: string; color: string }[] = [
    { key: "aprovado", label: "Aprovados", color: statusColors.aprovado },
    { key: "pendente", label: "Pendentes", color: statusColors.pendente },
    { key: "rejeitado", label: "Rejeitados", color: statusColors.rejeitado },
  ];

  return (
    <ul className="space-y-2.5">
      {items.map(({ key, label, color }) => (
        <li key={key} className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            {label}
          </span>
          <span className="font-bold tabular-nums">{counts[key]}</span>
        </li>
      ))}
    </ul>
  );
}
