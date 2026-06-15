"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const SIDEBAR_DEFAULT_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const SIDEBAR_MIN_WIDTH = 220;
export const SIDEBAR_MAX_WIDTH = 420;

const STORAGE_KEY = "ftimehub-sidebar-width";

function loadWidth(): number {
  if (typeof window === "undefined") return SIDEBAR_DEFAULT_WIDTH;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SIDEBAR_DEFAULT_WIDTH;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return SIDEBAR_DEFAULT_WIDTH;
    return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, parsed));
  } catch {
    return SIDEBAR_DEFAULT_WIDTH;
  }
}

export function useResizableSidebar(collapsed: boolean) {
  const [width, setWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(SIDEBAR_DEFAULT_WIDTH);

  useEffect(() => {
    setWidth(loadWidth());
  }, []);

  const persist = useCallback((value: number) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* ignore */
    }
  }, []);

  const startResize = useCallback(
    (clientX: number) => {
      if (collapsed) return;
      startX.current = clientX;
      startWidth.current = width;
      setIsResizing(true);

      const onMove = (event: MouseEvent) => {
        const next = Math.min(
          SIDEBAR_MAX_WIDTH,
          Math.max(SIDEBAR_MIN_WIDTH, startWidth.current + (event.clientX - startX.current))
        );
        setWidth(next);
      };

      const onUp = () => {
        setIsResizing(false);
        setWidth((current) => {
          persist(current);
          return current;
        });
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
    [collapsed, persist, width]
  );

  const resetWidth = useCallback(() => {
    setWidth(SIDEBAR_DEFAULT_WIDTH);
    persist(SIDEBAR_DEFAULT_WIDTH);
  }, [persist]);

  const resolvedWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : width;

  return {
    sidebarWidth: width,
    resolvedWidth,
    isResizing,
    startResize,
    resetWidth,
  };
}
