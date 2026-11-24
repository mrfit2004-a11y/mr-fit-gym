"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/brand/language-switcher";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // Glass background once scrolled; hide while scrolling down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 400);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav link of the section currently in view.
  useEffect(() => {
    const sections = ["services", "about", "results", "pricing", "faq"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const navLinks = [
    { href: "#services", label: L("الخدمات", "Services") },
    { href: "#about", label: L("الكابتن", "Coach") },
    { href: "#results", label: L("النتائج", "Results") },
    { href: "#pricing", label: L("الباقات", "Pricing") },
    { href: "#faq", label: L("الأسئلة", "FAQ") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[box-shadow,background-color,transform] duration-300 ease-out",
        scrolled || open ? "glass hairline-b" : "bg-transparent",
        hidden && !open && "-translate-y-full",
      )}
    >
      <motion.div
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary rtl:origin-right"
        style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
        aria-hidden
      />
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 lg:flex" aria-label={L("التنقل الرئيسي", "Main navigation")}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={active === link.href ? "true" : undefined}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-foreground",
                  active === link.href ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
                {active === link.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1.5 inset-x-0 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">{t.nav.login}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">{L("اشترك الآن", "Subscribe")}</Link>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={L("القائمة", "Menu")}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("lg:hidden", open ? "block" : "hidden")}>
        <nav className="container flex flex-col gap-1 pb-5 pt-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-base font-medium text-foreground/90 hover:bg-accent"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button asChild variant="outline">
              <Link href="/login">{t.nav.login}</Link>
            </Button>
            <Button asChild>
              <Link href="/register">{L("اشترك الآن", "Subscribe")}</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
