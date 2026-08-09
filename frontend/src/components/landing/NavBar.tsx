"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

const LINKS: [string, string][] = [
  ["Features", "#features"],
  ["Pricing", "#pricing"],
  ["Docs", "/docs"],
  ["Blog", "/blog"],
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  // Glass gets more opaque + gains a shadow once you scroll past the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <div
        className={cn(
          "relative mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border px-3 py-2.5 backdrop-blur-xl transition-all duration-300",
          scrolled
            ? "border-white/10 bg-black/85 shadow-2xl shadow-black/60"
            : "border-white/[0.08] bg-black/55 shadow-xl shadow-black/30"
        )}
      >
        {/* shiny top edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        {/* Logo — the lockup already contains the wordmark, so there's no text
           beside it. The source PNG carries its own alpha, so it drops onto
           the glass with no blend mode needed. `priority` because it's above
           the fold. */}
        <Link href="/" className="group flex items-center pl-1" aria-label="Beacon — home">
          <Image
            src="/brand/logo.png"
            alt="Beacon"
            width={755}
            height={320}
            priority
            className="h-9 w-auto transition-transform duration-200 group-hover:scale-[1.03] sm:h-10"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map(([label, href]) => {
            const cls =
              "rounded-full px-4 py-2 text-sm font-medium text-white/60 transition-colors duration-200 hover:bg-white/5 hover:text-white";
            return href.startsWith("#") ? (
              <a key={label} href={href} className={cls}>
                {label}
              </a>
            ) : (
              <Link key={label} href={href} className={cls}>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className={cn(buttonVariants({ variant: "gradient", size: "sm" }), "rounded-full px-5")}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white ring-1 ring-white/10 transition-colors hover:bg-white/10 md:hidden"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mx-auto mt-3 max-w-6xl rounded-3xl border border-white/10 bg-black/90 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {LINKS.map(([label, href]) => {
                const cls =
                  "rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white";
                return href.startsWith("#") ? (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cls}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cls}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-white/10 py-3 text-center text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
              >
                Login
              </Link>

              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(buttonVariants({ variant: "gradient" }), "w-full rounded-xl")}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
