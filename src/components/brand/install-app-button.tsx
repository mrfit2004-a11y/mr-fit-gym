"use client";

import { useEffect, useState } from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * "Install the app" button for the web version.
 * - Android / desktop Chrome: triggers the native install prompt (real WebAPK).
 * - iPhone / iPad: Apple allows no programmatic install, so it opens a short
 *   Share → Add to Home Screen guide.
 * Hidden when already installed or running inside the Android app.
 */
export function InstallAppButton() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone || w.Capacitor?.isNativePlatform?.()) return;

    const ua = navigator.userAgent;
    const ios =
      /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
    setIsIos(ios);
    setHidden(false); // always offer it in the browser

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallPromptEvent);
      setHidden(false);
    };
    const onInstalled = () => {
      setHidden(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (hidden) return null;

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setHidden(true);
      setDeferred(null);
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={install}
        className="flex w-full max-w-md items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/15"
      >
        <Download className="h-4 w-4" />
        {ar ? "ثبّت التطبيق على جهازك" : "Install the app on your device"}
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-5 text-card-foreground shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">
                {isIos ? (ar ? "تثبيت التطبيق على الآيفون" : "Install on iPhone") : (ar ? "تثبيت التطبيق" : "Install the app")}
              </h3>
              <button type="button" onClick={() => setShowGuide(false)} aria-label="close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ol className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">1</span>
                <span className="flex flex-wrap items-center gap-1">
                  {isIos ? (ar ? "دوس على زر المشاركة" : "Tap the Share button") : (ar ? "دوس على قايمة ⋮ فوق في كروم" : "Tap the ⋮ menu in Chrome")}
                  {isIos && <Share className="h-4 w-4 text-primary" />}
                  {isIos && (ar ? "في Safari" : "in Safari")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">2</span>
                <span className="flex flex-wrap items-center gap-1">
                  {isIos ? (ar ? "اختار «إضافة إلى الشاشة الرئيسية»" : "Choose “Add to Home Screen”") : (ar ? "اختار «تثبيت التطبيق»" : "Choose “Install app”")}
                  <SquarePlus className="h-4 w-4 text-primary" />
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">3</span>
                <span>{ar ? "دوس «إضافة» أو «تثبيت»، والتطبيق هيظهر مع باقي تطبيقاتك" : "Tap “Add”, and the app appears with your other apps"}</span>
              </li>
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">
              {isIos ? (ar ? "لازم تفتح الموقع من Safari." : "The site must be opened in Safari.") : (ar ? "لو مش لاقي «تثبيت التطبيق»، قفل كروم وافتحه تاني بعد دقيقة." : "If “Install app” is missing, reopen Chrome after a minute.")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
