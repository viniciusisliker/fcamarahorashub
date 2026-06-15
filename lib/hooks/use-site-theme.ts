"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applySiteTheme,
  getStoredSiteTheme,
  initSiteTheme,
  toggleSiteTheme,
  type SiteTheme,
} from "@/lib/theme/site-theme";

export function useSiteTheme() {
  const [theme, setThemeState] = useState<SiteTheme>("light");

  useEffect(() => {
    setThemeState(initSiteTheme());
  }, []);

  const setTheme = useCallback((next: SiteTheme) => {
    setThemeState(applySiteTheme(next));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => toggleSiteTheme(current));
  }, []);

  const readTheme = useCallback((): SiteTheme => {
    if (typeof document === "undefined") return "light";
    const attr = document.documentElement.getAttribute("data-theme");
    return attr === "dark" ? "dark" : getStoredSiteTheme();
  }, []);

  return { theme, setTheme, toggleTheme, readTheme };
}
