/**
 * Ponto único de controle visual do FTimeSheetHub.
 * Ajuste aqui ou sobrescreva via CSS em app/globals.css (:root).
 */
export const design = {
  brand: {
    name: "FTimeSheetHub",
    primary: "#ff5500",
    primaryHover: "#e64d00",
    coral: "#ff8a57",
    violet: "#8b5cf6",
  },
  layout: {
    contentMaxWidth: "1440px",
    sidebarWidth: "280px",
    headerHeightMobile: "3.5rem",
    headerHeightDesktop: "4.5rem",
  },
  radius: {
    card: "18px",
    panel: "20px",
    pill: "999px",
  },
  motion: {
    durationFast: "150ms",
    durationNormal: "250ms",
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
} as const;

export type DesignConfig = typeof design;
