"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Backdrop still. A sharp image beats a soft clip here: the generated video was
 * 1280×720, which is a 2.3× upscale on a retina display and no amount of CSS
 * recovers detail the file never had. Motion comes from a slow drift instead.
 */
const HERO_IMAGE = "/auth/newBg.png";

/**
 * Full-bleed cinematic hero. Type is anchored bottom-left over the image, which
 * is what gives the layout its editorial feel — a centered headline on a photo
 * reads as a stock template, an anchored one reads as art direction.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const [imageReady, setImageReady] = useState(false);

  const rise = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.12 * i },
    }),
  };

  return (
    // `pt-28` reserves room for the overlaid nav. Without it, a landscape phone
    // (short viewport, `justify-end`) pushes the headline up under the nav
    // chips. `min-h-svh` rather than `100vh` so mobile browser chrome can't
    // hide the CTAs.
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-black pt-28">
      {/* ---- Backdrop ---- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* CSS scene underneath, on screen instantly while the image decodes,
           so the hero never starts as a black rectangle. */}
        <CssScene reduce={Boolean(reduce)} />

        {/* Ken burns. A still needs *some* life or the page feels like a
           screenshot — but at 1.06× over 30 seconds it's below the threshold
           you'd consciously notice, which is the point. Held still under
           reduced-motion. */}
        <motion.div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            imageReady ? "opacity-100" : "opacity-0"
          )}
          animate={reduce ? undefined : { scale: [1, 1.03, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            // Next defaults to quality 75, which is fine for product shots but
            // visibly smears this one — it's almost entirely soft tonal
            // gradients in fog, the first thing lossy encoding throws away.
            quality={92}
            className="object-cover"
            onLoad={() => setImageReady(true)}
          />
        </motion.div>

        {/* Drifting fog, sitting on the photograph but under the scrims so it
           can't affect text legibility. */}
        <Fog reduce={Boolean(reduce)} />

        {/* Legibility stack. Lighter than it was under the video — this frame
           is already almost black on the left, and stacking heavy scrims on
           top was flattening what little detail the water has. */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/55 to-transparent" />

        {/* No grain overlay here on purpose. It earned its place when the
           backdrop was an upscaled 720p frame and needed texture to disguise
           the softness — over a native-resolution photograph it just lays
           visible noise across an otherwise clean sky. The CSS fallback scene
           still carries its own grain, where flat gradients genuinely do band. */}
      </div>

      {/* ---- Content ---- */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 sm:px-8 sm:pb-20 lg:pb-24">
        <motion.p
          custom={0}
          variants={rise}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:text-[11px] sm:tracking-[0.28em]"
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
          className="mt-4 max-w-4xl text-balance text-[clamp(1.875rem,7vw,4.5rem)] font-normal leading-[1.04] tracking-[-0.03em] text-white sm:mt-5 sm:leading-none sm:tracking-[-0.035em]"
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
          className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
        >
          <Link
            href="/signup"
            className="group flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 font-mono text-[13px] font-medium tracking-tight text-black transition-all duration-200 hover:bg-white/90 sm:py-3"
          >
            Start monitoring
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="#overview"
            className="rounded-md border border-white/15 bg-white/5 px-6 py-3.5 text-center font-mono text-[13px] tracking-tight text-white/80 backdrop-blur-md transition-colors duration-200 hover:bg-white/12 hover:text-white sm:py-3"
          >
            See how it works
          </Link>
        </motion.div>
      </div>

      {/* Brand bug, back in the corner where it belongs — the still carries
         no watermark, so it no longer has to double as a cover. */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.9 }}
        className="absolute bottom-5 right-5 z-10 flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 backdrop-blur-md sm:bottom-7 sm:right-8"
      >
        <Image
          src="/brand/beacon-mark.png"
          alt=""
          width={256}
          height={256}
          className="size-6 w-auto mix-blend-screen"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          Beacon
        </span>
      </motion.div>
    </section>
  );
}

/**
 * Fog drifting across the photograph.
 *
 * Three banks rather than one: each has its own width, speed, direction and
 * opacity cycle, and because the periods (48s / 71s / 95s) share no common
 * factor, the combined pattern effectively never repeats. One layer, however
 * slow, always resolves into an obvious loop.
 *
 * Only `transform` and `opacity` animate — both composited on the GPU. The
 * blur is set once and never re-computed, which is what keeps a full-screen
 * effect off the main thread.
 *
 * The whole thing is masked to a horizontal band roughly where the real fog
 * sits in the frame. Fog over the dark foreground water would lift the exact
 * area the headline needs to stay black.
 */
function Fog({ reduce }: { reduce: boolean }) {
  // Interpolated motion is what reduced-motion is asking us to drop.
  if (reduce) return null;

  const bands = [
    {
      className:
        "top-0 h-full bg-[radial-gradient(ellipse_55%_45%_at_35%_50%,rgba(198,214,236,0.13),transparent_72%)] blur-3xl",
      x: ["-8%", "2%", "-8%"],
      y: ["0%", "-2%", "0%"],
      opacity: [0.7, 1, 0.7],
      duration: 48,
    },
    {
      className:
        "top-[10%] h-[80%] bg-[radial-gradient(ellipse_45%_40%_at_65%_45%,rgba(180,200,228,0.11),transparent_70%)] blur-3xl",
      x: ["4%", "-6%", "4%"],
      y: ["0%", "3%", "0%"],
      opacity: [0.5, 0.9, 0.5],
      duration: 71,
    },
    {
      // Tighter and less blurred — gives the bank an edge so it reads as fog
      // rather than as a glow.
      className:
        "top-[22%] h-[60%] bg-[radial-gradient(ellipse_35%_30%_at_50%_50%,rgba(210,224,244,0.09),transparent_65%)] blur-2xl",
      x: ["-3%", "6%", "-3%"],
      y: ["1%", "-1%", "1%"],
      opacity: [0.4, 0.75, 0.4],
      duration: 95,
    },
  ];

  return (
    <div
      aria-hidden
      // Sits low, on the horizon haze — not up in the open sky. Fog belongs
      // where the air is thick; drifting it across clear sky reads as a dirty
      // overlay rather than as weather.
      className="pointer-events-none absolute inset-x-0 top-[40%] h-[32%] overflow-hidden"
      style={{
        // Feathered top and bottom so the band has no visible edge.
        maskImage:
          "linear-gradient(to bottom, transparent, black 28%, black 70%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 28%, black 70%, transparent)",
      }}
    >
      {/* Second mask, horizontal: fog thins out before it reaches the
         lighthouse on the right. Blurred layers drifting across the one sharp
         subject in the frame is what made the photo read as soft. Nested
         rather than composited, since mask-composite support is uneven. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to right, black 45%, transparent 78%)",
          WebkitMaskImage: "linear-gradient(to right, black 45%, transparent 78%)",
        }}
      >
        {bands.map((band, index) => (
          <motion.div
            key={index}
            // Twice the viewport width, so it can drift a long way without an
            // edge ever entering the frame.
            className={cn("absolute -left-1/2 w-[200%] mix-blend-screen", band.className)}
            animate={{ x: band.x, y: band.y, opacity: band.opacity }}
            transition={{
              duration: band.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#03040A_0%,#05060F_35%,#010204_70%,#000000_100%)]" />

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
