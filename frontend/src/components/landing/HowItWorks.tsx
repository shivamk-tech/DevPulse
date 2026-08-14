"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BellRing,
  CheckCircle2,
  Globe,
  Plus,
  Radio,
  Send,
  TriangleAlert,
} from "lucide-react";

import { EASE, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Backdrop for the panel. Swap for a dedicated asset when you have one. */
const PANEL_IMAGE = "/brand/card2.png";

/** How long each step holds before advancing on its own. */
const STEP_DURATION_MS = 6000;

export function HowItWorks() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Advances on its own so the section demonstrates itself, but any click or
  // hover hands control back to the reader — an auto-rotator that keeps moving
  // while you're reading it is worse than no motion at all.
  useEffect(() => {
    if (reduce || paused) return;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % STEPS.length);
    }, STEP_DURATION_MS);

    return () => clearInterval(timer);
  }, [reduce, paused]);

  const current = STEPS[active];

  return (
    <section id="how-it-works" className="relative bg-black py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-white/45"
        >
          <span className="size-1.5 rounded-full bg-white/50" />
          How it works
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          className="mt-6 max-w-4xl text-[clamp(1.875rem,6vw,4rem)] font-normal leading-[1.06] tracking-[-0.03em] text-white sm:leading-[1.02] sm:tracking-[-0.035em]"
        >
          One URL to start,
          <br />
          <span className="text-white/35">three steps to quiet nights.</span>
        </motion.h2>

        <div
          className="mt-14 grid grid-cols-1 items-center gap-10 sm:mt-16 lg:grid-cols-2 lg:gap-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Panel */}
          <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-white/10 lg:aspect-square">
            <Image
              src={PANEL_IMAGE}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={90}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/35" />

            <div className="relative flex size-full items-center justify-center p-5 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10, scale: 0.99 }}
                  transition={transition}
                  className="w-full max-w-80"
                >
                  {current.mock}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Steps */}
          <ol className="flex flex-col">
            {STEPS.map((step, index) => {
              const isActive = index === active;
              const Icon = step.icon;

              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-current={isActive}
                    className={cn(
                      // The rail is a left border per item, so the bright
                      // segment marks position in the list the way a scrollbar
                      // thumb does.
                      "w-full border-l-2 py-5 pl-5 text-left transition-colors duration-500 sm:pl-6",
                      isActive ? "border-white" : "border-white/12 hover:border-white/25"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "size-4 shrink-0 transition-colors duration-500",
                          isActive ? "text-white" : "text-white/30"
                        )}
                      />
                      <span
                        className={cn(
                          "font-mono text-[15px] tracking-tight transition-colors duration-500",
                          isActive ? "text-white" : "text-white/40"
                        )}
                      >
                        {index + 1} — {step.title}
                      </span>
                    </span>

                    <p
                      className={cn(
                        "mt-2.5 max-w-md text-sm leading-relaxed transition-colors duration-500",
                        isActive ? "text-white/70" : "text-white/30"
                      )}
                    >
                      {step.body}
                    </p>

                    {/* Progress bar under the live step — makes the rotation
                       legible instead of leaving it to jump unannounced. */}
                    {isActive && !reduce && !paused && (
                      <motion.span
                        key={`${step.id}-progress`}
                        className="mt-4 block h-px origin-left bg-white/40"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: STEP_DURATION_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function MockShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/12 bg-black/85 p-4 backdrop-blur-md">
      {children}
    </div>
  );
}

const STEPS = [
  {
    id: "add",
    title: "Add",
    icon: Plus,
    body: "Paste a URL and pick how often to check it. No agent to install, no DNS changes, nothing to deploy.",
    mock: (
      <MockShell>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          New monitor
        </p>

        <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-white/12 bg-white/4 px-3 py-2.5">
          <Globe className="size-3.5 shrink-0 text-white/40" />
          <span className="truncate font-mono text-[11px] text-white/85">
            https://api.acme.com
          </span>
        </div>

        <div className="mt-2 flex gap-2">
          <span className="rounded-md border border-white/12 px-2.5 py-1 font-mono text-[10px] text-white/50">
            GET
          </span>
          <span className="rounded-md border border-indigo-400/40 bg-indigo-500/15 px-2.5 py-1 font-mono text-[10px] text-indigo-200">
            Every 60s
          </span>
        </div>

        <div className="mt-3.5 flex items-center gap-2 border-t border-white/10 pt-3">
          <span className="rounded-md bg-white px-3 py-1.5 font-mono text-[10px] font-medium text-black">
            Create monitor
          </span>
        </div>
      </MockShell>
    ),
  },
  {
    id: "watch",
    title: "Watch",
    icon: Radio,
    body: "Checks run every minute from separate regions, so one slow network is never mistaken for an outage.",
    mock: (
      <MockShell>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Live checks
        </p>

        <div className="mt-3 flex flex-col gap-2">
          {[
            { region: "Mumbai", ms: "142ms" },
            { region: "Frankfurt", ms: "96ms" },
            { region: "Oregon", ms: "118ms" },
          ].map((row) => (
            <div
              key={row.region}
              className="flex items-center gap-2.5 rounded-lg border border-white/10 px-3 py-2"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-[#0ca30c]" />
              <span className="font-mono text-[11px] text-white/80">{row.region}</span>
              <span className="ml-auto font-mono text-[10px] text-white/40">
                200 · {row.ms}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="font-mono text-[10px] text-white/35">last check</span>
          <span className="font-mono text-[10px] text-white/60">14s ago</span>
        </div>
      </MockShell>
    ),
  },
  {
    id: "know",
    title: "Know",
    icon: BellRing,
    body: "Two failed checks in a row and you're paged — with the status code, the region, and how long it's been down.",
    mock: (
      <MockShell>
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-full bg-red-500/15">
            <TriangleAlert className="size-3 text-red-400" />
          </span>
          <span className="font-mono text-[11px] text-white/85">
            api.acme.com is down
          </span>
        </div>

        <p className="mt-3 font-mono text-[10px] leading-relaxed text-white/40">
          504 Gateway Timeout · 2 regions · 1m 12s
        </p>

        <div className="mt-3.5 flex flex-col gap-2 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2.5">
            <Send className="size-3.5 text-white/40" />
            <span className="font-mono text-[10px] text-white/70">
              Sent to #incidents
            </span>
            <CheckCircle2 className="ml-auto size-3.5 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2.5">
            <BellRing className="size-3.5 text-white/40" />
            <span className="font-mono text-[10px] text-white/70">
              Paged on-call
            </span>
            <CheckCircle2 className="ml-auto size-3.5 text-emerald-400" />
          </div>
        </div>
      </MockShell>
    ),
  },
];
