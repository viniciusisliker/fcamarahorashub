"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  FileBarChart,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/apontamentos", label: "Apontamentos", icon: ClipboardList },
  {
    href: "#",
    label: "Relatórios",
    icon: FileBarChart,
    disabled: true,
    badge: "Em breve",
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "mesh-dark fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.06] transition-transform duration-300 ease-out lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-[72px] items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center" onClick={onClose}>
            <BrandLogo size="md" tone="dark" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1.5 px-3" aria-label="Principal">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/35">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = !item.disabled && pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.disabled ? "#" : item.href}
                onClick={(e) => {
                  if (item.disabled) e.preventDefault();
                  else onClose();
                }}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                  item.disabled && "cursor-not-allowed opacity-40",
                  active
                    ? "bg-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/10"
                    : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                )}
                aria-disabled={item.disabled}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    active
                      ? "bg-gradient-to-br from-primary to-[#c93a00] text-white shadow-lg shadow-primary/30"
                      : "bg-white/[0.06] text-white/70 group-hover:bg-white/10"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/50">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Insight
            </span>
          </div>
          <p className="text-xs leading-relaxed text-white/55">
            Acompanhe horas, aprovações e produtividade da equipe em tempo real.
          </p>
        </div>
      </aside>
    </>
  );
}
