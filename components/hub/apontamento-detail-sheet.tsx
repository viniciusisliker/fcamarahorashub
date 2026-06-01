"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/hub/status-badge";
import type { Apontamento } from "@/lib/types/apontamento";
import { formatHoras } from "@/lib/apontamentos/stats";

interface ApontamentoDetailSheetProps {
  apontamento: Apontamento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApontamentoDetailSheet({
  apontamento,
  open,
  onOpenChange,
}: ApontamentoDetailSheetProps) {
  if (!apontamento) return null;

  const dataFormatada = format(parseISO(apontamento.data), "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{apontamento.colaboradorNome}</SheetTitle>
          <SheetDescription className="capitalize">{dataFormatada}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-6 pb-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge status={apontamento.status} />
          </div>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Equipe</dt>
              <dd className="font-medium">{apontamento.equipe}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Projeto</dt>
              <dd className="font-medium">{apontamento.projeto}</dd>
            </div>
            {apontamento.cliente ? (
              <div>
                <dt className="text-muted-foreground">Cliente</dt>
                <dd className="font-medium">{apontamento.cliente}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted-foreground">Horas</dt>
              <dd className="text-2xl font-bold text-primary">
                {formatHoras(apontamento.horas)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Descrição</dt>
              <dd className="font-medium">{apontamento.descricao}</dd>
            </div>
            {apontamento.aprovadoPor ? (
              <div>
                <dt className="text-muted-foreground">Aprovado por</dt>
                <dd className="font-medium">{apontamento.aprovadoPor}</dd>
              </div>
            ) : null}
            {apontamento.observacoes ? (
              <div className="rounded-lg bg-muted p-3">
                <dt className="text-muted-foreground">Observações</dt>
                <dd className="mt-1 font-medium">{apontamento.observacoes}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </SheetContent>
    </Sheet>
  );
}
