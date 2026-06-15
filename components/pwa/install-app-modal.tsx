"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type InstallModalMode =
  | "ios"
  | "android"
  | "native"
  | "desktop"
  | "installed"
  | "unavailable";

interface InstallAppModalProps {
  open: boolean;
  mode: InstallModalMode;
  onClose: () => void;
  onInstall: () => void;
  onShare?: () => void | Promise<void>;
  shareFeedback?: string | null;
  installing?: boolean;
  sharing?: boolean;
}

export function InstallAppModal({
  open,
  mode,
  onClose,
  onInstall,
  onShare,
  shareFeedback = null,
  installing = false,
  sharing = false,
}: InstallAppModalProps) {
  if (!open || typeof document === "undefined") return null;

  const title = mode === "installed" ? "Compartilhar o app" : "Baixar o app";

  const dialog = (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-app-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="install-app-title" className="text-lg font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {mode === "installed"
                ? "Indique o FTimeSheetHub para colegas da equipe."
                : mode === "desktop" || mode === "native"
                  ? "Instale no computador — abre em janela própria, como app."
                  : "Instale no celular — acesso rápido como app nativo."}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl border border-border/80 bg-muted/20 p-3">
          <Image
            src="/pwa/icon-192.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-2xl shadow-lg shadow-primary/25"
          />
          <div>
            <p className="font-bold text-foreground">FTimeSheetHub</p>
            <p className="text-xs text-muted-foreground">Gestão de apontamentos</p>
          </div>
        </div>

        {mode === "ios" ? (
          <ol className="space-y-3 text-sm text-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                1
              </span>
              <span>
                Toque em <strong>Compartilhar</strong> na barra do Safari
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                2
              </span>
              <span>
                Escolha <strong>Adicionar à Tela de Início</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                3
              </span>
              <span>
                Confirme em <strong>Adicionar</strong>
              </span>
            </li>
          </ol>
        ) : null}

        {mode === "android" ? (
          <ol className="space-y-3 text-sm text-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                1
              </span>
              <span>
                Toque nos <strong>três pontos</strong> (⋮) no Chrome
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                2
              </span>
              <span>
                Escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                3
              </span>
              <span>
                Confirme em <strong>Instalar</strong>
              </span>
            </li>
          </ol>
        ) : null}

        {mode === "native" ? (
          <p className="text-sm text-muted-foreground">
            Clique em instalar — o navegador adiciona o app na área de trabalho ou tela inicial.
          </p>
        ) : null}

        {mode === "desktop" ? (
          <ol className="space-y-3 text-sm text-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                1
              </span>
              <span>
                No Chrome ou Edge, clique no ícone <strong>Instalar</strong> na barra de endereço
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                2
              </span>
              <span>
                Ou menu <strong>⋮</strong> → <strong>Instalar FTimeSheetHub…</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                3
              </span>
              <span>
                Confirme em <strong>Instalar</strong>
              </span>
            </li>
          </ol>
        ) : null}

        {mode === "unavailable" ? (
          <p className="text-sm text-muted-foreground">
            Use Chrome ou Edge no computador, ou Chrome/Safari no celular, para instalar o
            FTimeSheetHub.
          </p>
        ) : null}

        {mode === "installed" ? (
          <>
            <p className="text-sm text-primary">
              O FTimeSheetHub já está instalado. Envie o link para outras pessoas instalarem também.
            </p>
            {shareFeedback ? (
              <p className={cn("mt-2 text-sm", shareFeedback.includes("copiado") ? "text-emerald-600" : "text-muted-foreground")}>
                {shareFeedback}
              </p>
            ) : null}
          </>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {mode === "installed" && onShare ? (
            <Button className="flex-1 rounded-full" onClick={() => void onShare()} disabled={sharing}>
              {sharing ? "Compartilhando…" : "Compartilhar"}
            </Button>
          ) : null}
          {mode === "native" || mode === "desktop" ? (
            <Button className="flex-1 rounded-full" onClick={onInstall} disabled={installing}>
              {installing ? "Instalando…" : "Instalar app"}
            </Button>
          ) : null}
          {mode === "ios" || mode === "android" ? (
            <Button className="flex-1 rounded-full" onClick={onClose}>
              Entendi
            </Button>
          ) : null}
          {mode !== "installed" ? (
            <Button variant="outline" className="rounded-full" onClick={onClose}>
              {mode === "desktop" ? "Fechar" : "Agora não"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
