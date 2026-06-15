import { useCallback, useEffect, useState } from "react";
import type { BeforeInstallPromptEvent } from "@/lib/pwa/pwa-install";
import {
  canPromptNativeInstall,
  getDeferredInstallPrompt,
  hasInstalledApp,
  initPwaInstallCapture,
  isAndroidDevice,
  isIosDevice,
  promptNativeInstall,
  reconcilePwaInstallState,
  shareFTimeSheetApp,
  subscribePwaInstall,
} from "@/lib/pwa/pwa-install";

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const ios = isIosDevice();
  const android = isAndroidDevice();

  useEffect(() => {
    initPwaInstallCapture();
    setDeferredPrompt(getDeferredInstallPrompt());
    setInstalled(hasInstalledApp());

    const sync = () => {
      setDeferredPrompt(getDeferredInstallPrompt());
      setInstalled(hasInstalledApp());
    };

    void reconcilePwaInstallState().then(sync);

    const unsubscribe = subscribePwaInstall(sync);
    window.addEventListener("appinstalled", sync);

    const standaloneMq = window.matchMedia("(display-mode: standalone)");
    const onDisplayChange = () => {
      void reconcilePwaInstallState().then(sync);
    };
    standaloneMq.addEventListener("change", onDisplayChange);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void reconcilePwaInstallState().then(sync);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      unsubscribe();
      window.removeEventListener("appinstalled", sync);
      standaloneMq.removeEventListener("change", onDisplayChange);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | "ios" | "unavailable"> => {
    if (installed && !canPromptNativeInstall()) return "unavailable";
    if (ios) return "ios";

    const outcome = await promptNativeInstall();
    if (outcome === "accepted") setInstalled(true);
    return outcome;
  }, [installed, ios]);

  return {
    installed,
    ios,
    android,
    canInstallNative: deferredPrompt != null || canPromptNativeInstall(),
    promptInstall,
    shareApp: shareFTimeSheetApp,
  };
}
