import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Apontamento } from "@/lib/types/apontamento";
function escapeCsv(value: string | number | null | undefined): string {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildApontamentosCsv(items: Apontamento[]): string {
  const headers = [
    "Data",
    "Colaborador",
    "Equipe",
    "Projeto",
    "Cliente",
    "Horas",
    "Status",
    "Descrição",
  ];

  const rows = items.map((a) =>
    [
      format(parseISO(a.data), "dd/MM/yyyy", { locale: ptBR }),
      a.colaboradorNome,
      a.equipe,
      a.projeto,
      a.cliente ?? "",
      a.horas,
      a.status,
      a.descricao,
    ]
      .map(escapeCsv)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export function buildApontamentosExportFilename(
  inicio: Date,
  prefix = "apontamentos"
): string {
  const mesAno = format(inicio, "yyyy-MM", { locale: ptBR });
  return `${prefix}-${mesAno}.csv`;
}

export function downloadApontamentosCsv(items: Apontamento[], filename: string): void {  const csv = buildApontamentosCsv(items);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
