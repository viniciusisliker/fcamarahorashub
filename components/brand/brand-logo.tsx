import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { box: "h-8 w-8", icon: "h-4 w-4", text: "text-sm" },
  md: { box: "h-10 w-10", icon: "h-5 w-5", text: "text-base" },
  lg: { box: "h-16 w-16", icon: "h-8 w-8", text: "text-2xl" },
} as const;

interface BrandLogoProps {
  size?: keyof typeof sizeMap;
  showText?: boolean;
  tone?: "dark" | "light";
  className?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  tone = "dark",
  className,
}: BrandLogoProps) {
  const s = sizeMap[size];

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-[#ff6b2b] to-[#c93a00] shadow-lg shadow-primary/35",
          s.box
        )}
        aria-hidden
      >
        <Clock className={cn(s.icon, "text-white drop-shadow-sm")} strokeWidth={2.25} />
        <span className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-white/25" />
        <span className="pointer-events-none absolute inset-1 rounded-[14px] border border-white/15" />
      </span>
      {showText ? (
        <span className={cn("font-bold tracking-tight", s.text)}>
          <span className={tone === "dark" ? "text-white" : "text-foreground"}>
            FTime
          </span>
          <span className="gradient-text">Hub</span>
        </span>
      ) : null}
    </span>
  );
}
