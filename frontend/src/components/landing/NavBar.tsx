"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

const LINKS: [string, string][] = [
  ["Overview", "#overview"],
  ["Features", "#features"],
  ["Pricing", "#pricing"],
  ["Docs", "/docs"],
];

/**
 * Landing navigation, laid over the hero image rather than in a bar of its own.
 *
 * Each link is its own translucent chip instead of one grouped pill: over a
 * photograph a single container reads as a slab covering the image, while
 * separate chips let the picture breathe between them. Mono type at small size
 * with wide tracking is what gives it the technical, instrument-panel feel.
 */
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={reduce ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="absolute inset-x-0 top-0 z-50 px-5 py-5 sm:px-8 sm:py-7"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/brand/mark.png"
            alt=""
            width={128}
            height={128}
            priority
            className="size-7 w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-mono text-[13px] font-medium uppercase tracking-[0.2em] text-white">
            Beacon
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {LINKS.map(([label, href]) => {
            const className =
              "rounded-md border border-white/10 bg-white/8 px-4 py-2 font-mono text-[12px] tracking-tight text-white/80 backdrop-blur-md transition-colors duration-200 hover:bg-white/15 hover:text-white";

            return href.startsWith("#") ? (
              <a key={label} href={href} className={className}>
                {label}
              </a>
            ) : (
              <Link key={label} href={href} className={className}>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-1.5 md:flex">
          <Link
            href="/signup"
            className="group flex items-center gap-1.5 rounded-md bg-white px-4 py-2 font-mono text-[12px] font-medium tracking-tight text-black transition-all duration-200 hover:bg-white/90"
          >
            Signup
            <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/login"
            className="rounded-md border border-white/10 bg-white/8 px-4 py-2 font-mono text-[12px] uppercase tracking-tight text-white/80 backdrop-blur-md transition-colors duration-200 hover:bg-white/15 hover:text-white"
          >
            Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/8 text-white backdrop-blur-md transition-colors hover:bg-white/15 md:hidden"
        >
          {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mx-auto mt-3 max-w-7xl rounded-xl border border-white/10 bg-black/80 p-2 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col">
              {LINKS.map(([label, href]) => {
                const className =
                  "rounded-lg px-4 py-3 font-mono text-[13px] text-white/70 transition-colors hover:bg-white/5 hover:text-white";

                return href.startsWith("#") ? (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={className}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={className}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-2">
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-white py-3 text-center font-mono text-[13px] font-medium text-black"
              >
                Signup
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-lg border border-white/10 py-3 text-center font-mono text-[13px] uppercase text-white/80"
                )}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
