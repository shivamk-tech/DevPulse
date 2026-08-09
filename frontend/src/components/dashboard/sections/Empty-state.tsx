// components/dashboard/empty-state.tsx
"use client";

import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/dashboard/ui/Panel";

interface EmptyStateProps {
  onCreateMonitor?: () => void;
}

/**
 * The main canvas while the workspace has no monitors. This is where the
 * monitor list will render once there's data, so it carries the visual weight
 * of a real content area — generous height, centered figure, one action.
 */
export function EmptyState({ onCreateMonitor }: EmptyStateProps) {
  return (
    <Panel className="relative overflow-hidden px-6 py-14 text-center">
      {/* Soft indigo wash from the top, same ambient treatment as the auth card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.14),transparent_70%)]"
      />

      <div className="relative flex flex-col items-center">
        {/* Concentric pulse rings — a monitor waiting for its first signal */}
        <div className="relative flex size-14 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-2xl border border-indigo-400/15"
          />
          <span
            aria-hidden
            className="absolute inset-1.5 rounded-xl border border-indigo-400/25"
          />
          <span className="relative flex size-9 items-center justify-center rounded-lg bg-linear-to-b from-indigo-500/25 to-indigo-500/5 ring-1 ring-inset ring-indigo-400/30">
            <Radio className="size-4 text-indigo-300" />
          </span>
        </div>

        <h2 className="mt-5 text-base font-medium text-white">No monitors yet</h2>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/45">
          Add a website or API endpoint and Beacon starts checking it every minute,
          alerting you the moment it goes down.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="gradient" size="sm" onClick={onCreateMonitor} className="h-9">
            Create your first monitor
          </Button>

          <Link
            href="/dashboard/docs/monitoring"
            className="group inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
          >
            How monitoring works
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </Panel>
  );
}
