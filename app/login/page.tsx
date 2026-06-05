"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--fcamara-orange-muted)] via-background to-background"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />

      <Card className="relative z-10 w-full max-w-md border-border/80 shadow-[var(--shadow-card)]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <BrandLogo size="lg" tone="light" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo ao FTimeHub</CardTitle>
          <CardDescription>
            Gestão de apontamentos de horas para gestores e RH
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Acompanhe horas, aprovações e produtividade da equipe em um só
            lugar.
          </p>
          <Button className="w-full" size="lg" asChild>
            <Link href="/dashboard">Entrar</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Sem autenticação real nesta versão de demonstração.
          </p>
        </CardContent>
      </Card>

      <p className="relative z-10 mt-8 text-xs text-muted-foreground">
        © FTimeHub v0.1.0
      </p>
    </div>
  );
}
