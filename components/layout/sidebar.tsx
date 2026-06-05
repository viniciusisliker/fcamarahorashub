"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  FileBarChart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
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
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[var(--fcamara-dark)] text-white transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <BrandLogo size="md" tone="dark" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 lg:hidden"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Principal">
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  item.disabled &&
                    "cursor-not-allowed opacity-50",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
                aria-disabled={item.disabled}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="text-xs text-white/50">
            Gestão de horas — visão consolidada para gestores
          </p>
        </div>
      </aside>
    </>
  );
}
