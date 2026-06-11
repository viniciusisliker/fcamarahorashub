import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "featured";
  accent?: "orange" | "amber" | "violet" | "emerald";
  trend?: string;
  className?: string;
}

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
  accent = "orange",
  trend,
  className,
}: KpiCardProps) {
  const featured = variant === "featured";
  const accentClass = {
    orange: "kpi-accent-orange",
    amber: "kpi-accent-amber",
    violet: "kpi-accent-violet",
    emerald: "kpi-accent-emerald",
  }[accent];

  return (
    <div
      className={cn(
        "group relative flex min-h-[100px] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] p-3 transition-all duration-300 sm:min-h-[120px] sm:p-4 lg:p-5 lg:hover:-translate-y-1",
        featured ? "premium-kpi-dark" : cn("premium-kpi-light lg:hover:shadow-lg", accentClass),
        className
      )}
    >
      {featured ? (
        <>
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </>
      ) : null}

      <div className="relative flex items-start justify-between gap-3">
        <p
          className={cn(
            "eyebrow min-w-0 flex-1 leading-tight",
            featured ? "text-white/50" : "text-muted-foreground"
          )}
        >
          {title}
        </p>
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 lg:group-hover:scale-105 sm:h-9 sm:w-9 lg:h-10 lg:w-10",
            featured
              ? "bg-gradient-to-br from-primary via-[#ff6b2b] to-[#c93a00] text-white shadow-lg shadow-primary/35 ring-1 ring-white/20"
              : "bg-[var(--ftime-orange-subtle)] text-primary ring-1 ring-primary/10"
          )}
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" aria-hidden />
        </div>
      </div>

      <div className="relative mt-3 space-y-1">
        <p className={cn("text-stat", featured ? "text-white" : "text-foreground")}>{value}</p>
        {description ? (
          <p
            className={cn(
              "line-clamp-2 text-[11px] leading-snug sm:text-xs",
              featured ? "text-white/40" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        ) : null}
        {trend ? (
          <p className="inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 sm:text-[11px]">
            {trend}
          </p>
        ) : null}
      </div>
    </div>
  );
}
