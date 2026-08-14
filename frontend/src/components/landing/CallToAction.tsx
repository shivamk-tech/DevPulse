"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CTA_VIDEO = "/auth/heroBg4.mp4";

/**
 * Closing band.
 *
 * The clip is 1280×720, so it is upscaled on any large display. Rather than
 * fight that, it sits under a heavy scrim: at this exposure the footage reads
 * as atmosphere rather than as a picture, and softness in something you can
 * barely see is not softness anyone notices. Contrast for the type comes free.
 */
export function CallToAction() {
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div aria-hidden className="absolute inset-0">
        {/* Base wash, visible while the clip loads and under reduced-motion. */}
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#05060D_0%,#02030A_50%,#000000_100%)]" />

        {!reduce && (
          <video
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-out",
              videoReady ? "opacity-100" : "opacity-0"
            )}
            src={CTA_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
          />
        )}

        {/* The darkening. Deliberately heavier than the hero's — this footage
           is a third the resolution and is being asked to fill the same width,
           so it earns its place as texture, not as a subject. */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(65%_60%_at_50%_50%,transparent,rgba(0,0,0,0.75))]" />

        {/* Corner sink over the generator's watermark. */}
        <div className="absolute inset-0 bg-[radial-gradient(40%_45%_at_100%_100%,rgba(0,0,0,0.95),transparent_70%)]" />

        {/* Seams into the black sections above and below, so the band reads as
           part of the page rather than as a pasted-in strip. */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-28 text-center sm:px-8 sm:py-36 lg:py-44">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40 sm:text-[11px]"
        >
          Start free
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          className="mt-5 text-balance text-[clamp(1.875rem,6vw,3.75rem)] font-normal leading-[1.06] tracking-[-0.03em] text-white sm:leading-[1.02] sm:tracking-[-0.035em]"
        >
          Your first monitor takes{" "}
          <span className="text-white/40">about thirty seconds.</span>
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
          className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/50 sm:text-base"
        >
          Paste a URL, pick an interval, and Beacon starts watching. No agent, no
          card, no meeting with sales.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.24 }}
          className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <Link
            href="/signup"
            className="group flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 font-mono text-[13px] font-medium tracking-tight text-black transition-all duration-200 hover:bg-white/90 sm:py-3"
          >
            Start monitoring
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="#how-it-works"
            className="rounded-md border border-white/15 bg-white/5 px-6 py-3.5 text-center font-mono text-[13px] tracking-tight text-white/80 backdrop-blur-md transition-colors duration-200 hover:bg-white/12 hover:text-white sm:py-3"
          >
            See how it works
          </Link>
        </motion.div>
      </div>

      {/* Brand bug, doubling as the watermark cover. Near-opaque, because it
         has to hide what is behind it rather than tint it. */}
      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2.5 rounded-sm border border-white/10 bg-black/90 px-3 py-2.5 backdrop-blur-md sm:bottom-7 sm:right-8">
        <Image
          src="/brand/beacon-mark.png"
          alt=""
          width={256}
          height={256}
          className="size-5 w-auto mix-blend-screen"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          Beacon
        </span>
      </div>
    </section>
  );
}
