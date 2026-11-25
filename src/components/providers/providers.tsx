"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./theme-provider";
import { I18nProvider } from "./i18n-provider";
import { Toaster } from "@/components/ui/toast";
import type { Locale } from "@/lib/i18n/config";

export function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  // Block right-click / long-press "Save image/video" and drag-out on all media.
  useEffect(() => {
    const block = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "IMG" || t.tagName === "VIDEO" || t.closest("video"))) e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
    };
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider initialLocale={locale}>
        {/* Every framer-motion animation respects the OS "reduce motion" setting. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  );
}
