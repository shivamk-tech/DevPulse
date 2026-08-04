"use client";

import { useEffect, useRef, useState } from "react";
import { Activity } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";

/**
 * Animated brand panel for the auth screens (the left half on `lg`+).
 *
 * Two modes, chosen by `HERO_VIDEO`:
 *  - Video hero  — a full-panel muted/looping clip behind the scrim + caption.
 *  - Carousel    — cross-dissolving image/gradient slides (used when there's
 *                  no video, or as the reduced-motion / loading fallback).
 *
 * To use a video: drop it in /public/auth/ and point `HERO_VIDEO` at it. Set it
 * to `null` to fall back to the image carousel below.
 */
const HERO_VIDEO: string | null = "/auth/AuthVdo.mp4";
/** Shown instantly while the video loads, and as the still fallback. */
const HERO_POSTER = "/auth/slide-1.jpg";

const HERO_CAPTION = {
  title: "Ship faster, together.",
  subtitle:
    "From first commit to production deploy, DevPulse keeps your whole team in sync.",
};

type Slide = {
  /** Optional background image (place under /public). Falls back to `gradient`. */
  image?: string;
  /** CSS background used when no image is supplied. */
  gradient: string;
  title: string;
  subtitle: string;
};

const SLIDES: Slide[] = [
  {
    image: "/auth/slide-1.jpg",
    gradient:
      "radial-gradient(120% 120% at 18% 22%, #4338ca 0%, transparent 52%), radial-gradient(120% 120% at 82% 82%, #7c3aed 0%, transparent 55%), linear-gradient(135deg, #1a1440, #0B0F14)",
    title: "Ship faster, together.",
    subtitle:
      "From first commit to production deploy, DevPulse keeps your whole team in sync.",
  },
  {
    image: "/auth/slide-2.jpg",
    gradient:
      "radial-gradient(120% 120% at 30% 72%, #2563eb 0%, transparent 52%), radial-gradient(120% 120% at 75% 18%, #06b6d4 0%, transparent 52%), linear-gradient(135deg, #0b1a2e, #0B0F14)",
    title: "Every pulse, in real time.",
    subtitle:
      "Live velocity, health, and deploy status across all of your repositories.",
  },
  {
    image: "/auth/slide-3.jpg",
    gradient:
      "radial-gradient(120% 120% at 24% 30%, #6d28d9 0%, transparent 52%), radial-gradient(120% 120% at 80% 78%, #be2564 0%, transparent 55%), linear-gradient(135deg, #241033, #0B0F14)",
    title: "Built for flow.",
    subtitle:
      "Less context-switching, more shipping — your workflow, beautifully in one place.",
  },
];

const INTERVAL = 6000;

/** Shared chrome painted over both modes: grid texture, scrim, brand, caption. */
function Overlay({
  reduce,
  children,
}: {
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Subtle grid texture for depth. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Legibility scrim — darkens toward the bottom behind the caption. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20"
      />

      {/* Foreground content. */}
      <div className="relative flex h-full flex-col justify-between p-10">
        {/* Brand mark */}
        <div className="flex items-center gap-2.5 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] shadow-lg shadow-indigo-500/40">
            <Activity className="size-5" strokeWidth={2.5} />
          </span>
          <span className="text-base font-semibold tracking-wide">DevPulse</span>
        </div>

        {children}
      </div>
    </>
  );
}

/** Crossfade duration at the loop seam, in seconds. */
const LOOP_FADE = 0.8;

function VideoHero({ reduce }: { reduce: boolean }) {
  // Two copies of the clip. Instead of the native `loop` (which hard-cuts the
  // last frame back to the first — reads as a "restart"), we start the second
  // copy from the top just before the first ends and dissolve between them, so
  // the seam is always hidden behind a short crossfade.
  const refs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ];
  const [top, setTop] = useState(0); // which copy is visible (opacity 100)
  const topRef = useRef(0);
  const lockRef = useRef(false); // guards against re-triggering during a fade

  useEffect(() => {
    topRef.current = top;
  }, [top]);

  // Kick off / honor reduced-motion (still poster frame, no playback).
  useEffect(() => {
    const a = refs[0].current;
    const b = refs[1].current;
    if (reduce) {
      a?.pause();
      b?.pause();
      return;
    }
    if (a) {
      a.currentTime = 0;
      a.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const handleTime = (i: number) => () => {
    if (reduce || lockRef.current || i !== topRef.current) return;
    const cur = refs[i].current;
    if (!cur || !cur.duration) return;
    if (cur.currentTime >= cur.duration - LOOP_FADE) {
      lockRef.current = true;
      const other = refs[1 - i].current;
      if (other) {
        other.currentTime = 0;
        other.play().catch(() => {});
      }
      topRef.current = 1 - i;
      setTop(1 - i);
      window.setTimeout(() => {
        lockRef.current = false;
      }, LOOP_FADE * 1000 + 150);
    }
  };

  return (
    <div className="relative hidden overflow-hidden border-r border-white/10 lg:block">
      {/* Poster underlay — visible before load and if the video can't play. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_POSTER})` }}
      />

      {[0, 1].map((i) => (
        <video
          key={i}
          ref={refs[i]}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-linear ${
            top === i ? "opacity-100" : "opacity-0"
          }`}
          // Zoom from the top edge so the source video's baked-in generator
          // watermark (bottom-right) is cropped off the visible area. Bump the
          // scale if a new clip's mark sits higher up the frame.
          style={{
            transitionDuration: `${LOOP_FADE}s`,
            transform: "scale(1.12)",
            transformOrigin: "top center",
          }}
          muted
          playsInline
          preload="auto"
          poster={HERO_POSTER}
          onTimeUpdate={handleTime(i)}
        >
          <source src={HERO_VIDEO ?? ""} type="video/mp4" />
        </video>
      ))}

      <Overlay reduce={reduce}>
        <div className="max-w-sm">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white">
            {HERO_CAPTION.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {HERO_CAPTION.subtitle}
          </p>
        </div>
      </Overlay>
    </div>
  );
}

function Carousel({ reduce }: { reduce: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      INTERVAL
    );
    return () => clearInterval(id);
  }, [reduce, paused]);

  const active = SLIDES[index];

  return (
    <div
      className="relative hidden overflow-hidden border-r border-white/10 lg:block"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide stack — cross-dissolve between layers. */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          aria-hidden
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`absolute inset-0 ${reduce ? "" : "auth-kenburns"}`}
            style={
              slide.image
                ? {
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : { backgroundImage: slide.gradient }
            }
          />
        </div>
      ))}

      <Overlay reduce={reduce}>
        <div>
          {/* Slide dots — active one stretches into a bar. */}
          <div className="mb-5 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-8 bg-white"
                    : "w-4 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Caption keyed by index so it re-mounts and fades up in sync with the dots. */}
          <motion.div
            key={index}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="max-w-sm"
          >
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white">
              {active.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {active.subtitle}
            </p>
          </motion.div>
        </div>
      </Overlay>
    </div>
  );
}

export function AuthShowcase() {
  const reduce = useReducedMotion() ?? false;

  return (
    <>
      {HERO_VIDEO ? <VideoHero reduce={reduce} /> : <Carousel reduce={reduce} />}

      <style>{`
        @keyframes authKenburns {
          0%   { transform: scale(1) translate3d(0, 0, 0); }
          100% { transform: scale(1.08) translate3d(-1.5%, -1.5%, 0); }
        }
        .auth-kenburns { animation: authKenburns 12s ease-in-out infinite alternate; }
      `}</style>
    </>
  );
}
