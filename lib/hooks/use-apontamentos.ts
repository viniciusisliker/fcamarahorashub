"use client";

import { useHubData } from "@/components/layout/hub-data-context";

export function useApontamentos() {
  const {
    apontamentos,
    apontamentosLoading,
    apontamentosError,
    refetchApontamentos,
  } = useHubData();

  return {
    apontamentos,
    loading: apontamentosLoading,
    error: apontamentosError,
    refetch: refetchApontamentos,
  };
}
