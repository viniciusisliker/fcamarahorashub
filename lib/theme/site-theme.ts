export type SiteTheme = "light" | "dark";

export const SITE_THEME_STORAGE_KEY = "ftimehub-theme";

export function getStoredSiteTheme(): SiteTheme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(SITE_THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applySiteTheme(theme: SiteTheme): SiteTheme {
  const safe: SiteTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", safe);
  document.documentElement.style.colorScheme = safe;
  try {
    localStorage.setItem(SITE_THEME_STORAGE_KEY, safe);
  } catch {
    /* ignore */
  }
  return safe;
}

export function toggleSiteTheme(current: SiteTheme): SiteTheme {
  return applySiteTheme(current === "dark" ? "light" : "dark");
}

export function initSiteTheme(): SiteTheme {
  return applySiteTheme(getStoredSiteTheme());
}
