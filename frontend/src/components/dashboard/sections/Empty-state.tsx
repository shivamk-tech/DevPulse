// components/dashboard/empty-state.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  hasMonitors: boolean;
  /** True while monitors are still being fetched. */
  loading?: boolean;
  onCreateMonitor?: () => void;
}

/**
 * The main canvas while the workspace has no monitors — and the one place in
 * the dashboard that gets to look like the marketing site.
 *
 * A photographic panel rather than another bordered box: it's the first thing
 * a new account sees, it's where the monitor list will eventually live, and a
 * flat empty rectangle is a poor first impression of a product whose landing
 * page is cinematic. Once there's data this is replaced by a table, so the
 * visual weight costs nothing long-term.
 */
export function EmptyState({ hasMonitors, loading = false, onCreateMonitor }: EmptyStateProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-xl border border-white/10">
      <Image
        src="/auth/newBg.png"
        alt=""
        fill
        sizes="(min-width: 1280px) 60vw, 100vw"
        quality={90}
        // Same night-coast frame as the landing hero, anchored right so the
        // lighthouse and beam stay in view at this much wider aspect.
        className="object-cover object-right saturate-[0.6]"
      />

      {/* Legibility stack — heaviest at the foot, where the copy sits. */}
      <div aria-hidden className="absolute inset-0 bg-black/45" />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/20"
      />

      {/* Once monitors exist this panel steps back: it stops being the pitch and
         becomes a banner sitting above the list. Same frame, less of it —
         roughly half the height, smaller type, secondary button. Swapping to a
         different component would make the page jump; shrinking the same one
         lets it recede. */}
      {/* Three states, and the order matters: unknown comes first. Rendering
         "No monitors yet" while the request is still in flight tells the user
         something false, then corrects itself — which reads as a bug even when
         the data arrives a moment later. */}
      {loading ? (
        <div
          className="relative flex flex-col items-start px-7 py-12 sm:px-10 sm:py-14"
          aria-busy
        >
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="size-1 rounded-full bg-white/25" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
              Loading monitors
            </span>
          </div>

          {/* Bars sized to the copy they stand in for, so nothing shifts when
             the real content replaces them. */}
          <div className="mt-5 w-full animate-pulse space-y-3">
            <div className="h-5 w-72 max-w-full rounded-sm bg-white/8" />
            <div className="h-5 w-56 max-w-full rounded-sm bg-white/6" />
          </div>

          <div className="mt-7 h-8 w-40 animate-pulse rounded-sm bg-white/8" />
        </div>
      ) : (
      <div
        className={cn(
          "relative flex flex-col items-start px-7 sm:px-10",
          hasMonitors ? "py-8 sm:py-10" : "py-16 sm:py-20"
        )}
      >
        <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span
            aria-hidden
            className={cn(
              "size-1 rounded-full",
              // A live dot once something is actually being watched; a plain
              // grey one while nothing is.
              hasMonitors ? "bg-[#0ca30c]" : "bg-white/50"
            )}
          />
          {hasMonitors ? "Monitoring active" : "No monitors yet"}
        </p>

        {/* Two-tone, tight-tracked, left-anchored — the hero's exact recipe at
           a quarter of the size. */}
        <h2
          className={cn(
            "mt-4 max-w-md font-normal leading-tight tracking-[-0.03em] text-white",
            hasMonitors ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
          )}
        >
          {hasMonitors ? (
            <>
              Your endpoints are being watched.{" "}
              <span className="text-white/35">Add another any time.</span>
            </>
          ) : (
            <>
              Point Beacon at a URL{" "}
              <span className="text-white/35">and it starts watching.</span>
            </>
          )}
        </h2>

        {/* The explainer only earns its place before the first monitor — after
           that the reader already knows what the product does. */}
        {!hasMonitors && (
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/45">
            Checks run every minute from multiple regions. You&apos;ll hear from
            us the moment something stops responding.
          </p>
        )}

        <div
          className={cn(
            "flex flex-wrap items-center gap-3",
            hasMonitors ? "mt-5" : "mt-8"
          )}
        >
          <Button
            // Solid white is the one loud action on an otherwise empty page;
            // with monitors on screen the list is the subject and this drops to
            // an outline so it stops competing.
            variant={hasMonitors ? "outline" : "white"}
            size="sm"
            onClick={onCreateMonitor}
            className={
              hasMonitors
                ? "border-white/15 bg-transparent text-white hover:bg-white/5"
                : undefined
            }
          >
            {hasMonitors ? "Add monitor" : "Create your first monitor"}
          </Button>

          {!hasMonitors && (
            <Link
              href="/dashboard/docs/monitoring"
              className="group inline-flex items-center gap-1.5 font-mono text-[11px] text-white/50 transition-colors hover:text-white"
            >
              How monitoring works
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
      )}
    </section>
  );
}
