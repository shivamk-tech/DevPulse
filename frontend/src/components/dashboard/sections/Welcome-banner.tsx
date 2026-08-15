// components/dashboard/welcome-banner.tsx
"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface WelcomeBannerProps {
  userName?: string;
  onCreateMonitor?: () => void;
}

/**
 * The page header. This used to be a gradient card competing with the panels
 * below it; a dashboard reads calmer when the header is just type on the shell
 * and the cards are the only raised surfaces.
 *
 * It also owns the single primary "Create monitor" button for the whole view —
 * the empty state and checklist below defer to it rather than each shipping
 * their own filled button.
 */
export function WelcomeBanner({
  userName = "Shivam",
  onCreateMonitor,
}: WelcomeBannerProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      {/* Set like a landing section rather than a dashboard title bar: mono
         eyebrow with a dot, then a two-tone line where the greeting is white
         and the context drops to grey. That split is the landing page's
         signature move, and it makes the eye land on the name instead of
         reading a flat sentence. */}
      <div>
        <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          <span aria-hidden className="size-1 rounded-full bg-white/45" />
          Overview
        </p>

        <h1 className="mt-3 text-xl font-normal leading-tight tracking-[-0.02em] text-white sm:text-2xl">
          Welcome back, {userName}.{" "}
          <span className="text-white/30">Here&apos;s where things stand.</span>
        </h1>
      </div>

      <Button
        variant="white"
        size="sm"
        leftSection={<Plus className="size-4" />}
        onClick={onCreateMonitor}
        className="h-8"
      >
        Create monitor
      </Button>
    </header>
  );
}
