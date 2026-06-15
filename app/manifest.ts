import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "FTimeSheetHub",
    short_name: "FTimeSheetHub",
    description: "Gestão de apontamentos de horas em tempo real.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#e9ecf3",
    theme_color: "#ff5500",
    lang: "pt-BR",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
