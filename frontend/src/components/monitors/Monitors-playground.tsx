"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Globe, Maximize, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui";
import type { Moniters } from "@/types/moniter";
import { cn } from "@/lib/utils";

interface MonitorsPlaygroundProps {
  monitors: Moniters[];
  selectedId: string | null;
  onSelect: (monitor: Moniters) => void;
  onCreate?: () => void;
  loading?: boolean;
}

const MIN_SCALE = 0.4;
const MAX_SCALE = 2;

/** Human phrasing for the check cadence. */
function cadence(seconds: number) {
  if (!Number.isFinite(seconds)) return "—";
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.round(seconds / 60);
  return minutes === 1 ? "1 min" : `${minutes} min`;
}

/**
 * Monitors as a constellation.
 *
 * Two presentations from one data set: an orbital canvas on desktop, where
 * there's room for negative space to mean something, and a plain grid below
 * `lg`, where a scatter would just be a list you can't scan. Same cards, same
 * selection, no duplicated state.
 */
export function MonitorsPlayground({
  monitors,
  selectedId,
  onSelect,
  onCreate,
  loading = false,
}: MonitorsPlaygroundProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // The live view is kept in a ref and mirrored to state. Gesture maths needs
  // the current value synchronously — reading it from state inside a listener
  // gives you whatever it was when that listener was created.
  const viewRef = useRef({ scale: 1, x: 0, y: 0 });
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });

  const apply = (next: { scale: number; x: number; y: number }) => {
    viewRef.current = next;
    setView(next);
  };

  const [panning, setPanning] = useState(false);

  // Every active pointer, so one finger pans and two pinch. A Map rather than a
  // count because the gesture needs both positions, not just how many.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; mx: number; my: number } | null>(null);
  const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  /** Zoom about a point, keeping whatever sits under it pinned there. */
  const zoomAt = useCallback((nextScale: number, fx: number, fy: number) => {
    const v = viewRef.current;
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
    const k = clamped / v.scale;

    apply({ scale: clamped, x: fx - (fx - v.x) * k, y: fy - (fy - v.y) * k });
  }, []);

  // Native and non-passive: React registers wheel handlers passively, and a
  // passive listener can't call preventDefault — so the dashboard would scroll
  // behind the board on every gesture.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      const rect = el.getBoundingClientRect();
      const v = viewRef.current;

      // Browsers report a trackpad pinch as a wheel event with ctrlKey set.
      // Everything else — two-finger scroll, mouse wheel, shift+wheel — is a
      // pan. Treating all wheel input as zoom is exactly why two fingers were
      // zooming instead of moving the board.
      if (event.ctrlKey || event.metaKey) {
        zoomAt(
          v.scale * (1 - event.deltaY * 0.01),
          event.clientX - rect.left - rect.width / 2,
          event.clientY - rect.top - rect.height / 2
        );
        return;
      }

      apply({ scale: v.scale, x: v.x - event.deltaX, y: v.y - event.deltaY });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (event: React.PointerEvent) => {
    // Anything interactive opts out of panning. This matters more than it
    // looks: the handler calls setPointerCapture, which redirects the rest of
    // the gesture to the container — so a control that starts a pan never
    // receives its own click. That's why the zoom buttons did nothing.
    if ((event.target as HTMLElement).closest("[data-node], [data-nopan]")) return;

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 1) {
      const v = viewRef.current;
      setPanning(true);
      panStart.current = { x: event.clientX, y: event.clientY, ox: v.x, oy: v.y };
    } else if (pointers.current.size === 2) {
      setPanning(false);
      gesture.current = pinchState();
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!pointers.current.has(event.pointerId)) return;

    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    // Two fingers: scale by how far they've spread, and pan by how far their
    // midpoint moved — so a pinch can drag at the same time, which is what
    // makes it feel native instead of stepped.
    if (pointers.current.size === 2 && gesture.current) {
      const el = containerRef.current;
      const next = pinchState();
      if (!el || !next) return;

      const rect = el.getBoundingClientRect();
      const v = viewRef.current;
      const clamped = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, v.scale * (next.dist / gesture.current.dist))
      );
      const k = clamped / v.scale;

      const fx = next.mx - rect.left - rect.width / 2;
      const fy = next.my - rect.top - rect.height / 2;

      apply({
        scale: clamped,
        x: fx - (fx - v.x) * k + (next.mx - gesture.current.mx),
        y: fy - (fy - v.y) * k + (next.my - gesture.current.my),
      });

      gesture.current = next;
      return;
    }

    if (!panning) return;

    apply({
      scale: viewRef.current.scale,
      x: panStart.current.ox + (event.clientX - panStart.current.x),
      y: panStart.current.oy + (event.clientY - panStart.current.y),
    });
  };

  const onPointerUp = (event: React.PointerEvent) => {
    pointers.current.delete(event.pointerId);
    gesture.current = null;

    if (pointers.current.size === 1) {
      // Lifting one finger of a pinch hands control back to panning, re-anchored
      // on the finger still down — otherwise the board jumps.
      const [remaining] = [...pointers.current.values()];
      const v = viewRef.current;
      panStart.current = { x: remaining.x, y: remaining.y, ox: v.x, oy: v.y };
      setPanning(true);
    } else {
      setPanning(false);
    }
  };

  /** Distance and midpoint between the two active pointers. */
  function pinchState() {
    const [a, b] = [...pointers.current.values()];
    if (!a || !b) return null;

    return {
      dist: Math.hypot(b.x - a.x, b.y - a.y),
      mx: (a.x + b.x) / 2,
      my: (a.y + b.y) / 2,
    };
  }

  const reset = () => apply({ scale: 1, x: 0, y: 0 });

  const isEmpty = !loading && monitors.length === 0;

  return (
    <div className="relative size-full">
      {/* ---------------- Desktop: orbital canvas ---------------- */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          "relative hidden size-full touch-none select-none overflow-hidden md:block",
          isEmpty ? "cursor-default" : panning ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        <CanvasBackdrop scale={view.scale} offset={{ x: view.x, y: view.y }} />

        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
          }}
        >
          <OrbitRings />
          <BeamSweep reduce={Boolean(reduce)} />
          <BeaconCore reduce={Boolean(reduce)} />

          {!loading &&
            monitors.map((monitor, index) => {
              const { x, y } = worldPosition(index);

              return (
                <motion.div
                  key={monitor.id}
                  data-node
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: reduce ? 0 : index * 0.07 }}
                  style={{ position: "absolute", left: x - 124, top: y - 44 }}
                >
                  <MonitorCard
                    monitor={monitor}
                    selected={monitor.id === selectedId}
                    onSelect={() => onSelect(monitor)}
                  />
                </motion.div>
              );
            })}
        </div>

        {loading && <CanvasMessage>Loading monitors</CanvasMessage>}
        {isEmpty && <EmptyCanvas onCreate={onCreate} reduce={Boolean(reduce)} />}

        {/* Zoom controls — hidden when there's nothing to navigate. */}
        {!isEmpty && !loading && (
          <div
            data-nopan
            className="absolute bottom-4 left-4 flex items-center overflow-hidden rounded-sm border border-white/10 bg-black/80 backdrop-blur-md"
          >
            <ControlButton
              label="Zoom out"
              onClick={() => zoomAt(view.scale - 0.2, 0, 0)}
              disabled={view.scale <= MIN_SCALE}
            >
              <Minus className="size-3.5" />
            </ControlButton>

            <button
              type="button"
              onClick={reset}
              title="Reset view"
              className="min-w-14 py-2 font-mono text-[11px] tabular-nums text-white/55 transition-colors hover:text-white"
            >
              {Math.round(view.scale * 100)}%
            </button>

            <ControlButton
              label="Zoom in"
              onClick={() => zoomAt(view.scale + 0.2, 0, 0)}
              disabled={view.scale >= MAX_SCALE}
            >
              <Plus className="size-3.5" />
            </ControlButton>

            <ControlButton label="Reset view" onClick={reset}>
              <Maximize className="size-3.5" />
            </ControlButton>
          </div>
        )}
      </div>

      {/* ---------------- Tablet & mobile: grid ---------------- */}
      <div className="relative size-full overflow-y-auto md:hidden" data-lenis-prevent>
        <CanvasBackdrop scale={1} offset={{ x: 0, y: 0 }} />

        <div className="relative p-5">
          {loading ? (
            <p className="py-20 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
              Loading monitors
            </p>
          ) : isEmpty ? (
            <div className="py-16">
              <EmptyCanvas inline onCreate={onCreate} reduce={Boolean(reduce)} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {monitors.map((monitor, index) => (
                <motion.div
                  key={monitor.id}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : index * 0.05 }}
                >
                  <MonitorCard
                    monitor={monitor}
                    selected={monitor.id === selectedId}
                    onSelect={() => onSelect(monitor)}
                    fluid
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Starfield + radial depth. The dot grid is panned by background-position and
 * sized by scale rather than living inside the transform, so dots stay a
 * constant visual size at any zoom — that's what makes it read as a surface
 * you're moving over rather than an image being resized.
 */
function CanvasBackdrop({
  scale,
  offset,
}: {
  scale: number;
  offset: { x: number; y: number };
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />

      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.22) 0.6px, transparent 0.6px), radial-gradient(circle at center, rgba(255,255,255,0.10) 0.5px, transparent 0.5px)",
          backgroundSize: `${96 * scale}px ${96 * scale}px, ${41 * scale}px ${57 * scale}px`,
          backgroundPosition: `${offset.x}px ${offset.y}px, ${offset.x + 19}px ${offset.y + 27}px`,
        }}
      />

      {/* Two very low-opacity washes for depth. Violet is the only colour on
         the canvas and it never exceeds 6%. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(139,124,246,0.06),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_120%,rgba(255,255,255,0.04),transparent_70%)]" />
    </div>
  );
}

function OrbitRings() {
  return (
    <div aria-hidden className="pointer-events-none absolute">
      {[560, 900, 1260].map((size) => (
        <span
          key={size}
          className="absolute rounded-full border border-dashed border-white/[0.07]"
          style={{ width: size, height: size, left: -size / 2, top: -size / 2 }}
        />
      ))}
    </div>
  );
}

/** Radar-style sweep from the origin. The mark's whole idea, made spatial. */
function BeamSweep({ reduce }: { reduce: boolean }) {
  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -left-160 -top-160 size-320 rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.055)_0deg,transparent_38deg,transparent_360deg)]"
      animate={{ rotate: 360 }}
      transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      style={{
        maskImage: "radial-gradient(circle, black 12%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(circle, black 12%, transparent 72%)",
      }}
    />
  );
}

