import Image from "next/image";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { box: "h-8 w-8", px: 32 },
  md: { box: "h-10 w-10", px: 40 },
  lg: { box: "h-16 w-16", px: 64 },
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
      <Image
        src="/pwa/icon-192.png"
        alt=""
        width={s.px}
        height={s.px}
        className={cn("shrink-0 rounded-2xl shadow-lg shadow-primary/25", s.box)}
        priority
      />
      {showText ? (
        <span className={cn("font-bold tracking-tight", size === "lg" ? "text-2xl" : "text-sm")}>
          <span className={tone === "dark" ? "text-white" : "text-foreground"}>
            FTimeSheet
          </span>
          <span className="gradient-text">Hub</span>
        </span>
      ) : null}
    </span>
  );
}
