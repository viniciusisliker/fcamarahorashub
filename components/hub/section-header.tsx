import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[var(--radius-card)] border border-primary/15 bg-gradient-to-r from-primary/8 via-card to-card px-4 py-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-5 sm:py-4",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        {eyebrow ? (
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:text-[11px]">
            {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
    </div>
  );
}
