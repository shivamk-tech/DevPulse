"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Background clip. Swap the path (or set to null to fall back to the CSS scene). */
const HERO_VIDEO = "/auth/heroBg4.mp4";

/**
 * Full-bleed cinematic hero. Type is anchored bottom-left over the image, which
 * is what gives the layout its editorial feel — a centered headline on a photo
 * reads as a stock template, an anchored one reads as art direction.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  const rise = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.12 * i },
    }),
  };

  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-[#05070A]">
      {/* ---- Backdrop ---- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* The CSS scene always renders underneath and doubles as the poster:
           it's on screen instantly while the clip downloads, so the hero never
           starts as a black rectangle. No poster JPEG to generate or ship. */}
        <CssScene reduce={Boolean(reduce)} />

        {/* Skipped entirely under reduced-motion — a full-screen moving
           backdrop is precisely what that setting exists to turn off, and
           skipping it also spares those users the download. */}
        {HERO_VIDEO && !reduce && (
          <video
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-out",
              videoReady ? "opacity-100" : "opacity-0"
            )}
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            // Fade in only once it can actually play through, so the swap from
            // CSS scene to footage is a dissolve rather than a pop.
            onCanPlay={() => setVideoReady(true)}
          />
        )}

        {/* Legibility stack. Two gradients rather than one flat scrim: the
           bottom one carries the text, the top one keeps the nav readable,
           and the middle of the image stays untouched. */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent" />
      </div>

      {/* ---- Content ---- */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
        <motion.p
          custom={0}
          variants={rise}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45"
        >
          Uptime monitoring
        </motion.p>

        {/* Tracking is pulled in hard (-0.04em) — at display size the default
           spacing looks loose, and tight tracking is most of what reads as
           "premium" in this style of type. */}
        <motion.h1
          custom={1}
          variants={rise}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mt-5 max-w-4xl text-balance text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white"
        >
          Know it&apos;s down before your users do
        </motion.h1>

        <motion.p
          custom={2}
          variants={rise}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/55 sm:text-base"
        >
          Beacon checks your sites and APIs every minute, from everywhere, and
          tells you the moment something breaks.
        </motion.p>

        <motion.div
          custom={3}
          variants={rise}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-md bg-white px-6 py-3 font-mono text-[13px] font-medium tracking-tight text-black transition-all duration-200 hover:bg-white/90"
          >
            Start monitoring
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="#overview"
            className="rounded-md border border-white/15 bg-white/5 px-6 py-3 font-mono text-[13px] tracking-tight text-white/80 backdrop-blur-md transition-colors duration-200 hover:bg-white/12 hover:text-white"
          >
            See how it works
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * The backdrop, drawn in CSS — no image asset required.
 *
 * Layers, back to front: a night sky wash, a low horizon glow, two drifting
 * haze banks, a slow lighthouse beam, and a grain overlay. The grain matters
 * more than it sounds: large flat gradients band visibly on 8-bit displays, and
 * a little noise breaks the bands up the way film does.
 */
function CssScene({ reduce }: { reduce: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Night sky → deep sea */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#070A12_0%,#0A1020_35%,#070A10_70%,#05070A_100%)]" />

      {/* Horizon glow, low and off-centre */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(80%_100%_at_35%_100%,rgba(99,102,241,0.22),transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(70%_90%_at_70%_0%,rgba(124,58,237,0.16),transparent_70%)]" />

      {/* Haze banks. Two, at different sizes and speeds, so the drift never
         resolves into an obvious loop. */}
      <motion.div
        className="absolute -left-1/4 top-[45%] h-152 w-280 rounded-full bg-indigo-500/10 blur-[130px]"
        animate={reduce ? undefined : { x: [0, 80, 0], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 top-[30%] h-120 w-220 rounded-full bg-violet-500/10 blur-[120px]"
        animate={reduce ? undefined : { x: [0, -60, 0], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The beam — a soft wedge sweeping the sky, echoing the mark */}
      {!reduce && (
        <motion.div
          className="absolute left-1/2 top-[18%] h-168 w-104 origin-top -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_0deg,rgba(165,180,252,0.10)_14deg,transparent_28deg)] blur-2xl"
          animate={{ rotate: [-14, 14, -14] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Grain — kills gradient banding */}
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
