import { Badge } from "@/components/ui/badge";
import type { StatusApontamento } from "@/lib/types/apontamento";

const labels: Record<StatusApontamento, string> = {
  aprovado: "Aprovado",
  pendente: "Pendente",
  rejeitado: "Rejeitado",
};

const variants: Record<
  StatusApontamento,
  "success" | "warning" | "danger"
> = {
  aprovado: "success",
  pendente: "warning",
  rejeitado: "danger",
};

export function StatusBadge({ status }: { status: StatusApontamento }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
