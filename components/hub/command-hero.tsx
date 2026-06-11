import Link from "next/link";
import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CommandStat {
  label: string;
  value: string;
  icon?: LucideIcon;
  accent?: "orange" | "white" | "amber";
}

interface CommandHeroProps {
  greeting: string;
  title: React.ReactNode;
  subtitle?: string;
  stats: CommandStat[];
  ctaHref: string;
  ctaLabel: string;
  className?: string;
}

export function CommandHero({
  greeting,
  title,
  subtitle,
  stats,
  ctaHref,
  ctaLabel,
  className,
}: CommandHeroProps) {
  return (
    <section
      className={cn(
        "command-hero animate-fade-up overflow-hidden rounded-[var(--radius-panel)]",
        className
      )}
    >
      <div className="command-hero-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="command-hero-glow pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/40 blur-[80px]" />
      <div className="command-hero-glow pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--ftime-violet)]/30 blur-[60px]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="min-w-0 space-y-3 lg:space-y-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-4 w-4" aria-hidden />
            {greeting}
          </p>
          <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">{subtitle}</p>
          ) : null}
        </div>

        <Button
          size="lg"
          className="h-12 w-full shrink-0 rounded-full px-8 text-base shadow-xl shadow-primary/40 sm:w-auto"
          asChild
        >
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:mt-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={cn(
                "rounded-2xl border px-4 py-3.5 backdrop-blur-md sm:px-5 sm:py-4",
                stat.accent === "orange"
                  ? "border-primary/40 bg-primary/15"
                  : stat.accent === "amber"
                    ? "border-amber-400/30 bg-amber-400/10"
                    : "border-white/10 bg-white/[0.06]"
              )}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/45 sm:text-[11px]">
                  {stat.label}
                </span>
                {Icon ? <Icon className="h-4 w-4 text-primary" aria-hidden /> : null}
              </div>
              <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