function BeaconCore({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="absolute -left-8 -top-8 grid size-16 place-items-center"
      animate={reduce ? undefined : { scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="absolute inset-[-110%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_62%)]" />
      <Image
        src="/brand/beacon-mark.png"
        alt=""
        width={256}
        height={256}
        className="relative size-8 w-auto mix-blend-screen"
      />
    </motion.div>
  );
}

function CanvasMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
        {children}
      </p>
    </div>
  );
}

/** Zero monitors: the canvas stays, the constellation doesn't. */
function EmptyCanvas({
  onCreate,
  reduce,
  inline = false,
}: {
  onCreate?: () => void;
  reduce: boolean;
  inline?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center px-6 text-center",
        inline ? "" : "absolute inset-0"
      )}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("flex flex-col items-center", inline ? "" : "mt-44")}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          Nothing in orbit
        </p>

        <h2 className="mt-3 max-w-sm text-lg font-normal leading-tight tracking-[-0.02em] text-white">
          Point Beacon at a URL{" "}
          <span className="text-white/30">and it appears here.</span>
        </h2>

        {onCreate && (
          <Button variant="white" size="sm" onClick={onCreate} className="mt-7">
            Create monitor
          </Button>
        )}
      </motion.div>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-9 place-items-center text-white/45 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-25"
    >
      {children}
    </button>
  );
}

