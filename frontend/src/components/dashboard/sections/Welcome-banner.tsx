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
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-sm text-white/45">
          Here&apos;s the state of your infrastructure.
        </p>
      </div>

      <Button
        variant="white"
        size="sm"
        leftSection={<Plus className="size-4" />}
        onClick={onCreateMonitor}
        className="h-9"
      >
        Create monitor
      </Button>
    </header>
  );
}
