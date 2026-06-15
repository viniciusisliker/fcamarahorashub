const DISMISS_KEY = "ftimehub-pwa-install-dismissed";
const INSTALLED_KEY = "ftimehub-pwa-installed";
const DISMISS_DAYS = 14;
const SHARE_ORIGIN = "https://ftimesheethub.vercel.app";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallListener = () => void;

let captureStarted = false;
let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
const installListeners = new Set<InstallListener>();

function readEarlyPrompt(): BeforeInstallPromptEvent | null {
  if (typeof window === "undefined") return null;
  const early = (window as Window & { __deferredPwaPrompt?: BeforeInstallPromptEvent | null })
    .__deferredPwaPrompt;
  return early ?? null;
}

function setDeferredPrompt(event: BeforeInstallPromptEvent | null): void {
  deferredInstallPrompt = event;
  if (typeof window !== "undefined") {
    (window as Window & { __deferredPwaPrompt?: BeforeInstallPromptEvent | null }).__deferredPwaPrompt =
      event;
  }
  installListeners.forEach((listener) => listener());
}

export function initPwaInstallCapture(): void {
  if (typeof window === "undefined" || captureStarted) return;
  captureStarted = true;

  const early = readEarlyPrompt();
  if (early) deferredInstallPrompt = early;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    clearPwaInstalled();
    setDeferredPrompt(event as BeforeInstallPromptEvent);
  });

  window.addEventListener("appinstalled", () => {
    setDeferredPrompt(null);
    markPwaInstalled();
  });

  window.addEventListener("ftime-pwa-install-ready", () => {
    const prompt = readEarlyPrompt();
    if (prompt) deferredInstallPrompt = prompt;
    installListeners.forEach((listener) => listener());
  });
}

export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredInstallPrompt ?? readEarlyPrompt();
}

export function subscribePwaInstall(listener: InstallListener): () => void {
  installListeners.add(listener);
  return () => installListeners.delete(listener);
}

export async function promptNativeInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const prompt = getDeferredInstallPrompt();
  if (!prompt) return "unavailable";

  await prompt.prompt();
  const { outcome } = await prompt.userChoice;
  setDeferredPrompt(null);
  if (outcome === "accepted") markPwaInstalled();
  return outcome;
}

export function canPromptNativeInstall(): boolean {
  return getDeferredInstallPrompt() != null;
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as Window & { MSStream?: unknown }).MSStream
  );
}

export function isAndroidDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export function isDesktopChromium(): boolean {
  if (typeof navigator === "undefined") return false;
  if (isMobileDevice()) return false;
  return /Chrome|Edg|Chromium/i.test(navigator.userAgent);
}

export function isInstallBannerDismissed(): boolean {
  if (typeof localStorage === "undefined") return false;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) return false;
  return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function dismissInstallBanner(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

export function isPwaInstalledFlag(): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    return localStorage.getItem(INSTALLED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPwaInstalled(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(INSTALLED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearPwaInstalled(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(INSTALLED_KEY);
  } catch {
    /* ignore */
  }
}

export async function reconcilePwaInstallState(): Promise<void> {
  if (typeof window === "undefined") return;

  if (isStandaloneDisplay()) {
    markPwaInstalled();
    return;
  }

  const nav = navigator as Navigator & {
    getInstalledRelatedApps?: () => Promise<{ id?: string; platform?: string; url?: string }[]>;
  };
  if (typeof nav.getInstalledRelatedApps !== "function") return;

  try {
    const apps = await nav.getInstalledRelatedApps();
    if (apps?.length) {
      markPwaInstalled();
    } else {
      clearPwaInstalled();
    }
  } catch {
    /* keep existing state */
  }
}

export function hasInstalledApp(): boolean {
  return isStandaloneDisplay() || isPwaInstalledFlag();
}

export function getFTimeSheetShareUrl(): string {
  if (typeof window === "undefined") return `${SHARE_ORIGIN}/dashboard`;
  const origin = window.location.origin.replace(/\/$/, "");
  return `${origin}/dashboard`;
}

export async function shareFTimeSheetApp(): Promise<"shared" | "copied" | "cancelled" | "failed"> {
  const url = getFTimeSheetShareUrl();
  const shareData = {
    title: "FTimeSheetHub",
    text: "Acompanhe apontamentos de horas da equipe em tempo real.",
    url,
  };

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share(shareData);
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled";
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch {
      /* fall through */
    }
  }

  return "failed";
}

export function registerServiceWorker(): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") return;
  if (!("serviceWorker" in navigator)) return;

  void navigator.serviceWorker.register("/sw.js").catch(() => {
    /* PWA opcional */
  });
}
