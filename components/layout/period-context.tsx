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
import { addMonths, endOfMonth, parseISO, startOfMonth } from "date-fns";
import { useHubData } from "@/components/layout/hub-data-context";

const STORAGE_KEY = "ftimehub-periodo";

interface StoredPeriod {
  year: number;
  month: number;
}

interface PeriodContextValue {
  inicio: Date;
  fim: Date;
  setPeriodo: (inicio: Date, fim: Date) => void;
  setMesAno: (year: number, monthIndex: number) => void;
  shiftMes: (delta: number) => void;
  setMesAtual: () => void;
}

const PeriodContext = createContext<PeriodContextValue | null>(null);

function loadStoredPeriod(): { inicio: Date; fim: Date } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { year, month } = JSON.parse(raw) as StoredPeriod;
    if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
    const base = new Date(year, month, 1);
    return { inicio: startOfMonth(base), fim: endOfMonth(base) };
  } catch {
    return null;
  }
}

function persistPeriod(inicio: Date) {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredPeriod = { year: inicio.getFullYear(), month: inicio.getMonth() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

function applyMonth(year: number, monthIndex: number) {
  const base = new Date(year, monthIndex, 1);
  return { inicio: startOfMonth(base), fim: endOfMonth(base) };
}

export function PeriodProvider({ children }: { children: ReactNode }) {
  const { planilhaMeta, planilhaAvailable, planilhaLoading } = useHubData();
  const now = new Date();
  const [inicio, setInicio] = useState(() => startOfMonth(now));
  const [fim, setFim] = useState(() => endOfMonth(now));
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const stored = loadStoredPeriod();
    if (stored) {
      initialized.current = true;
      setInicio(stored.inicio);
      setFim(stored.fim);
      return;
    }

    if (planilhaLoading) return;
    initialized.current = true;

    const inicioIso = planilhaMeta?.periodo?.inicio;
    if (planilhaAvailable && inicioIso) {
      const d = parseISO(inicioIso);
      const next = applyMonth(d.getFullYear(), d.getMonth());
      setInicio(next.inicio);
      setFim(next.fim);
      persistPeriod(next.inicio);
    }
  }, [planilhaAvailable, planilhaLoading, planilhaMeta]);

  const setPeriodo = useCallback((start: Date, end: Date) => {
    const monthStart = startOfMonth(start);
    const monthEnd = endOfMonth(end);
    setInicio(monthStart);
    setFim(monthEnd);
    persistPeriod(monthStart);
  }, []);

  const setMesAno = useCallback((year: number, monthIndex: number) => {
    const next = applyMonth(year, monthIndex);
    setInicio(next.inicio);
    setFim(next.fim);
    persistPeriod(next.inicio);
  }, []);

  const shiftMes = useCallback((delta: number) => {
    setInicio((prev) => {
      const nextStart = startOfMonth(addMonths(prev, delta));
      const nextEnd = endOfMonth(nextStart);
      setFim(nextEnd);
      persistPeriod(nextStart);
      return nextStart;
    });
  }, []);

  const setMesAtual = useCallback(() => {
    const n = new Date();
    const next = applyMonth(n.getFullYear(), n.getMonth());
    setInicio(next.inicio);
    setFim(next.fim);
    persistPeriod(next.inicio);
  }, []);

  const value = useMemo(
    () => ({ inicio, fim, setPeriodo, setMesAno, shiftMes, setMesAtual }),
    [inicio, fim, setPeriodo, setMesAno, shiftMes, setMesAtual]
  );

  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>;
}

export function usePeriod() {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error("usePeriod must be used within PeriodProvider");
  return ctx;
}
