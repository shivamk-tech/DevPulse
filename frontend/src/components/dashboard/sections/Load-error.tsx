"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RefreshCw, WifiOff } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface LoadErrorProps {
  /** Short noun for what failed to load, e.g. "monitors". */
  what?: string;
  /** Re-runs the failed request. Should return the query's promise. */
  onRetry: () => Promise<unknown> | void;
}

/**
 * Full-panel error state for a failed data load.
 *
 * Kept deliberately calm: a fetch failure on a monitoring dashboard is usually
 * a network blip or an expired session, not a catastrophe, and the visual
 * shouldn't imply otherwise. One clear action, no red walls.
 */
export function LoadError({ what = "monitors", onRetry }: LoadErrorProps) {
  const reduce = useReducedMotion();
  const [retrying, setRetrying] = useState(false);

  const retry = async () => {
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      // Hold the spinner briefly so an instant failure doesn't just flicker.
      window.setTimeout(() => setRetrying(false), 400);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-350 items-center justify-center p-6">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-black px-8 py-12 text-center"
      >
        {/* Ambient wash, same recipe as the empty state, so the two read as
           siblings rather than one being an alarm. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07),transparent_70%)]"
        />

        <div className="relative flex flex-col items-center">
          {/* Icon in a ringed tile — the dashed outer ring is the "signal lost"
             cue; it slowly rotates while a retry is in flight. */}
          <div className="relative grid size-16 place-items-center">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-2xl border border-dashed border-white/15"
              animate={retrying && !reduce ? { rotate: 360 } : { rotate: 0 }}
              transition={
                retrying ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.3 }
              }
            />
            <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/5">
              <WifiOff className="size-5 text-white/70" strokeWidth={1.75} />
            </span>
          </div>

          <p className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            <span aria-hidden className="size-1 rounded-full bg-[#fab219]" />
            {what} unavailable
          </p>

          <h2 className="mt-3 text-lg font-medium tracking-tight text-white">
            Couldn&apos;t load your {what}
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/45">
            The request didn&apos;t come back. Check your connection, or try again in
            a moment.
          </p>

          <Button
            variant="white"
            size="sm"
            onClick={retry}
            loading={retrying}
            leftSection={
              !retrying ? <RefreshCw className="size-3.5" /> : undefined
            }
            className={cn("mt-7", retrying && "pointer-events-none")}
          >
            {retrying ? "Retrying…" : "Try again"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
