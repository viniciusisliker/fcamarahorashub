"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { endOfMonth, startOfMonth } from "date-fns";

interface PeriodContextValue {
  inicio: Date;
  fim: Date;
  setPeriodo: (inicio: Date, fim: Date) => void;
  setMesAtual: () => void;
}

const PeriodContext = createContext<PeriodContextValue | null>(null);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const now = new Date();
  const [inicio, setInicio] = useState(() => startOfMonth(now));
  const [fim, setFim] = useState(() => endOfMonth(now));

  const setPeriodo = useCallback((start: Date, end: Date) => {
    setInicio(start);
    setFim(end);
  }, []);

  const setMesAtual = useCallback(() => {
    const n = new Date();
    setInicio(startOfMonth(n));
    setFim(endOfMonth(n));
  }, []);

  const value = useMemo(
    () => ({ inicio, fim, setPeriodo, setMesAtual }),
    [inicio, fim, setPeriodo, setMesAtual]
  );

  return (
    <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>
  );
}

export function usePeriod() {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error("usePeriod must be used within PeriodProvider");
  return ctx;
}
