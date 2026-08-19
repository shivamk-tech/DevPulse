"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  Globe,
  Radio,
  Share2,
  TriangleAlert,
} from "lucide-react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Card backdrops, in order. Set an entry to null to fall back to the CSS wash.
 */
const CARD_IMAGES: (string | null)[] = [
  "/brand/card1.png",
  "/brand/card2.png",
  "/brand/card3.png",
];

/**
 * Three-up feature section.
 *
 * Each card is a dark photographic panel with a small UI mock floating inside
 * it, and the caption sits *outside* the panel below it. Keeping the text out
 * of the image is what makes the row read as a gallery rather than as three
 * banner ads — the image sells the mood, the caption does the explaining.
 */
export function Features() {
  const reduce = useReducedMotion();

  return (
    <section id="overview" className="relative bg-black py-20 sm:py-28 lg:py-32">
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
          Introducing monitoring 
        </motion.p>

        {/* Two-tone headline: the first clause carries the point in full white,
           the rest drops to grey so the eye lands on the claim, not the
           sentence. Same trick as a pull quote. */}
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          className="mt-6 max-w-4xl text-balance text-[clamp(1.875rem,6vw,4rem)] font-normal leading-[1.06] tracking-[-0.03em] text-white sm:leading-[1.02] sm:tracking-[-0.035em]"
        >
          Watching every endpoint{" "}
          <span className="text-white/35">so you never hear it from a user.</span>
        </motion.h2>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:mt-16 md:grid-cols-3 lg:gap-x-8">
          {CARDS.map((card, index) => (
            <motion.article
              key={card.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : index * 0.1 }}
              // `group` lives on the whole article, not just the panel, so
              // hovering the caption lights the card too — the two read as one
              // object, and having only half of it respond feels broken.
              className="group"
            >
              {/* Panel. The outline arrives on hover: a brighter edge plus a
                 soft indigo lift, both eased on the shared curve. */}
              <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-white/10 shadow-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-white/30 group-hover:shadow-[0_24px_70px_-30px_rgba(99,102,241,0.5)]">
                {CARD_IMAGES[index] ? (
                  // next/image, not a raw <img>: the sources are ~1.5MB PNGs,
                  // and this re-encodes them to WebP at the size actually
                  // rendered. `sizes` matters — without it Next assumes full
                  // viewport width and ships a needlessly large file for a
                  // third-width card.
                  <Image
                    src={CARD_IMAGES[index]!}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div aria-hidden className="absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(155deg,#06070F_0%,#020308_45%,#000000_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_15%,rgba(99,102,241,0.16),transparent_70%)]" />
                  </div>
                )}

                {/* Darkening pass. The mock inside is white-on-nothing, so the
                   backdrop has to sit well below it in value or the UI stops
                   reading — this holds whatever image gets dropped in. */}
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/40" />

                {/* The mock */}
                <div className="relative flex size-full items-center justify-center p-5 sm:p-6">
                  {card.mock}
                </div>
              </div>

              {/* Caption, outside the panel */}
              <h3 className="mt-6 font-mono text-[15px] tracking-tight text-white">
                {card.title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/45 transition-colors duration-500 group-hover:text-white/60">
                {card.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mocks — built in markup rather than shipped as screenshots, so they stay    */
/*  crisp at any DPI and can be edited when the product changes.                */
/* -------------------------------------------------------------------------- */

/** Small dark chip, the repeating unit across all three mocks. */
function Chip({
  icon: Icon,
  children,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border border-white/12 bg-black/85 px-3 py-2.5 backdrop-blur-md",
        className
      )}
    >
      {Icon && <Icon className="size-3.5 shrink-0 text-white/50" />}
      <span className="truncate font-mono text-[11px] tracking-tight text-white/85">
        {children}
      </span>
    </div>
  );
}

/** Vertical connector between stacked chips. */
function Connector() {
  return <span aria-hidden className="mx-auto h-4 w-px bg-white/15" />;
}

const CARDS = [
  {
    title: "Always Watching",
    body: "A check leaves every sixty seconds from multiple regions, so a blip in one place is never mistaken for an outage.",
    mock: (
      <div className="flex w-full max-w-55 flex-col">
        <Chip icon={Clock} className="self-center">
          Every 60s
        </Chip>
        <Connector />
        <Chip icon={Globe}>GET api.acme.com</Chip>
        <Connector />
        <Chip icon={CheckCircle2}>200 OK · 142ms</Chip>
      </div>
    ),
  },
  {
    title: "The Moment It Breaks",
    body: "Two failed checks in a row and the alert is already on its way — email, Slack, or a webhook of your own.",
    mock: (
      <div className="w-full max-w-60 rounded-xl border border-white/12 bg-black/85 p-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-full bg-red-500/15">
            <TriangleAlert className="size-3 text-red-400" />
          </span>
          <span className="font-mono text-[11px] text-white/85">Beacon</span>
          <span className="ml-auto font-mono text-[10px] text-white/30">now</span>
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-white/70">
          <span className="text-white">api.acme.com</span> stopped responding.
        </p>
        <p className="mt-1 font-mono text-[10px] text-white/35">
          2 failed checks · 504 Gateway Timeout
        </p>

        <div className="mt-3.5 flex gap-2 border-t border-white/10 pt-3">
          <span className="rounded-md bg-white px-2.5 py-1 font-mono text-[10px] font-medium text-black">
            Acknowledge
          </span>
          <span className="rounded-md border border-white/12 px-2.5 py-1 font-mono text-[10px] text-white/60">
            Mute 1h
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Proof For Everyone",
    body: "Publish a status page and let your customers check for themselves, instead of filling your inbox.",
    mock: (
      <div className="flex w-full max-w-57.5 flex-col gap-2">
        {[
          { label: "API", icon: Radio, state: "Operational", ok: true },
          { label: "Dashboard", icon: Bell, state: "Operational", ok: true },
          { label: "Webhooks", icon: BellRing, state: "Degraded", ok: false },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-2.5 rounded-lg border border-white/12 bg-black/85 px-3 py-2.5 backdrop-blur-md"
          >
            <row.icon className="size-3.5 shrink-0 text-white/40" />
            <span className="font-mono text-[11px] text-white/85">{row.label}</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full",
                  row.ok ? "bg-[#0ca30c]" : "bg-[#fab219]"
                )}
              />
              <span className="font-mono text-[10px] text-white/45">{row.state}</span>
            </span>
          </div>
        ))}

        <div className="mt-1 flex items-center gap-2 self-start rounded-lg border border-white/12 bg-black/85 px-3 py-2 backdrop-blur-md">
          <Share2 className="size-3 text-white/40" />
          <span className="font-mono text-[10px] text-white/60">
            status.acme.com
          </span>
        </div>
      </div>
    ),
  },
];
