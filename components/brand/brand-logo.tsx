import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { box: "h-8 w-8", icon: "h-4 w-4", text: "text-sm" },
  md: { box: "h-9 w-9", icon: "h-[18px] w-[18px]", text: "text-base" },
  lg: { box: "h-14 w-14", icon: "h-7 w-7", text: "text-xl" },
} as const;

interface BrandLogoProps {
  size?: keyof typeof sizeMap;
  showText?: boolean;
  /** Sidebar/login on dark vs header on light card */
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
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-[#c93a00] shadow-md shadow-primary/30 ring-1 ring-white/15",
          s.box
        )}
        aria-hidden
      >
        <Clock className={cn(s.icon, "text-white")} strokeWidth={2.25} />
        <span className="pointer-events-none absolute inset-[3px] rounded-[10px] border border-white/10" />
      </span>
      {showText ? (
        <span className={cn("font-semibold tracking-tight", s.text)}>
          <span className={tone === "dark" ? "text-white" : "text-foreground"}>
            FTime
          </span>
          <span className="text-primary">Hub</span>
        </span>
      ) : null}
    </span>
  );
}
