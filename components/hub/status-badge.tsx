import { Badge } from "@/components/ui/badge";
import type { StatusApontamento } from "@/lib/types/apontamento";
import { cn } from "@/lib/utils";

const labels: Record<StatusApontamento, string> = {
  aprovado: "Aprovado",
  pendente: "Pendente",
  rejeitado: "Rejeitado",
};

const config: Record<
  StatusApontamento,
  { variant: "success" | "warning" | "danger"; dot: string }
> = {
  aprovado: { variant: "success", dot: "bg-emerald-500" },
  pendente: { variant: "warning", dot: "bg-amber-500" },
  rejeitado: { variant: "danger", dot: "bg-red-500" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: StatusApontamento;
  className?: string;
}) {
  const { variant, dot } = config[status];
  return (
    <Badge variant={variant} className={cn("gap-1.5 pl-2", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden />
      {labels[status]}
    </Badge>
  );
}
