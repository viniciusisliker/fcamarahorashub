"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteTheme } from "@/lib/hooks/use-site-theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useSiteTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "h-9 w-9 shrink-0 rounded-full border-border/80 bg-card/80 shadow-sm",
        className
      )}
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-primary" aria-hidden />
      ) : (
        <Moon className="h-4 w-4 text-primary" aria-hidden />
      )}
    </Button>
  );
}
