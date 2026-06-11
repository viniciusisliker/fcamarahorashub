import { cn } from "@/lib/utils";

interface HubPanelProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noHover?: boolean;
}

export function HubPanel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  noHover,
}: HubPanelProps) {
  return (
    <section className={cn("hub-panel", noHover && "lg:hover:shadow-[var(--shadow-card)]", className)}>
      {title || description || action ? (
        <header className="relative mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            {title ? <h2 className="text-display-sm text-foreground">{title}</h2> : null}
            {description ? (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
        </header>
      ) : null}
      <div className={cn("relative", bodyClassName)}>{children}</div>
    </section>
  );
}
