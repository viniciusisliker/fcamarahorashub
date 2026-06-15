"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  defaultColumnWidths,
  minColumnWidths,
} from "@/lib/apontamentos/table";

const STORAGE_KEY = "ftimehub-apontamentos-columns";

function loadWidths(): Record<string, number> {
  if (typeof window === "undefined") return { ...defaultColumnWidths };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultColumnWidths };
    const parsed = JSON.parse(raw) as Record<string, number>;
    return { ...defaultColumnWidths, ...parsed };
  } catch {
    return { ...defaultColumnWidths };
  }
}

export function useResizableColumns(columnIds: string[]) {
  const [widths, setWidths] = useState<Record<string, number>>(() => ({
    ...defaultColumnWidths,
  }));
  const resizing = useRef<{ id: string; startX: number; startWidth: number } | null>(
    null
  );

  useEffect(() => {
    setWidths(loadWidths());
  }, []);

  const persist = useCallback((next: Record<string, number>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const startResize = useCallback(
    (id: string, clientX: number) => {
      resizing.current = {
        id,
        startX: clientX,
        startWidth: widths[id] ?? defaultColumnWidths[id] ?? 120,
      };

      const onMove = (event: MouseEvent) => {
        if (!resizing.current) return;
        const { id: colId, startX, startWidth } = resizing.current;
        const min = minColumnWidths[colId] ?? 72;
        const nextWidth = Math.max(min, startWidth + (event.clientX - startX));
        setWidths((prev) => ({ ...prev, [colId]: nextWidth }));
      };

      const onUp = () => {
        if (resizing.current) {
          setWidths((prev) => {
            persist(prev);
            return prev;
          });
        }
        resizing.current = null;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [persist, widths]
  );

  const resetWidths = useCallback(() => {
    const next = { ...defaultColumnWidths };
    setWidths(next);
    persist(next);
  }, [persist]);

  const totalWidth = columnIds.reduce(
    (sum, id) => sum + (widths[id] ?? defaultColumnWidths[id] ?? 100),
    0
  );

  return { widths, startResize, resetWidths, totalWidth };
}
