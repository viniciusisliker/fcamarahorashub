"use client";

import { useEffect, useState } from "react";
import type { AnalistaPlanilha } from "@/lib/types/planilha";
import { useHubData } from "@/components/layout/hub-data-context";

export function useAnalistasPlanilha() {
  const { planilhaAvailable } = useHubData();
  const [analistas, setAnalistas] = useState<AnalistaPlanilha[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!planilhaAvailable) {
      setAnalistas([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetch("/api/planilha/analistas")
      .then(async (res) => {
        if (!res.ok) return [] as AnalistaPlanilha[];
        return (await res.json()) as AnalistaPlanilha[];
      })
      .then((data) => {
        if (!cancelled) setAnalistas(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [planilhaAvailable]);

  return { analistas, loading };
}
