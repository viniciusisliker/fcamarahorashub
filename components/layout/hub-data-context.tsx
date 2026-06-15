"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Apontamento } from "@/lib/types/apontamento";
import type { PlanilhaMeta, UnificacaoAnalista } from "@/lib/types/planilha";

export type HubDataSource = "mock" | "supabase" | "planilha";

interface HubDataContextValue {
  apontamentos: Apontamento[];
  apontamentosLoading: boolean;
  apontamentosError: string | null;
  refetchApontamentos: () => void;
  planilhaMeta: PlanilhaMeta | null;
  unificacao: UnificacaoAnalista[];
  planilhaLoading: boolean;
  planilhaError: string | null;
  planilhaAvailable: boolean;
  refetchPlanilha: () => void;
  dataSource: HubDataSource;
  refetchAll: () => void;
}

const HubDataContext = createContext<HubDataContextValue | null>(null);

function resolveDataSource(
  fromApi: string | undefined,
  planilhaAvailable: boolean
): HubDataSource {
  if (fromApi === "planilha" || fromApi === "supabase" || fromApi === "mock") {
    return fromApi;
  }
  const env = process.env.NEXT_PUBLIC_DATA_SOURCE;
  if (env === "planilha" || env === "supabase" || env === "mock") return env;
  if (planilhaAvailable) return "planilha";
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false") return "mock";
  return "supabase";
}

export function HubDataProvider({ children }: { children: ReactNode }) {
  const [apontamentos, setApontamentos] = useState<Apontamento[]>([]);
  const [apontamentosLoading, setApontamentosLoading] = useState(true);
  const [apontamentosError, setApontamentosError] = useState<string | null>(null);

  const [planilhaMeta, setPlanilhaMeta] = useState<PlanilhaMeta | null>(null);
  const [unificacao, setUnificacao] = useState<UnificacaoAnalista[]>([]);
  const [planilhaLoading, setPlanilhaLoading] = useState(true);
  const [planilhaError, setPlanilhaError] = useState<string | null>(null);
  const [planilhaAvailable, setPlanilhaAvailable] = useState(false);
  const [dataSource, setDataSource] = useState<HubDataSource>("mock");

  const fetchId = useRef(0);

  const load = useCallback(async () => {
    const id = ++fetchId.current;
    setApontamentosLoading(true);
    setPlanilhaLoading(true);
    setApontamentosError(null);
    setPlanilhaError(null);

    const [apontamentosRes, planilhaRes, metaRes] = await Promise.all([
      fetch("/api/apontamentos"),
      fetch("/api/planilha/graficos"),
      fetch("/api/meta"),
    ]);

    if (id !== fetchId.current) return;

    if (apontamentosRes.ok) {
      const data = (await apontamentosRes.json()) as Apontamento[];
      setApontamentos(data);
    } else {
      setApontamentos([]);
      setApontamentosError("Não foi possível carregar os apontamentos.");
    }
    setApontamentosLoading(false);

    let planilhaOk = false;
    if (planilhaRes.ok) {
      const data = (await planilhaRes.json()) as {
        meta: PlanilhaMeta;
        unificacao: UnificacaoAnalista[];
      };
      setPlanilhaMeta(data.meta);
      setUnificacao(data.unificacao);
      planilhaOk = true;
    } else {
      setPlanilhaMeta(null);
      setUnificacao([]);
      if (planilhaRes.status !== 404) {
        setPlanilhaError("Não foi possível carregar os dados da planilha.");
      }
    }
    setPlanilhaAvailable(planilhaOk);
    setPlanilhaLoading(false);

    if (metaRes.ok) {
      const meta = (await metaRes.json()) as { dataSource?: string };
      setDataSource(resolveDataSource(meta.dataSource, planilhaOk));
    } else {
      setDataSource(resolveDataSource(undefined, planilhaOk));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo(
    (): HubDataContextValue => ({
      apontamentos,
      apontamentosLoading,
      apontamentosError,
      refetchApontamentos: load,
      planilhaMeta,
      unificacao,
      planilhaLoading,
      planilhaError,
      planilhaAvailable,
      refetchPlanilha: load,
      dataSource,
      refetchAll: load,
    }),
    [
      apontamentos,
      apontamentosLoading,
      apontamentosError,
      planilhaMeta,
      unificacao,
      planilhaLoading,
      planilhaError,
      planilhaAvailable,
      dataSource,
      load,
    ]
  );

  return <HubDataContext.Provider value={value}>{children}</HubDataContext.Provider>;
}

export function useHubData() {
  const ctx = useContext(HubDataContext);
  if (!ctx) throw new Error("useHubData must be used within HubDataProvider");
  return ctx;
}
