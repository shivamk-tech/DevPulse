// components/dashboard/empty-state.tsx
import Link from "next/link";
import { Server } from "lucide-react";
import { Button } from "@/components/ui/Button"

interface EmptyStateProps {
  onCreateMonitor?: () => void;
}

export function EmptyState({ onCreateMonitor }: EmptyStateProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center rounded-lg border border-white/10 bg-[#0F0F14] px-4 py-3 text-center">
      <div className="mb-2 flex items-center justify-center gap-3.5">
        <IllustrationNode size="sm" />
        <IllustrationNode size="lg" />
        <IllustrationNode size="sm" />
      </div>

      <h2 className="text-sm font-light text-white">No monitors yet</h2>
      <p className="mt-1 max-w-sm text-[11.5px] font-light text-zinc-400">
        Create your first monitor to start tracking uptime, response time,
        downtime alerts and incidents.
      </p>

      <Button
        variant="gradient"
        size="sm"
        className="mt-2.5 h-[30px] text-xs font-light"
        onClick={onCreateMonitor}
      >
        Create First Monitor
      </Button>

      <Link
        href="/dashboard/docs/monitoring"
        className="mt-2 text-xs font-light text-indigo-400 transition-colors hover:text-indigo-300"
      >
        Learn how monitoring works →
      </Link>
    </section>
  );
}

interface IllustrationNodeProps {
  size: "sm" | "lg";
}

function IllustrationNode({ size }: IllustrationNodeProps) {
  const isLarge = size === "lg";
  const boxSize = isLarge ? "h-11 w-11" : "h-8 w-8";
  const iconSize = isLarge ? "h-5 w-5" : "h-3.5 w-3.5";
  const iconColor = isLarge ? "text-indigo-400" : "text-indigo-400/70";
  const border = isLarge ? "border-indigo-400/30" : "border-indigo-400/20";
  const glow = isLarge ? "shadow-md shadow-indigo-500/20" : "";

  return (
    <div
      className={`flex ${boxSize} items-center justify-center rounded-xl border ${border} bg-gradient-to-b from-indigo-500/15 to-indigo-900/5 ${glow}`}
    >
      <Server className={`${iconSize} ${iconColor}`} />
    </div>
  );
}