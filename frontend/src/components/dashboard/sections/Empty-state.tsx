// components/dashboard/empty-state.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
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
export function EmptyState({ onCreateMonitor }: EmptyStateProps) {
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

      <div className="relative flex flex-col items-start px-7 py-16 sm:px-10 sm:py-20">
        <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span aria-hidden className="size-1 rounded-full bg-white/50" />
          No monitors yet
        </p>

        {/* Two-tone, tight-tracked, left-anchored — the hero's exact recipe at
           a quarter of the size. */}
        <h2 className="mt-4 max-w-md text-xl font-normal leading-tight tracking-[-0.03em] text-white sm:text-2xl">
          Point Beacon at a URL{" "}
          <span className="text-white/35">and it starts watching.</span>
        </h2>

        <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/45">
          Checks run every minute from multiple regions. You&apos;ll hear from us
          the moment something stops responding.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button variant="white" size="sm" onClick={onCreateMonitor}>
            Create your first monitor
          </Button>

          <Link
            href="/dashboard/docs/monitoring"
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] text-white/50 transition-colors hover:text-white"
          >
            How monitoring works
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
