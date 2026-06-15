"use client";

import { useEffect } from "react";
import { initPwaInstallCapture, registerServiceWorker } from "@/lib/pwa/pwa-install";

export function PwaBootstrap() {
  useEffect(() => {
    initPwaInstallCapture();
    registerServiceWorker();
  }, []);

  return null;
}
