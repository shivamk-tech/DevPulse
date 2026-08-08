"use client";

import Link from "next/link";
import { ArrowRight, GitBranch, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { buttonVariants } from "@/components/ui/Button";
import Lightfall from "@/components/backgrounds/Lightfall";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

// Stable reference so the Lightfall effect doesn't re-init on every render.
const LIGHTFALL_COLORS = ["#a5b4fc", "#6366f1", "#a855f7"];

/**
 * Landing hero in the style of the Reflect redesign, tuned to the Beacon auth
 * palette: near-black canvas (#0B0F14), indigo-violet accents (#6366f1 →
 * #4f46e5, #818cf8), and a violet "event horizon" glowing up from behind a
 * product window that rises from the fold. Subtle glossy highlights throughout.
 */
export function Hero() {
  const reduce = useReducedMotion();

  const rise = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE, delay: reduce ? 0 : 0.08 * i },
    }),
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#0B0F14] pt-28 sm:pt-32">
      {/* Animated Lightfall background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Lightfall
          colors={LIGHTFALL_COLORS}
          backgroundColor="#0B0F14"
          opacity={0.6}
          speed={0.5}
          streakCount={3}
          density={0.6}
          glow={1}
          backgroundGlow={0.4}
          twinkle={1}
          mouseInteraction={false}
          mixBlendMode="screen"
        />
        {/* fade the streaks out toward the bottom so the product window stays clean */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0F14]" />
      </div>

      {/* Ambient background: violet top vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.2),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        {/* Headline — subtle glossy white → indigo sheen */}
        <motion.h1
          custom={0}
          variants={rise}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mx-auto max-w-2xl text-balance bg-gradient-to-b from-white via-white to-[#c7d2fe] bg-clip-text text-4xl font-semibold leading-[1.05] tracking-tight text-transparent sm:text-5xl md:text-6xl"
        >
          Ship better with Beacon
        </motion.h1>

        <motion.p
          custom={1}
          variants={rise}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mx-auto mt-4 max-w-lg text-base text-white/50"
        >
          Never miss a commit, deploy, or signal. One calm home for your whole
          team&apos;s engineering pulse.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={2}
          variants={rise}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mt-7 flex items-center justify-center gap-3"
        >
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "gradient", size: "lg" }),
              "group rounded-full px-6 text-sm"
            )}
          >
            Start free trial
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/5 transition-colors hover:bg-white/10"
          >
            See how it works
          </Link>
        </motion.div>
      </div>

      {/* Product window mockup */}
      <motion.div
        custom={3}
        variants={rise}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="relative z-10 mx-auto mt-16 max-w-4xl px-6"
      >
        <div className="relative overflow-hidden rounded-t-2xl border border-white/10 bg-[#0d1017] shadow-[0_-20px_80px_-20px_rgba(99,102,241,0.5)] ring-1 ring-white/10">
          {/* subtle top sheen on the window */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.06] to-transparent"
          />

          {/* window chrome */}
          <div className="relative flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <div className="mx-auto flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
              <Search className="size-3" />
              Search Beacon…
            </div>
          </div>

          {/* faux dashboard body */}
          <div className="grid grid-cols-[180px_1fr] gap-px bg-white/[0.04]">
            {/* sidebar */}
            <div className="space-y-2 bg-[#0d1017] p-4">
              {["Overview", "Repositories", "Deploys", "Insights", "Team"].map(
                (label, idx) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                      idx === 0
                        ? "bg-white/[0.06] text-white ring-1 ring-white/10"
                        : "text-white/45"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#818cf8]" />
                    {label}
                  </div>
                )
              )}
            </div>

            {/* main content */}
            <div className="space-y-3 bg-[#0d1017] p-5">
              <div className="flex items-center justify-between">
                <div className="h-3 w-40 rounded bg-white/10" />
                <div className="h-6 w-24 rounded-md bg-white/[0.06]" />
              </div>
              {[0, 1, 2, 3, 4].map((r) => (
                <div
                  key={r}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-3"
                >
                  <GitBranch className="size-4 shrink-0 text-[#818cf8]" />
                  <div className="h-2.5 rounded bg-white/10" style={{ width: `${70 - r * 8}%` }} />
                  <div className="ml-auto h-2.5 w-10 rounded bg-white/[0.06]" />
                </div>
              ))}
            </div>
          </div>

          {/* fade the bottom into the page */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0F14] to-transparent" />
        </div>
      </motion.div>

      {/* page bottom fade */}
      <div className="h-24 bg-gradient-to-b from-transparent to-[#0B0F14]" />
    </section>
  );
}
