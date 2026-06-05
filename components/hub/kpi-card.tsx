import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "featured" | "glass";
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
        "group relative overflow-hidden rounded-[var(--radius-card)] border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]",
        featured
          ? "border-primary/20 bg-gradient-to-br from-[#1a1020] via-[var(--ftime-ink-soft)] to-[var(--ftime-ink)] p-6 text-white shadow-[var(--shadow-glow)]"
          : "border-border/80 bg-white/90 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm",
        className
      )}
    >
      {featured ? (
        <>
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-[var(--ftime-violet)]/20 blur-2xl" />
        </>
      ) : null}

      <div className="relative flex items-start justify-between gap-3">
        <div className="space-y-3">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              featured ? "text-white/50" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-3xl font-extrabold tracking-tight sm:text-4xl",
              featured ? "text-white" : "text-foreground"
            )}
          >
            {value}
          </p>
          {description ? (
            <p
              className={cn(
                "text-xs",
                featured ? "text-white/45" : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          ) : null}
          {trend ? (
            <p className="text-xs font-medium text-emerald-400">{trend}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            featured
              ? "bg-gradient-to-br from-primary to-[#c93a00] text-white shadow-lg shadow-primary/40"
              : "bg-[var(--ftime-orange-muted)] text-primary"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </div>
  );
}
