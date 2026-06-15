"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { InstallAppPrompt } from "@/components/pwa/install-app-prompt";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileBarChart,
  LayoutDashboard,
  Sparkles,
  X,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/apontamentos", label: "Apontamentos", icon: ClipboardList },
  { href: "/relatorios", label: "Relatórios", icon: FileBarChart },
];

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const isCollapsed = collapsed;

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
          "mesh-dark fixed inset-y-0 left-0 z-50 flex w-[min(100vw-2.5rem,280px)] flex-col border-r-2 border-primary/40 pt-[env(safe-area-inset-top)] shadow-[4px_0_32px_rgba(255,85,0,0.08)] transition-[transform,width] duration-300 ease-out lg:static lg:translate-x-0",
          isCollapsed ? "lg:w-[4.5rem]" : "lg:w-[280px]",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div
          className={cn(
            "flex min-h-14 items-center justify-between px-4 sm:px-5 lg:min-h-[72px]",
            isCollapsed && "lg:justify-center lg:px-2"
          )}
        >
          <Link
            href="/dashboard"
            className={cn("flex items-center", isCollapsed && "lg:justify-center")}
            onClick={onClose}
            title="FTimeSheetHub"
          >
            <BrandLogo size="md" tone="dark" showText={!isCollapsed} />
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

        <nav
          className={cn("flex-1 space-y-1.5 px-3", isCollapsed && "lg:px-2")}
          aria-label="Principal"
        >
          <p
            className={cn(
              "mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/35",
              isCollapsed && "lg:hidden"
            )}
          >
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = !item.disabled && pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.disabled ? "#" : item.href}
                title={isCollapsed ? item.label : undefined}
                onClick={(e) => {
                  if (item.disabled) e.preventDefault();
                  else onClose();
                }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                  isCollapsed && "lg:justify-center lg:px-2 lg:py-2.5",
                  item.disabled && "cursor-not-allowed opacity-40",
                  active
                    ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-white/10 before:absolute before:left-0 before:top-1/2 before:h-7 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-gradient-to-b before:from-primary before:to-[#c93a00] max-lg:before:block lg:before:block"
                    : "text-white/55 hover:bg-white/[0.05] hover:text-white",
                  isCollapsed && active && "lg:before:hidden"
                )}
                aria-disabled={item.disabled}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    active
                      ? "bg-gradient-to-br from-primary to-[#c93a00] text-white shadow-lg shadow-primary/30"
                      : "bg-white/[0.06] text-white/70 group-hover:bg-white/10"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <span className={cn("flex-1 truncate", isCollapsed && "lg:hidden")}>
                  {item.label}
                </span>
                {item.badge ? (
                  <span
                    className={cn(
                      "rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/50",
                      isCollapsed && "lg:hidden"
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className={cn("space-y-2 px-3", isCollapsed && "lg:px-2")}>
          {isCollapsed ? (
            <div className="hidden justify-center lg:flex">
              <InstallAppPrompt
                variant="icon"
                className="h-10 w-10 rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/10 hover:text-white"
              />
            </div>
          ) : (
            <InstallAppPrompt variant="button" />
          )}
        </div>

        {!isCollapsed ? (
          <div className="glass-dark m-3 mb-[max(0.75rem,env(safe-area-inset-bottom))] hidden rounded-2xl p-4 lg:block">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="eyebrow text-primary/90">Insight</span>
            </div>
            <p className="text-xs leading-relaxed text-white/50">
              Acompanhe horas, aprovações e produtividade da equipe em tempo real.
            </p>
          </div>
        ) : null}

        <div
          className={cn(
            "mb-[max(0.75rem,env(safe-area-inset-bottom))] px-3 pb-3 lg:pb-4",
            isCollapsed && "lg:px-2"
          )}
        >
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "hidden w-full gap-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white lg:inline-flex",
              isCollapsed ? "justify-center px-0" : "justify-start"
            )}
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" aria-hidden />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
                <span className="text-sm font-medium">Recolher menu</span>
              </>
            )}
          </Button>
        </div>

        <div className="glass-dark m-3 mb-[max(0.75rem,env(safe-area-inset-bottom))] rounded-2xl p-4 lg:hidden">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="eyebrow text-primary/90">Insight</span>
          </div>
          <p className="text-xs leading-relaxed text-white/50">
            Acompanhe horas, aprovações e produtividade da equipe em tempo real.
          </p>
        </div>
      </aside>
    </>
  );
}
