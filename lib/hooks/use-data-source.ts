"use client";

import { useHubData } from "@/components/layout/hub-data-context";
import { isPlanilhaReadOnlySource } from "@/lib/planilha/period-utils";

export function useDataSource() {
  const { dataSource } = useHubData();
  return {
    dataSource,
    isPlanilhaReadOnly: isPlanilhaReadOnlySource(dataSource),
  };
}
