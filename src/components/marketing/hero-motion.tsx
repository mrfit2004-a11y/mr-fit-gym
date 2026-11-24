"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { EASE_OUT } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Hero headline that rises in word by word. Words (not letters) are animated
 * so Arabic keeps its joined letterforms. Pure CSS, so it plays from the
 * server-rendered HTML without waiting for JavaScript (keeps LCP fast).
 */
export function AnimatedHeadline({ line1, line2, className }: { line1: string; line2: string; className?: string }) {
  const words = (text: string) => text.split(" ").filter(Boolean);
  const first = words(line1);
  const second = words(line2);

  const word = (w: string, i: number, accent = false) => (
    <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <span
        className={cn("inline-block animate-word-rise", accent && "text-primary")}
        style={{ animationDelay: `${100 + i * 110}ms` }}
      >
        {w}
      </span>
      {" "}
    </span>
  );

  return (
    <h1 className={className}>
      <span className="sr-only">{`${line1} ${line2}`}</span>
      <span aria-hidden>
        {first.map((w, i) => word(w, i))}
        <br />
        {second.map((w, i) => word(w, first.length + i, true))}
      </span>
    </h1>
  );
}

/**
 * Counts a stat up from zero the first time it scrolls into view. Values that
 * are not a leading number (e.g. "24/7") are shown as-is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const reduce = useReducedMotion();
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || target == null) return;
    if (reduce) return setN(target);
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE_OUT,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, reduce]);

  return (
    <span ref={ref} className={className}>
      {target == null ? value : `${n}${suffix}`}
    </span>
  );
}

/** Portrait frame that drifts and settles as the page scrolls past the hero. */
export function ParallaxFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y, scale }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * WhatsApp button that pops in once the visitor scrolls past the hero, with a
 * pulsing ring and a label that slides out on larger screens.
 */
export function FloatingWhatsApp({ href, label }: { href: string; label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="group fixed bottom-5 end-5 z-30 flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          <span className="hidden rounded-full bg-card px-4 py-2 text-sm font-semibold shadow-elevated ring-1 ring-border/60 transition-transform duration-300 group-hover:-translate-y-0.5 md:block">
            {label}
          </span>
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform duration-300 group-hover:scale-110">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40 [animation-duration:2.2s]" aria-hidden />
            <MessageCircle className="relative h-6 w-6" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/** Soft brand-red glow behind the portrait that slowly breathes. */
export function PulseGlow({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      aria-hidden
      animate={{ opacity: [0.55, 1, 0.55], scale: [0.96, 1.04, 0.96] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
