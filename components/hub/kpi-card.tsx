import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "featured";
  trend?: string;
  className?: string;
}

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
  trend,
  className,
}: KpiCardProps) {
  const featured = variant === "featured";

  return (
    <div
      className={cn(
        "group relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)] sm:min-h-[140px] sm:p-5",
        featured
          ? "border-primary/20 bg-gradient-to-br from-[#1a1020] via-[var(--ftime-ink-soft)] to-[var(--ftime-ink)] text-white shadow-[var(--shadow-glow)]"
          : "border-border/80 bg-white/90 shadow-[var(--shadow-card)] backdrop-blur-sm",
        className
      )}
    >
      {featured ? (
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
      ) : null}

      <div className="relative flex items-start justify-between gap-3">
        <p
          className={cn(
            "min-w-0 flex-1 text-[11px] font-semibold uppercase leading-tight tracking-wide sm:text-xs",
            featured ? "text-white/55" : "text-muted-foreground"
          )}
        >
          {title}
        </p>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10 sm:rounded-xl",
            featured
              ? "bg-gradient-to-br from-primary to-[#c93a00] text-white shadow-md shadow-primary/40"
              : "bg-[var(--ftime-orange-muted)] text-primary"
          )}
        >
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
        </div>
      </div>

      <div className="relative mt-3 space-y-1">
        <p
          className={cn(
            "text-2xl font-extrabold tracking-tight sm:text-3xl",
            featured ? "text-white" : "text-foreground"
          )}
        >
          {value}
        </p>
        {description ? (
          <p
            className={cn(
              "line-clamp-2 text-[11px] leading-snug sm:text-xs",
              featured ? "text-white/45" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        ) : null}
        {trend ? (
          <p className="text-[11px] font-medium text-emerald-400 sm:text-xs">{trend}</p>
        ) : null}
      </div>
    </div>
  );
}
