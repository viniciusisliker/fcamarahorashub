"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { InstallAppModal, type InstallModalMode } from "@/components/pwa/install-app-modal";
import { usePwaInstall } from "@/lib/hooks/use-pwa-install";
import {
  canPromptNativeInstall,
  dismissInstallBanner,
  isDesktopChromium,
} from "@/lib/pwa/pwa-install";

interface InstallAppContextValue {
  openInstallModal: () => void;
}

const InstallAppContext = createContext<InstallAppContextValue | null>(null);

export function InstallAppProvider({ children }: { children: ReactNode }) {
  const { installed, ios, android, canInstallNative, promptInstall, shareApp } = usePwaInstall();
  const [open, setOpen] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const nativeReady = canInstallNative || canPromptNativeInstall();

  const modalMode: InstallModalMode =
    installed && !nativeReady
      ? "installed"
      : nativeReady
        ? "native"
        : ios
          ? "ios"
          : android
            ? "android"
            : isDesktopChromium()
              ? "desktop"
              : "unavailable";

  const openInstallModal = useCallback(() => {
    setShareFeedback(null);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setShareFeedback(null);
    dismissInstallBanner();
  }, []);

  const handleInstall = useCallback(async () => {
    setInstalling(true);
    try {
      const outcome = await promptInstall();
      if (outcome === "accepted") setOpen(false);
    } finally {
      setInstalling(false);
    }
  }, [promptInstall]);

  const handleShare = useCallback(async () => {
    setSharing(true);
    setShareFeedback(null);
    try {
      const outcome = await shareApp();
      if (outcome === "shared") {
        setOpen(false);
        return;
      }
      if (outcome === "copied") {
        setShareFeedback("Link copiado para a área de transferência.");
        return;
      }
      if (outcome === "cancelled") return;
      setShareFeedback(
        "Não foi possível compartilhar. Copie o link manualmente: ftimesheethub.vercel.app"
      );
    } finally {
      setSharing(false);
    }
  }, [shareApp]);

  const value = useMemo(() => ({ openInstallModal }), [openInstallModal]);

  return (
    <InstallAppContext.Provider value={value}>
      {children}
      <InstallAppModal
        open={open}
        mode={modalMode}
        onClose={handleClose}
        onInstall={handleInstall}
        onShare={installed && !nativeReady ? handleShare : undefined}
        shareFeedback={shareFeedback}
        installing={installing}
        sharing={sharing}
      />
    </InstallAppContext.Provider>
  );
}

export function useInstallApp(): InstallAppContextValue {
  const ctx = useContext(InstallAppContext);
  if (!ctx) {
    throw new Error("useInstallApp deve ser usado dentro de InstallAppProvider");
  }
  return ctx;
}
