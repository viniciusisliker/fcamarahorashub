"use client";

import { useEffect, useState } from "react";
import type { PlanilhaMeta, UnificacaoAnalista } from "@/lib/types/planilha";

export function usePlanilhaGraficos() {
  const [meta, setMeta] = useState<PlanilhaMeta | null>(null);
  const [unificacao, setUnificacao] = useState<UnificacaoAnalista[]>([]);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/planilha/graficos");
        if (!res.ok) {
          if (!cancelled) setAvailable(false);
          return;
        }
        const data = (await res.json()) as {
          meta: PlanilhaMeta;
          unificacao: UnificacaoAnalista[];
        };
        if (!cancelled) {
          setMeta(data.meta);
          setUnificacao(data.unificacao);
          setAvailable(true);
        }
      } catch {
        if (!cancelled) setAvailable(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { meta, unificacao, loading, available };
}
