"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Download, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallApp } from "@/components/pwa/install-app-provider";
import { usePwaInstall } from "@/lib/hooks/use-pwa-install";
import {
  dismissInstallBanner,
  isInstallBannerDismissed,
  isMobileDevice,
} from "@/lib/pwa/pwa-install";
import { cn } from "@/lib/utils";

interface InstallAppPromptProps {
  variant?: "banner" | "button" | "icon";
  className?: string;
}

export function InstallAppPrompt({ variant = "button", className }: InstallAppPromptProps) {
  const { openInstallModal } = useInstallApp();
  const { installed } = usePwaInstall();
  const [bannerHidden, setBannerHidden] = useState(false);

  const handleOpen = useCallback(() => openInstallModal(), [openInstallModal]);

  const handleDismissBanner = useCallback(() => {
    dismissInstallBanner();
    setBannerHidden(true);
  }, []);

  const iconLabel = installed ? "Compartilhar app" : "Baixar app";
  const buttonLabel = installed ? "Compartilhar app" : "Baixar app";

  if (variant === "banner") {
    if (bannerHidden || installed || isInstallBannerDismissed() || !isMobileDevice()) {
      return null;
    }

    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card px-4 py-3 shadow-sm",
          className
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/pwa/icon-192.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-xl"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">Baixar o app</p>
            <p className="text-xs text-muted-foreground">FTimeSheetHub na sua tela inicial</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" className="rounded-full px-4" onClick={handleOpen}>
            Baixar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground"
            onClick={handleDismissBanner}
            aria-label="Dispensar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn("h-9 w-9 shrink-0 rounded-full border-border/80 bg-card/80", className)}
        onClick={handleOpen}
        aria-label={iconLabel}
        title={iconLabel}
      >
        {installed ? (
          <Share2 className="h-4 w-4 text-primary" aria-hidden />
        ) : (
          <Download className="h-4 w-4 text-primary" aria-hidden />
        )}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full justify-start gap-2 rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/10 hover:text-white", className)}
      onClick={handleOpen}
    >
      {installed ? (
        <Share2 className="h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <Download className="h-4 w-4 shrink-0" aria-hidden />
      )}
      <span>{buttonLabel}</span>
    </Button>
  );
}