/**
 * World coordinates in pixels. Six slots per ring, each ring wider and rotated
 * half a slot so nodes never share a spoke — deterministic, so positions are
 * identical on every render.
 */
function worldPosition(index: number) {
  const PER_RING = 6;
  const ring = Math.floor(index / PER_RING);
  const slot = index % PER_RING;

  const radius = 290 + ring * 190;
  const angle =
    (slot / PER_RING) * Math.PI * 2 + (ring * Math.PI) / PER_RING - Math.PI / 2;

  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

/* -------------------------------------------------------------------------- */

function MonitorCard({
  monitor,
  selected,
  onSelect,
  fluid = false,
}: {
  monitor: Moniters;
  selected: boolean;
  onSelect: () => void;
  fluid?: boolean;
}) {
  const url = monitor.url;
  const active = monitor.is_active;

  return (
    <button
      type="button"
      data-node
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative rounded-xl border p-3.5 text-left backdrop-blur-md",
        "transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        fluid ? "w-full" : "w-62",
        selected
          ? "border-white/30 bg-white/[0.055] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_50px_-24px_rgba(139,124,246,0.55)]"
          : "border-white/10 bg-white/[0.02] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "relative grid size-9 shrink-0 place-items-center rounded-lg border transition-colors duration-300",
            selected
              ? "border-white/20 bg-white/8"
              : "border-white/10 bg-white/4 group-hover:border-white/15"
          )}
        >
          <Globe className="size-4 text-white/60" />

          {/* Status pip on the tile corner — glanceable without reading in. */}
          <span
            aria-hidden
            className={cn(
              "absolute -right-1 -top-1 size-2 rounded-full ring-2 ring-black",
              active ? "bg-[#0ca30c]" : "bg-white/25"
            )}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[13px] font-medium text-white">
              {monitor.name}
            </p>
            <span className="shrink-0 rounded-[3px] border border-white/12 px-1.5 py-px font-mono text-[9px] tracking-tight text-white/50">
              {monitor.method}
            </span>
          </div>

          {url && (
            <p className="mt-1 truncate font-mono text-[10px] text-white/35">{url}</p>
          )}

          {/* Only what the payload actually contains. No uptime, no latency —
             those would be fabrications on a monitoring product. */}
          <p className="mt-2 flex items-center gap-2 font-mono text-[10px] text-white/45">
            <span className={active ? "text-white/70" : "text-white/35"}>
              {active ? "Active" : "Paused"}
            </span>
            <span aria-hidden className="text-white/15">·</span>
            <span>every {cadence(monitor.interval)}</span>
            <span aria-hidden className="text-white/15">·</span>
            <span>{monitor.timeout}s timeout</span>
          </p>
        </div>
      </div>
    </button>
  );
}
