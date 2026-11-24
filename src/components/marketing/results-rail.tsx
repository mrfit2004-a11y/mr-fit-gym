"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal, EASE_OUT } from "@/components/ui/reveal";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

/**
 * Snap-scrolling photo strip with arrows, position dots and a tap-to-enlarge
 * lightbox. Uses native scrolling (no carousel library) so it stays light and
 * follows the page direction in Arabic and English.
 */
export function ResultsRail({ images, alt, hint }: { images: string[]; alt: string; hint: string }) {
  const { dir, locale } = useI18n();
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);

  // Track which card is most visible to drive the dots.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const i = itemRefs.current.indexOf(e.target as HTMLDivElement);
            if (i >= 0) setActive(i);
          }
        }
      },
      { root: rail, threshold: [0.6] },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [images.length]);

  const goTo = useCallback((i: number) => {
    const el = itemRefs.current[Math.max(0, Math.min(images.length - 1, i))];
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, [images.length]);

  // Lightbox keyboard controls.
  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      const next = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
      const prev = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
      if (e.key === next) setOpen((o) => (o == null ? o : (o + 1) % images.length));
      if (e.key === prev) setOpen((o) => (o == null ? o : (o - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dir, images.length]);

  // "Back" points to the start of the reading direction.
  const BackIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;
  const arrow = "flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/80 shadow-soft backdrop-blur transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30";

  return (
    <Reveal>
      <div
        ref={railRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-2 [scroll-padding-inline:1rem] md:px-[max(1rem,calc((100vw-1400px)/2+1rem))]"
        role="list"
        aria-label={alt}
        tabIndex={0}
      >
        {images.map((src, i) => (
          <motion.div
            key={src}
            ref={(el) => { itemRefs.current[i] = el; }}
            role="listitem"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, root: railRef }}
            transition={{ duration: 0.6, delay: Math.min(i, 4) * 0.08, ease: EASE_OUT }}
            className="group relative aspect-[3/4] w-[62vw] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl border border-border/60 bg-muted sm:w-[240px]"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="absolute inset-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
              aria-label={`${alt} ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="(min-width: 640px) 280px, 62vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="container mt-4 flex items-center justify-center gap-4">
        <button type="button" className={arrow} onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={L("السابق", "Previous")}>
          <BackIcon className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5" aria-hidden>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60",
              )}
            />
          ))}
        </div>
        <button type="button" className={arrow} onClick={() => goTo(active + 1)} disabled={active === images.length - 1} aria-label={L("التالي", "Next")}>
          <NextIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground md:hidden">{hint}</p>

      <AnimatePresence>
        {open != null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} ${open + 1}`}
          >
            <motion.div
              key={open}
              className="relative aspect-[3/4] h-[min(85vh,800px)] max-w-full"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[open]} alt={`${alt} ${open + 1}`} fill sizes="90vw" className="rounded-3xl object-contain" />
            </motion.div>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label={L("إغلاق", "Close")}
            >
              <X className="h-5 w-5" />
            </button>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white tabular-nums" dir="ltr">
              {open + 1} / {images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}
