import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { PwaBootstrap } from "@/components/pwa/pwa-bootstrap";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FTimeSheetHub — Gestão de Apontamentos",
  description:
    "Plataforma moderna para gestores e RH acompanharem apontamentos de horas em tempo real.",
  applicationName: "FTimeSheetHub",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FTimeSheetHub",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ff5500",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background font-sans text-foreground">
        <Script id="ftime-theme-init" strategy="beforeInteractive">
          {`(function(){try{var k='ftimehub-theme';var t=localStorage.getItem(k);var theme=t==='dark'||t==='light'?t:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',theme);document.documentElement.style.colorScheme=theme;}catch(e){}})();`}
        </Script>
        <Script id="ftime-pwa-capture" strategy="beforeInteractive">
          {`window.__deferredPwaPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__deferredPwaPrompt=e;window.dispatchEvent(new Event('ftime-pwa-install-ready'));});`}
        </Script>
        <PwaBootstrap />
        {children}
      </body>
    </html>
  );
}
