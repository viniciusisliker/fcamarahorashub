"use client";

import Link from "next/link";
import { ArrowRight, Clock, Shield, Zap } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Clock,
    title: "Tempo real",
    text: "Apontamentos sincronizados assim que são registrados.",
  },
  {
    icon: Shield,
    title: "Controle total",
    text: "Aprovações, rejeições e histórico em um só lugar.",
  },
  {
    icon: Zap,
    title: "Decisões rápidas",
    text: "Dashboards inteligentes para gestores e RH.",
  },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="mesh-dark relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" aria-hidden />
        <div className="relative">
          <BrandLogo size="lg" tone="dark" />
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
              O hub que transforma{" "}
              <span className="bg-gradient-to-r from-primary via-[#ff8a57] to-[var(--ftime-violet)] bg-clip-text text-transparent">
                horas em insights
              </span>
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/55">
              FTimeHub centraliza apontamentos, aprovações e produtividade da sua
              equipe com uma experiência pensada para o dia a dia do gestor.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm text-white/45">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/30">© FTimeHub · v0.2.0</p>
      </div>

      <div className="mesh-bg dot-grid flex flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 lg:hidden">
          <BrandLogo size="lg" tone="light" />
        </div>

        <div className="w-full max-w-md animate-fade-up rounded-[20px] border border-border/80 bg-white/90 p-8 shadow-[var(--shadow-elevated)] backdrop-blur-sm">
          <div className="mb-8 space-y-2 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Acesso
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Entrar no FTimeHub
            </h2>
            <p className="text-sm text-muted-foreground">
              Ambiente de demonstração para gestores e RH
            </p>
          </div>

          <Button className="h-12 w-full rounded-full text-base shadow-lg shadow-primary/25" size="lg" asChild>
            <Link href="/dashboard">
              Acessar dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Sem autenticação real nesta versão de demonstração.
          </p>
        </div>

        <p className="mt-8 text-xs text-muted-foreground lg:hidden">© FTimeHub · v0.2.0</p>
      </div>
    </div>
  );
}
