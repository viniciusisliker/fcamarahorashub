"use client";

import { useEffect, useState } from "react";
import type { Apontamento } from "@/lib/types/apontamento";

export function useApontamentos() {
  const [apontamentos, setApontamentos] = useState<Apontamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/apontamentos");
        if (!res.ok) throw new Error("Falha ao carregar apontamentos");
        const data = (await res.json()) as Apontamento[];
        if (!cancelled) setApontamentos(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erro desconhecido");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { apontamentos, loading, error };
}
