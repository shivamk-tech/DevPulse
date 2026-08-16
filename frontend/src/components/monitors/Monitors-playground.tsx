"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Globe } from "lucide-react";

import type { Moniters } from "@/types/moniter";
import { cn } from "@/lib/utils";

interface MonitorsPlaygroundProps {
  monitors: Moniters[];
  selectedId: string | null;
  onSelect: (monitor: Moniters) => void;
  loading?: boolean;
}

/**
 * Monitors as nodes orbiting the Beacon mark, rather than as table rows.
 *
 * The arrangement is derived, not authored: nodes are placed on concentric
 * rings by index, so the layout holds for three monitors or thirty without
 * anyone positioning anything. Ring radius grows in steps and the angle is
 * offset per ring, which keeps nodes from stacking on the same spoke.
 */
export function MonitorsPlayground({
  monitors,
  selectedId,
  onSelect,
  loading = false,
}: MonitorsPlaygroundProps) {
  const reduce = useReducedMotion();

  return (
    <div className="relative isolate h-full w-full overflow-hidden rounded-xl border border-white/8 bg-black">
      {/* Starfield. Two dot layers at different sizes and offsets so it reads
         as depth rather than as a regular grid. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.25) 0.5px, transparent 0.5px), radial-gradient(circle at center, rgba(255,255,255,0.14) 0.5px, transparent 0.5px)",
          backgroundSize: "90px 90px, 47px 63px",
          backgroundPosition: "0 0, 23px 31px",
        }}
      />

      {/* Orbit rings — dashed, faint, purely spatial scaffolding. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        {[38, 62, 86].map((size) => (
          <span
            key={size}
            className="absolute aspect-square rounded-full border border-dashed border-white/8"
            style={{ width: `${size}%` }}
          />
        ))}
      </div>

      {/* The beacon itself, at the centre of the system. */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <motion.div
          className="relative grid size-16 place-items-center"
          animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            aria-hidden
            className="absolute inset-[-90%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_65%)]"
          />
          <Image
            src="/brand/beacon-mark.png"
            alt=""
            width={256}
            height={256}
            className="relative size-9 w-auto mix-blend-screen"
          />
        </motion.div>
      </div>

      {loading ? (
        <div className="absolute inset-0 grid place-items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
            Loading monitors
          </p>
        </div>
      ) : monitors.length === 0 ? (
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <p className="max-w-xs text-[13px] leading-relaxed text-white/35">
            Nothing in orbit yet. Create a monitor and it appears here.
          </p>
        </div>
      ) : (
        monitors.map((monitor, index) => {
          const { left, top } = orbitPosition(index);

          return (
            <MonitorNode
              key={monitor.id}
              monitor={monitor}
              index={index}
              left={left}
              top={top}
              selected={monitor.id === selectedId}
              onSelect={() => onSelect(monitor)}
              reduce={Boolean(reduce)}
            />
          );
        })
      )}
    </div>
  );
}

/**
 * Places node `index` on a ring. Six slots per ring, each ring wider than the
 * last and rotated by half a slot so nodes never line up radially.
 */
function orbitPosition(index: number) {
  const PER_RING = 6;
  const ring = Math.floor(index / PER_RING);
  const slot = index % PER_RING;

  const radius = 24 + ring * 13;
  const angle =
    (slot / PER_RING) * Math.PI * 2 + (ring * Math.PI) / PER_RING - Math.PI / 2;

  return {
    left: 50 + Math.cos(angle) * radius,
    top: 50 + Math.sin(angle) * radius,
  };
}

function MonitorNode({
  monitor,
  index,
  left,
  top,
  selected,
  onSelect,
  reduce,
}: {
  monitor: Moniters;
  index: number;
  left: number;
  top: number;
  selected: boolean;
  onSelect: () => void;
  reduce: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      initial={reduce ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay: reduce ? 0 : index * 0.05 }}
      style={{ left: `${left}%`, top: `${top}%` }}
      className={cn(
        "absolute w-56 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-3 text-left backdrop-blur-sm transition-colors duration-300",
        selected
          ? "border-white/35 bg-white/6"
          : "border-white/12 bg-black/70 hover:border-white/25 hover:bg-white/4"
      )}
    >
      {/* Status dot pinned to the corner, the way a badge sits on an app icon —
         readable at a glance without scanning into the card. */}
      <span
        aria-hidden
        className={cn(
          "absolute -left-1 -top-1 size-2.5 rounded-full ring-2 ring-black",
          monitor.is_active ? "bg-[#0ca30c]" : "bg-white/30"
        )}
      />

      <div className="flex items-start gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-md border border-white/10 bg-white/5">
          <Globe className="size-3.5 text-white/60" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[13px] font-medium text-white">
              {monitor.name}
            </p>
            <span className="shrink-0 rounded-sm border border-white/12 px-1.5 py-px font-mono text-[9px] tracking-tight text-white/50">
              {monitor.method}
            </span>
          </div>

          {/* Only what the API actually returns — interval and paused state.
             No uptime or latency here; those aren't in the payload, and a
             plausible-looking number is worse than no number. */}
          <p className="mt-1 font-mono text-[10px] text-white/35">
            every {monitor.interval}s · {monitor.timeout}s timeout
          </p>
        </div>
      </div>
    </motion.button>
  );
}
