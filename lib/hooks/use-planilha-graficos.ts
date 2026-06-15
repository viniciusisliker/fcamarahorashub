"use client";

import { useHubData } from "@/components/layout/hub-data-context";

export function usePlanilhaGraficos() {
  const {
    planilhaMeta,
    unificacao,
    planilhaLoading,
    planilhaError,
    planilhaAvailable,
    refetchPlanilha,
  } = useHubData();

  return {
    meta: planilhaMeta,
    unificacao,
    loading: planilhaLoading,
    error: planilhaError,
    available: planilhaAvailable,
    refetch: refetchPlanilha,
  };
}
