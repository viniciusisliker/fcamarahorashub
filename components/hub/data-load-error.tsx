"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataLoadErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function DataLoadError({ message, onRetry, className }: DataLoadErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[var(--radius-card)] border border-destructive/20 bg-destructive/5 px-6 py-12 text-center",
        className
      )}
      role="alert"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-6 w-6" aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="font-semibold text-foreground">Falha ao carregar dados</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="outline" className="rounded-full" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
