"use client";

import { useEffect } from "react";

/**
 * Glue for the Android app (Capacitor loads this site in a WebView and injects
 * `window.Capacitor`). No npm dependency: plugins are reached through the
 * injected bridge, so the website itself is unaffected and this is a no-op in
 * a normal browser.
 */
type ListenerHandle = { remove: () => void };
type CapacitorBridge = {
  isNativePlatform?: () => boolean;
  Plugins?: {
    App?: {
      addListener: (
        event: "backButton",
        cb: (e: { canGoBack: boolean }) => void,
      ) => Promise<ListenerHandle> | ListenerHandle;
      minimizeApp: () => Promise<void>;
    };
    StatusBar?: {
      setStyle: (o: { style: "DARK" | "LIGHT" }) => Promise<void>;
      setBackgroundColor: (o: { color: string }) => Promise<void>;
    };
  };
};

/** Screens where "back" should leave the app rather than step back (e.g. to login). */
const ROOT_SCREENS = ["/login", "/coach", "/client", "/admin", "/change-password"];

export function NativeAppBridge() {
  useEffect(() => {
    const cap = (window as unknown as { Capacitor?: CapacitorBridge }).Capacitor;
    if (!cap?.isNativePlatform?.()) return;
    document.documentElement.classList.add("native-app");

    // Status bar follows the light/dark theme of the page.
    const bar = cap.Plugins?.StatusBar;
    const syncStatusBar = () => {
      if (!bar) return;
      const dark = document.documentElement.classList.contains("dark");
      void bar.setStyle({ style: dark ? "DARK" : "LIGHT" }).catch(() => {});
      void bar.setBackgroundColor({ color: dark ? "#000000" : "#F7F7F9" }).catch(() => {});
    };
    syncStatusBar();
    const themeObserver = new MutationObserver(syncStatusBar);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const app = cap.Plugins?.App;
    let handle: ListenerHandle | undefined;
    if (app) {
      // Android back button: step back inside the app, but from a top-level
      // screen send the app to the background instead of returning to login.
      Promise.resolve(
        app.addListener("backButton", ({ canGoBack }) => {
          const path = window.location.pathname.replace(/\/$/, "") || "/";
          const atRoot = ROOT_SCREENS.includes(path);
          if (!atRoot && canGoBack && window.history.length > 1) window.history.back();
          else void app.minimizeApp();
        }),
      ).then((h) => (handle = h));
    }

    return () => {
      themeObserver.disconnect();
      handle?.remove();
    };
  }, []);

  return null;
}
