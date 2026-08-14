"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Globe,
  MessageSquare,
  TriangleAlert,
} from "lucide-react";

import { EASE, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Tabbed use-case section.
 *
 * One panel at a time rather than a grid: each use case gets a full-size image
 * and a real sentence, which a four-up grid would compress into slogans. The
 * tab row keeps the other three one click away instead of hidden.
 */
export function UseCases() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const current = USE_CASES[active];

  return (
    <section id="features" className="relative bg-black py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Eyebrow */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-white/45"
        >
          <span className="size-1.5 rounded-full bg-white/50" />
          Use cases
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          className="mt-6 max-w-4xl text-balance text-[clamp(1.875rem,6vw,4rem)] font-normal leading-[1.06] tracking-[-0.03em] text-white sm:leading-[1.02] sm:tracking-[-0.035em]"
        >
          One place to watch it all,{" "}
          <span className="text-white/35">whatever you ship.</span>
        </motion.h2>

        {/* Tabs. Horizontally scrollable below sm — four mono labels don't fit
           on a phone, and wrapping them onto two rows breaks the underline. */}
        <div className="mt-12 overflow-x-auto border-b border-white/10 sm:mt-16 scrollbar-none [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-1">
            {USE_CASES.map((useCase, index) => {
              const isActive = index === active;

              return (
                <button
                  key={useCase.tab}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-selected={isActive}
                  role="tab"
                  className={cn(
                    "relative px-4 pb-3.5 pt-1 font-mono text-[13px] tracking-tight transition-colors duration-200 sm:px-5",
                    isActive ? "text-white" : "text-white/40 hover:text-white/70"
                  )}
                >
                  {useCase.tab}

                  {/* Shared layout element, so the rule slides between tabs
                     instead of blinking out and back in. */}
                  {isActive && (
                    <motion.span
                      layoutId="useCaseUnderline"
                      className="absolute inset-x-0 -bottom-px h-px bg-white"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 36 }
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-16">
          {/* Visual */}
          <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-white/10 lg:aspect-3/4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.tab}
                initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute inset-0"
              >
                {current.image ? (
                  <Image
                    src={current.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div aria-hidden className="absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(155deg,#06070F_0%,#020308_45%,#000000_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_20%,rgba(99,102,241,0.18),transparent_70%)]" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/40" />
              </motion.div>
            </AnimatePresence>

            {/* Mock, sitting low in the frame as in a product shot rather than
               dead-centre — leaves the image room to be an image. */}
            <div className="relative flex size-full items-end justify-center p-5 sm:p-7 lg:pb-14">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.tab}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={transition}
                  className="w-full max-w-80"
                >
                  {current.mock}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Copy */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.tab}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={transition}
            >
              <p className="font-mono text-[13px] tracking-tight text-white/45">
                {current.tab}
              </p>

              <p className="mt-5 max-w-lg text-balance text-[clamp(1.375rem,3.2vw,2rem)] font-normal leading-tight tracking-[-0.02em] text-white">
                {current.headline}
              </p>

              <Link
                href="/signup"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-mono text-[13px] font-medium tracking-tight text-black transition-all duration-200 hover:bg-white/90"
              >
                Get started
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Row({
  icon: Icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "neutral" | "good" | "bad";
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-white/12 bg-black/85 px-3 py-2.5 backdrop-blur-md">
      <Icon className="size-3.5 shrink-0 text-white/40" />
      <span className="truncate font-mono text-[11px] text-white/85">{label}</span>
      <span className="ml-auto flex shrink-0 items-center gap-1.5">
        {tone !== "neutral" && (
          <span
            aria-hidden
            className={cn(
              "size-1.5 rounded-full",
              tone === "good" ? "bg-[#0ca30c]" : "bg-[#d03b3b]"
            )}
          />
        )}
        <span className="font-mono text-[10px] text-white/45">{value}</span>
      </span>
    </div>
  );
}

const USE_CASES = [
  {
    tab: "Websites",
    headline: "Catch a bad deploy before your customers hit refresh.",
    image: "/brand/card1.png",
    mock: (
      <div className="flex flex-col gap-2">
        <Row icon={Globe} label="acme.com" value="200 · 142ms" tone="good" />
        <Row icon={Globe} label="acme.com/pricing" value="200 · 96ms" tone="good" />
        <Row icon={Globe} label="acme.com/app" value="500 · timeout" tone="bad" />
      </div>
    ),
  },
  {
    tab: "APIs",
    headline: "Watch every endpoint that matters, not just the homepage.",
    image: "/brand/card2.png",
    mock: (
      <div className="rounded-xl border border-white/12 bg-black/85 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Activity className="size-3.5 text-indigo-300" />
          <span className="font-mono text-[11px] text-white/85">
            GET /v1/checkout
          </span>
        </div>

        {/* 30-bar response history. Reads as a sparkline without claiming to
           plot real numbers — the two red bars are the story. */}
        <div className="mt-4 flex h-10 items-end gap-0.75">
          {[
            5, 6, 5, 7, 6, 5, 6, 8, 6, 5, 7, 6, 5, 6, 7, 5, 6, 5, 7, 6, 9, 10, 6,
            5, 6, 7, 5, 6, 5, 6,
          ].map((height, i) => (
            <span
              key={i}
              style={{ height: `${height * 10}%` }}
              className={cn(
                "flex-1 rounded-sm",
                i === 20 || i === 21 ? "bg-[#d03b3b]" : "bg-white/25"
              )}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="font-mono text-[10px] text-white/35">last 30 checks</span>
          <span className="font-mono text-[10px] text-white/60">99.4% up</span>
        </div>
      </div>
    ),
  },
  {
    tab: "Status pages",
    headline: "Publish uptime your customers can check without emailing you.",
    image: "/brand/card3.png",
    mock: (
      <div className="flex flex-col gap-2">
        <Row icon={Activity} label="API" value="Operational" tone="good" />
        <Row icon={Globe} label="Dashboard" value="Operational" tone="good" />
        <Row icon={Bell} label="Webhooks" value="Degraded" tone="bad" />
      </div>
    ),
  },
  {
    tab: "On-call",
    headline: "Route the page to whoever is actually awake right now.",
    image: "/brand/useCases1.png",
    mock: (
      <div className="rounded-xl border border-white/12 bg-black/85 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-full bg-red-500/15">
            <TriangleAlert className="size-3 text-red-400" />
          </span>
          <span className="font-mono text-[11px] text-white/85">
            api.acme.com down
          </span>
        </div>

        <div className="mt-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2.5 rounded-lg border border-white/10 px-3 py-2">
            <MessageSquare className="size-3.5 text-white/40" />
            <span className="font-mono text-[10px] text-white/70">#incidents</span>
            <CheckCircle2 className="ml-auto size-3.5 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-white/10 px-3 py-2">
            <Bell className="size-3.5 text-white/40" />
            <span className="font-mono text-[10px] text-white/70">
              on-call: priya
            </span>
            <CheckCircle2 className="ml-auto size-3.5 text-emerald-400" />
          </div>
        </div>
      </div>
    ),
  },
];
